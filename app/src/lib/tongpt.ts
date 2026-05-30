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

export const replyValue = toNano('0.2').toString();
export const continueValue = toNano('0.08').toString();
export const deployValue = toNano('1').toString();
export const adminValue = toNano('0.05').toString();

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

export const tongptMetadata = {
  hidden: tongptModel.hidden,
  tokenCount: tongptModel.token_count,
  maxContext: tongptModel.max_context,
  maxGenerate: tongptModel.max_generate,
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
    model: {
      ref: TonGptModelStorage.create({
        prompt: {
          ref: TonGptPromptEmbeddings.create({
            byteEmbeddings: createDefaultByteEmbeddings(),
            positionEmbeddings: createDefaultPositionEmbeddings(),
            pairEmbeddings: createDefaultPairEmbeddings(),
          }),
        },
        output: {
          ref: TonGptOutputWeights.create({
            tokenEmbeddings: createDefaultTokenEmbeddings(),
            heads: createDefaultHeads(),
            tokenBytes: createDefaultTokenBytes(),
          }),
        },
      }),
    },
    jobs: Dictionary.empty<bigint, TonGptJobValue>(Dictionary.Keys.BigUint(32)),
    isPaused: false,
  });
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
