import {
  Address,
  Cell,
  Dictionary,
  beginCell,
  storeStateInit,
  toNano,
} from '@ton/core';

import model from './tongptModel.json';
import {
  TonGpt,
  TonGptHead,
  TonGptModelStorage,
  TonGptOutputWeights,
  TonGptPromptEmbeddings,
  TonGptVector,
  UploadTonGptOutputChunk,
  UploadTonGptPromptChunk,
  type TonGptHead as TonGptHeadValue,
  type TonGptJob as TonGptJobValue,
  type TonGptVector as TonGptVectorValue,
} from '@wrappers/TonGpt.gen';

type TongptModel = {
  hidden: number;
  max_context: number;
  max_generate: number;
  token_count: number;
  pieces: string[];
  byte_embeddings: Record<string, number[]>;
  position_embeddings: Record<string, number[]>;
  pair_embeddings: Record<string, number[]>;
  token_embeddings: Record<string, number[]>;
  heads: Record<string, Record<string, number>>;
};

const tongptModel = model as TongptModel;
const candidateChunkSize = 128;
const vectorUploadChunkSize = 16;
const headUploadChunkSize = 16;
const tokenBytesUploadChunkSize = 32;
export const uploadMessagesPerTransaction = 4;

export const replyValue = toNano('0.2').toString();
export const continueValue = toNano('0.08').toString();
export const deployValue = toNano('1').toString();
export const adminValue = toNano('0.05').toString();
export const uploadValue = toNano('0.03').toString();

export const defaultPrompts = [
  'Hello, how are you?',
  'What is your name?',
  'Who created you?',
  'What is TON?',
  'What is Telegram?',
  'Do you use cache?',
  'What cloud color is?',
  'What is pizza?',
];

const uploadChunkCount =
  Math.ceil(
    Object.keys(tongptModel.byte_embeddings).length / vectorUploadChunkSize,
  ) +
  Math.ceil(
    Object.keys(tongptModel.position_embeddings).length / vectorUploadChunkSize,
  ) +
  Math.ceil(
    Object.keys(tongptModel.pair_embeddings).length / vectorUploadChunkSize,
  ) +
  Math.ceil(
    Object.keys(tongptModel.token_embeddings).filter((key) => key !== '0')
      .length / vectorUploadChunkSize,
  ) +
  Math.ceil(Object.keys(tongptModel.heads).length / headUploadChunkSize) +
  Math.ceil(
    Math.max(0, tongptModel.pieces.length - 1) / tokenBytesUploadChunkSize,
  );

export const tongptMetadata = {
  hidden: tongptModel.hidden,
  tokenCount: tongptModel.token_count,
  maxContext: tongptModel.max_context,
  maxGenerate: tongptModel.max_generate,
  candidateChunkSize,
  continuationWindows: Math.ceil(tongptModel.token_count / candidateChunkSize),
  uploadChunks: uploadChunkCount,
  uploadTransactions: Math.ceil(
    uploadChunkCount / uploadMessagesPerTransaction,
  ),
};

export type TonGptUploadChunk = {
  label: string;
  entries: number;
  body: Cell;
};

export function textPayloadCell(text: string): Cell {
  return beginCell().storeStringTail(text).endCell();
}

export function textCommentCell(text: string): Cell {
  return beginCell().storeUint(0, 32).storeStringTail(text).endCell();
}

export function parseTextComment(cell: Cell): string | null {
  try {
    const slice = cell.beginParse();
    if (slice.remainingBits < 32 || slice.loadUint(32) !== 0) return null;
    return slice.loadStringTail();
  } catch {
    return null;
  }
}

function vectorFromArray(values: number[]): TonGptVectorValue {
  if (values.length !== tongptMetadata.hidden) {
    throw new Error(`TONGPT vector must have ${tongptMetadata.hidden} dims`);
  }
  const args: Record<string, bigint> = {};
  values.forEach((value, index) => {
    args[`v${index}`] = BigInt(value);
  });
  return TonGptVector.create(
    args as unknown as Parameters<typeof TonGptVector.create>[0],
  );
}

function headFromObject(head: Record<string, number>): TonGptHeadValue {
  const args: Record<string, bigint> = { bias: BigInt(head.bias) };
  for (let index = 0; index < tongptMetadata.hidden; index += 1) {
    args[`w${index}`] = BigInt(head[`w${index}`]);
  }
  return TonGptHead.create(
    args as unknown as Parameters<typeof TonGptHead.create>[0],
  );
}

function emptyVectorMap8(): Dictionary<bigint, TonGptVectorValue> {
  return Dictionary.empty<bigint, TonGptVectorValue>(
    Dictionary.Keys.BigUint(8),
  );
}

function emptyVectorMap16(): Dictionary<bigint, TonGptVectorValue> {
  return Dictionary.empty<bigint, TonGptVectorValue>(
    Dictionary.Keys.BigUint(16),
  );
}

function emptyHeadMap(): Dictionary<bigint, TonGptHeadValue> {
  return Dictionary.empty<bigint, TonGptHeadValue>(Dictionary.Keys.BigUint(16));
}

function emptyTokenBytesMap(): Dictionary<bigint, Cell> {
  return Dictionary.empty<bigint, Cell>(
    Dictionary.Keys.BigUint(16),
    Dictionary.Values.Cell(),
  );
}

function numericEntries<T>(record: Record<string, T>): Array<[number, T]> {
  return Object.entries(record)
    .map(([key, value]) => [Number(key), value] as [number, T])
    .sort(([left], [right]) => left - right);
}

function chunksOf<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export function createDefaultByteEmbeddings(): Dictionary<
  bigint,
  TonGptVectorValue
> {
  const embeddings = Dictionary.empty<bigint, TonGptVectorValue>(
    Dictionary.Keys.BigUint(8),
  );
  for (const [key, value] of Object.entries(tongptModel.byte_embeddings)) {
    embeddings.set(BigInt(key), vectorFromArray(value));
  }
  return embeddings;
}

export function createDefaultTokenEmbeddings(): Dictionary<
  bigint,
  TonGptVectorValue
> {
  const embeddings = Dictionary.empty<bigint, TonGptVectorValue>(
    Dictionary.Keys.BigUint(16),
  );
  for (const [key, value] of Object.entries(tongptModel.token_embeddings)) {
    if (key === '0') continue;
    embeddings.set(BigInt(key), vectorFromArray(value));
  }
  return embeddings;
}

export function createDefaultPositionEmbeddings(): Dictionary<
  bigint,
  TonGptVectorValue
> {
  const embeddings = Dictionary.empty<bigint, TonGptVectorValue>(
    Dictionary.Keys.BigUint(8),
  );
  for (const [key, value] of Object.entries(tongptModel.position_embeddings)) {
    embeddings.set(BigInt(key), vectorFromArray(value));
  }
  return embeddings;
}

export function createDefaultPairEmbeddings(): Dictionary<
  bigint,
  TonGptVectorValue
> {
  const embeddings = Dictionary.empty<bigint, TonGptVectorValue>(
    Dictionary.Keys.BigUint(16),
  );
  for (const [key, value] of Object.entries(tongptModel.pair_embeddings)) {
    embeddings.set(BigInt(key), vectorFromArray(value));
  }
  return embeddings;
}

export function createDefaultHeads(): Dictionary<bigint, TonGptHeadValue> {
  const heads = Dictionary.empty<bigint, TonGptHeadValue>(
    Dictionary.Keys.BigUint(16),
  );
  for (const [key, value] of Object.entries(tongptModel.heads)) {
    heads.set(BigInt(key), headFromObject(value));
  }
  return heads;
}

export function createDefaultTokenBytes(): Dictionary<bigint, Cell> {
  const tokens = Dictionary.empty<bigint, Cell>(
    Dictionary.Keys.BigUint(16),
    Dictionary.Values.Cell(),
  );
  tongptModel.pieces.forEach((piece, tokenId) => {
    if (tokenId === 0) return;
    tokens.set(BigInt(tokenId), textPayloadCell(piece));
  });
  return tokens;
}

export function createTonGptForOwner(owner: Address): TonGpt {
  return TonGpt.fromStorage({
    owner,
    nextJobId: 1n,
    maxContext: BigInt(tongptModel.max_context),
    maxGenerate: BigInt(tongptModel.max_generate),
    eosToken: 0n,
    candidateCount: BigInt(tongptModel.token_count),
    model: {
      ref: TonGptModelStorage.create({
        prompt: {
          ref: TonGptPromptEmbeddings.create({
            byteEmbeddings: emptyVectorMap8(),
            positionEmbeddings: emptyVectorMap8(),
            pairEmbeddings: emptyVectorMap16(),
          }),
        },
        output: {
          ref: TonGptOutputWeights.create({
            tokenEmbeddings: emptyVectorMap16(),
            heads: emptyHeadMap(),
            tokenBytes: emptyTokenBytesMap(),
          }),
        },
      }),
    },
    jobs: Dictionary.empty<bigint, TonGptJobValue>(Dictionary.Keys.BigUint(32)),
    isPaused: false,
  });
}

function createPromptUploadBody(args: {
  byteEmbeddings?: Dictionary<bigint, TonGptVectorValue>;
  positionEmbeddings?: Dictionary<bigint, TonGptVectorValue>;
  pairEmbeddings?: Dictionary<bigint, TonGptVectorValue>;
}): Cell {
  return UploadTonGptPromptChunk.toCell(
    UploadTonGptPromptChunk.create({
      byteEmbeddings: args.byteEmbeddings ?? emptyVectorMap8(),
      positionEmbeddings: args.positionEmbeddings ?? emptyVectorMap8(),
      pairEmbeddings: args.pairEmbeddings ?? emptyVectorMap16(),
    }),
  );
}

function createOutputUploadBody(args: {
  tokenEmbeddings?: Dictionary<bigint, TonGptVectorValue>;
  heads?: Dictionary<bigint, TonGptHeadValue>;
  tokenBytes?: Dictionary<bigint, Cell>;
}): Cell {
  return UploadTonGptOutputChunk.toCell(
    UploadTonGptOutputChunk.create({
      tokenEmbeddings: args.tokenEmbeddings ?? emptyVectorMap16(),
      heads: args.heads ?? emptyHeadMap(),
      tokenBytes: args.tokenBytes ?? emptyTokenBytesMap(),
    }),
  );
}

export function createTonGptUploadChunks(): TonGptUploadChunk[] {
  const chunks: TonGptUploadChunk[] = [];

  chunksOf(
    numericEntries(tongptModel.byte_embeddings),
    vectorUploadChunkSize,
  ).forEach((entries, index) => {
    const byteEmbeddings = emptyVectorMap8();
    entries.forEach(([key, value]) => {
      byteEmbeddings.set(BigInt(key), vectorFromArray(value));
    });
    chunks.push({
      label: `byte embeddings ${index + 1}`,
      entries: entries.length,
      body: createPromptUploadBody({ byteEmbeddings }),
    });
  });

  chunksOf(
    numericEntries(tongptModel.position_embeddings),
    vectorUploadChunkSize,
  ).forEach((entries, index) => {
    const positionEmbeddings = emptyVectorMap8();
    entries.forEach(([key, value]) => {
      positionEmbeddings.set(BigInt(key), vectorFromArray(value));
    });
    chunks.push({
      label: `position embeddings ${index + 1}`,
      entries: entries.length,
      body: createPromptUploadBody({ positionEmbeddings }),
    });
  });

  chunksOf(
    numericEntries(tongptModel.pair_embeddings),
    vectorUploadChunkSize,
  ).forEach((entries, index) => {
    const pairEmbeddings = emptyVectorMap16();
    entries.forEach(([key, value]) => {
      pairEmbeddings.set(BigInt(key), vectorFromArray(value));
    });
    chunks.push({
      label: `pair embeddings ${index + 1}`,
      entries: entries.length,
      body: createPromptUploadBody({ pairEmbeddings }),
    });
  });

  chunksOf(
    numericEntries(tongptModel.token_embeddings).filter(([key]) => key !== 0),
    vectorUploadChunkSize,
  ).forEach((entries, index) => {
    const tokenEmbeddings = emptyVectorMap16();
    entries.forEach(([key, value]) => {
      tokenEmbeddings.set(BigInt(key), vectorFromArray(value));
    });
    chunks.push({
      label: `token embeddings ${index + 1}`,
      entries: entries.length,
      body: createOutputUploadBody({ tokenEmbeddings }),
    });
  });

  chunksOf(numericEntries(tongptModel.heads), headUploadChunkSize).forEach(
    (entries, index) => {
      const heads = emptyHeadMap();
      entries.forEach(([key, value]) => {
        heads.set(BigInt(key), headFromObject(value));
      });
      chunks.push({
        label: `heads ${index + 1}`,
        entries: entries.length,
        body: createOutputUploadBody({ heads }),
      });
    },
  );

  chunksOf(
    tongptModel.pieces
      .map((piece, tokenId) => [tokenId, piece] as [number, string])
      .filter(([tokenId]) => tokenId !== 0),
    tokenBytesUploadChunkSize,
  ).forEach((entries, index) => {
    const tokenBytes = emptyTokenBytesMap();
    entries.forEach(([tokenId, piece]) => {
      tokenBytes.set(BigInt(tokenId), textPayloadCell(piece));
    });
    chunks.push({
      label: `token bytes ${index + 1}`,
      entries: entries.length,
      body: createOutputUploadBody({ tokenBytes }),
    });
  });

  return chunks;
}

export function cellToBase64(cell: Cell): string {
  return cell.toBoc().toString('base64');
}

export function stateInitToBase64(contract: TonGpt): string {
  if (!contract.init) throw new Error('Missing contract init');
  return beginCell()
    .store(storeStateInit(contract.init))
    .endCell()
    .toBoc()
    .toString('base64');
}

export function bodyFromText(text: string): string {
  return cellToBase64(textCommentCell(text));
}

export function bodyFromContinue(jobId: bigint): string {
  return cellToBase64(TonGpt.createCellOfContinueTonGpt({ jobId }));
}

export function bodyFromCell(cell: Cell): string {
  return cellToBase64(cell);
}
