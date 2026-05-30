import {
  Address,
  Cell,
  Dictionary,
  beginCell,
  storeStateInit,
  toNano,
} from '@ton/core';

import {
  NeuralEmbedding,
  NeuralHead,
  NeuralStep,
  NeuralState,
  TinyLm,
  type CellRef,
  type NeuralEmbedding as NeuralEmbeddingValue,
  type NeuralHead as NeuralHeadValue,
  type NeuralStep as NeuralStepValue,
  type NeuralState as NeuralStateValue,
  type TransitionRow as TransitionRowValue,
} from '@wrappers/TinyLm.gen';

type KnownReply = {
  prompt: string;
  reply: string;
};

export const replyValue = toNano('0.2').toString();
export const deployValue = toNano('0.5').toString();
export const adminValue = toNano('0.05').toString();

export const defaultPrompts = [
  'Hello, how are you?',
  'What can you really infer?',
  'What is your name?',
  'Who created you?',
  'What is TON?',
  'What is Telegram?',
];

const defaultKnownReplies: KnownReply[] = [
  { prompt: 'What is your name?', reply: 'I am Tolki.' },
  { prompt: 'Who are you?', reply: 'I am Tolki.' },
  {
    prompt: 'Who created you?',
    reply: 'I was created by User (@fiscalforever).',
  },
  {
    prompt: 'Who is your creator?',
    reply: 'I was created by User (@fiscalforever).',
  },
  {
    prompt: 'Who made you?',
    reply: 'I was created by User (@fiscalforever).',
  },
  {
    prompt: 'What are you?',
    reply: 'I am Tolki, a tiny AI living in a TON smart contract.',
  },
  {
    prompt: 'What can you do?',
    reply: 'I am Tolki, a tiny AI living in a TON smart contract.',
  },
  {
    prompt: 'How do you work?',
    reply:
      'I read TON transaction comments, check on-chain knowledge, and reply with comments.',
  },
  {
    prompt: 'Are you really on-chain?',
    reply:
      'I read TON transaction comments, check on-chain knowledge, and reply with comments.',
  },
  {
    prompt: 'What is TON?',
    reply:
      'TON is The Open Network, a scalable L1 blockchain for apps, payments, and smart contracts.',
  },
  {
    prompt: 'What is The Open Network?',
    reply:
      'TON is The Open Network, a scalable L1 blockchain for apps, payments, and smart contracts.',
  },
  {
    prompt: 'What is Telegram?',
    reply:
      'Telegram is a cloud-based messaging app focused on speed and security.',
  },
  {
    prompt: 'How is Telegram related to TON?',
    reply:
      'Telegram gives TON apps a human-friendly place to reach users through chats and wallets.',
  },
  {
    prompt: 'Can I add new knowledge?',
    reply:
      'My owner can add knowledge by storing prompt hashes and reply comments on-chain.',
  },
  {
    prompt: 'How do I train you?',
    reply:
      'My owner can add knowledge by storing prompt hashes and reply comments on-chain.',
  },
  {
    prompt: 'What happens if you do not know the answer?',
    reply:
      'If I do not know an answer, I run a tiny on-chain recurrent model.',
  },
];

export function textPayloadCell(text: string): Cell {
  return beginCell().storeStringTail(text).endCell();
}

export function textCommentCell(text: string): Cell {
  return beginCell().storeUint(0, 32).storeStringTail(text).endCell();
}

export function promptHash(prompt: string): bigint {
  const hash = textPayloadCell(prompt).hash().toString('hex');
  return BigInt(`0x${hash}`);
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

export function createDefaultKnownReplies(): Dictionary<bigint, Cell> {
  const replies = Dictionary.empty(
    Dictionary.Keys.BigUint(256),
    Dictionary.Values.Cell(),
  );

  for (const item of defaultKnownReplies) {
    replies.set(promptHash(item.prompt), textCommentCell(item.reply));
  }

  return replies;
}

export function createDefaultTokenBytes(): Dictionary<bigint, Cell> {
  const tokens = Dictionary.empty(
    Dictionary.Keys.BigUint(16),
    Dictionary.Values.Cell(),
  );

  tokens.set(0n, textPayloadCell('?'));
  tokens.set(200n, textPayloadCell('I'));
  tokens.set(201n, textPayloadCell(' use'));
  tokens.set(202n, textPayloadCell(' tiny'));
  tokens.set(203n, textPayloadCell(' neural logits.'));
  tokens.set(210n, textPayloadCell('I'));
  tokens.set(211n, textPayloadCell(' am'));
  tokens.set(212n, textPayloadCell(' fine'));
  tokens.set(213n, textPayloadCell(' on-chain.'));

  return tokens;
}

export function createDefaultTransitions(): Dictionary<
  bigint,
  TransitionRowValue
> {
  const transitions = Dictionary.empty<bigint, TransitionRowValue>(
    Dictionary.Keys.BigUint(16),
  );

  return transitions;
}

export function createDefaultNeuralEmbeddings(): Dictionary<
  bigint,
  NeuralEmbeddingValue
> {
  const embeddings = Dictionary.empty<bigint, NeuralEmbeddingValue>(
    Dictionary.Keys.BigUint(16),
  );

  embeddings.set(
    0x3fn,
    NeuralEmbedding.create({ e0: 16n, e1: 0n, e2: 0n, e3: 0n }),
  );
  embeddings.set(
    200n,
    NeuralEmbedding.create({ e0: 0n, e1: 0n, e2: 64n, e3: 0n }),
  );
  embeddings.set(
    201n,
    NeuralEmbedding.create({ e0: 0n, e1: 0n, e2: 0n, e3: 64n }),
  );
  embeddings.set(
    202n,
    NeuralEmbedding.create({ e0: 64n, e1: 64n, e2: 0n, e3: 0n }),
  );
  embeddings.set(
    210n,
    NeuralEmbedding.create({ e0: 0n, e1: 0n, e2: 64n, e3: 64n }),
  );
  embeddings.set(
    211n,
    NeuralEmbedding.create({ e0: 64n, e1: 0n, e2: 0n, e3: 64n }),
  );
  embeddings.set(
    212n,
    NeuralEmbedding.create({ e0: 0n, e1: 64n, e2: 64n, e3: 0n }),
  );

  return embeddings;
}

export function createDefaultNeuralStep(): NeuralStepValue {
  return NeuralStep.create({
    inputW0: 16n,
    inputW1: 16n,
    inputW2: 16n,
    inputW3: 16n,
    recurrentW0: 16n,
    recurrentW1: 16n,
    recurrentW2: 16n,
    recurrentW3: 16n,
    bias0: 0n,
    bias1: 0n,
    bias2: 0n,
    bias3: 0n,
  });
}

export function createDefaultNeuralHeads(): Dictionary<bigint, NeuralHeadValue> {
  const heads = Dictionary.empty<bigint, NeuralHeadValue>(
    Dictionary.Keys.BigUint(16),
  );

  heads.set(
    200n,
    NeuralHead.create({ w0: 80n, w1: 0n, w2: 0n, w3: 0n, bias: 0n }),
  );
  heads.set(
    201n,
    NeuralHead.create({ w0: 0n, w1: 0n, w2: 50n, w3: 0n, bias: 0n }),
  );
  heads.set(
    202n,
    NeuralHead.create({ w0: 0n, w1: 0n, w2: 0n, w3: 50n, bias: 0n }),
  );
  heads.set(
    203n,
    NeuralHead.create({ w0: 45n, w1: 45n, w2: 0n, w3: 0n, bias: 0n }),
  );
  heads.set(
    210n,
    NeuralHead.create({ w0: 0n, w1: 80n, w2: 0n, w3: 0n, bias: 0n }),
  );
  heads.set(
    211n,
    NeuralHead.create({ w0: 0n, w1: 0n, w2: 45n, w3: 45n, bias: 0n }),
  );
  heads.set(
    212n,
    NeuralHead.create({ w0: 45n, w1: 0n, w2: 0n, w3: 45n, bias: 0n }),
  );
  heads.set(
    213n,
    NeuralHead.create({ w0: 0n, w1: 45n, w2: 45n, w3: 0n, bias: 0n }),
  );

  return heads;
}

export function createDefaultNeuralState(): CellRef<NeuralStateValue> {
  return {
    ref: NeuralState.create({
      embeddings: createDefaultNeuralEmbeddings(),
      step: createDefaultNeuralStep(),
      heads: createDefaultNeuralHeads(),
    }),
  };
}

export function createTinyLmForOwner(owner: Address): TinyLm {
  return TinyLm.fromStorage({
    owner,
    modelVersion: 1n,
    vocabSize: 256n,
    maxContext: 64n,
    maxGenerate: 8n,
    tokenBytes: createDefaultTokenBytes(),
    transitions: createDefaultTransitions(),
    neuralState: createDefaultNeuralState(),
    knownReplies: createDefaultKnownReplies(),
    isPaused: false,
  });
}

export function cellToBase64(cell: Cell): string {
  return cell.toBoc().toString('base64');
}

export function stateInitToBase64(contract: TinyLm): string {
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

export function bodyFromCell(cell: Cell): string {
  return cellToBase64(cell);
}
