# TON AI Spec

## Product Goal

Build a small, honest on-chain AI demo on TON: a smart contract stores a tiny
language model and performs deterministic inference when it receives a normal
TON transaction with a text comment.

This is not a plan to run a production-scale transformer inside TON. The first
goal is a compact model that is small enough to reason about, test, deploy, and
call from a frontend.

The frontend should stay thin:

- connect wallet through TonConnect;
- deploy or open a model contract;
- send user prompts as TON text-comment transactions;
- show the contract reply transaction, also encoded as a text comment;
- send owner/admin transactions for model updates;
- call get-methods only for inspection/debug panels;
- never ask for seed phrases, mnemonics, recovery phrases, or private keys.

## MVP Scope

Start with a tiny deterministic language model, not a full LLM.

Recommended first model:

- fixed vocabulary of short tokens;
- byte-level tokens for the first version;
- tiny neural weights stored on-chain: token embeddings, a recurrent step, and
  linear output heads;
- small transition table for explicit owner overrides and simple experiments;
- exact prompt hash to known reply table that can seed generated tails;
- deterministic prompt encoding plus autoregressive token generation;
- owner-only messages for loading or replacing model and knowledge chunks.

The first win is a working on-chain inference kernel:

1. deploy contract with owner and model metadata;
2. store a small vocabulary, neural weights, transition overrides, and exact known replies;
3. user sends a TON text comment as prompt;
4. contract hashes the prompt and checks on-chain knowledge;
5. if known, contract starts with the stored answer and may append a TinyLM tail;
6. otherwise contract encodes prompt bytes through the recurrent neural step and
   generates through TinyLM fallback;
7. contract sends a reply transaction with a text comment.

## Contract

Initial contract target:

```text
TinyLm.tolk
```

Recommended storage:

```text
owner: address
modelVersion: uint32
vocabSize: uint16
maxContext: uint8
maxGenerate: uint8
tokenBytes: dict<uint16, cell>
transitions: dict<uint16, TransitionRow>
neuralState: ^NeuralState
knownReplies: dict<uint256, cell>
isPaused: bool
```

Types:

```text
TransitionRow {
  nextToken: uint16
  score: int16
}

NeuralEmbedding {
  e0: int16
  e1: int16
  e2: int16
  e3: int16
}

NeuralHead {
  w0: int16
  w1: int16
  w2: int16
  w3: int16
  bias: int16
}

NeuralStep {
  inputW0: int16
  inputW1: int16
  inputW2: int16
  inputW3: int16
  recurrentW0: int16
  recurrentW1: int16
  recurrentW2: int16
  recurrentW3: int16
  bias0: int16
  bias1: int16
  bias2: int16
  bias3: int16
}

NeuralState {
  embeddings: dict<uint16, NeuralEmbedding>
  step: NeuralStep
  heads: dict<uint16, NeuralHead>
}
```

For the first version, keep the model deliberately simple. Transitions are keyed
by the previous token and act as explicit overrides:

```text
key = previousToken:uint16
```

Later versions can use a packed n-gram key:

```text
key = tokenA:uint16 << 48 | tokenB:uint16 << 32 | tokenC:uint16 << 16 | tokenD:uint16
```

## Messages

State-changing actions are internal messages:

```text
SetPaused(isPaused)
SetModelMeta(modelVersion, vocabSize, maxContext, maxGenerate)
SetToken(tokenId, bytes)
SetTransition(previousToken, nextToken, score)
ClearTransition(previousToken)
SetKnownReply(promptHash, replyBody)
ClearKnownReply(promptHash)
Withdraw(to, amount)
```

Owner-only messages:

```text
SetPaused
SetModelMeta
SetToken
SetTransition
ClearTransition
SetKnownReply
ClearKnownReply
Withdraw
```

## Prompt Protocol

User prompts are ordinary TON text comments:

```text
opcode:uint32 = 0
utf8 bytes...
```

TinyLM v1 treats the comment body as byte tokens. Owner-defined transition rows
can still override very small experiments:

```text
comment "a" -> previousToken 97
transition[97] = 98
reply comment "b"
```

The reply is also a normal text comment. For unknown prompts, the contract
encodes every prompt byte into a 4-d hidden state:

```text
h' = bounded_relu((embedding(byte) * inputW + h * recurrentW) / 16 + bias)
```

If the last prompt byte has a transition override, the contract follows that
override for backwards-compatible byte experiments. Otherwise it scores fixed
output candidate heads from the hidden state, chooses argmax, appends the token,
steps the recurrent state with that generated token embedding, and repeats until
`maxGenerate`, a missing generated-token embedding/head, or the cell size limit
stops generation:

```text
opcode:uint32 = 0
tokenBytes[nextToken0] + tokenBytes[nextToken1] + ...
```

## Knowledge Layer

TinyLM v1.1 checks exact prompt knowledge before model fallback. A known
reply is not necessarily final: it becomes the base answer, and TinyLM can append
a short deterministic tail by starting from the last byte of that base answer.

```text
promptHash = hash(comment bytes after opcode 0)
reply = knownReplies[promptHash]
if reply exists:
  previousToken = last byte in reply
  while generated < maxGenerate and nextModelToken(previousToken) exists:
    append tokenBytes[nextToken]
    previousToken = nextToken
  send reply
else:
  hidden = encode all prompt bytes through NeuralStep
  while generated < maxGenerate and neural head argmax exists:
    append tokenBytes[nextToken]
    hidden = step(hidden, embedding(nextToken))
  if no token was generated:
    send "?"
```

The default knowledge map includes compact answers for:

```text
What is your name? -> I am Tolki.
Who created you? -> I was created by User (@fiscalforever).
What is TON? -> TON is The Open Network...
What is Telegram? -> Telegram is a cloud-based messaging app...
How do you work?
Can I add new knowledge?
What happens if you do not know the answer?
```

## Get Methods

Get methods are for inspection, debugging, and local tooling:

```text
config()
token(tokenId)
transition(previousToken)
neuralEmbedding(tokenId)
neuralHead(tokenId)
neuralPredictNext(previousToken)
predictNext(previousToken)
```

## Inference Rule

The transaction generation rule is intentionally small but really neural:

```text
encodePrompt(promptBytes):
  assert !isPaused
  assert prompt length <= maxContext

  hidden = [0, 0, 0, 0]
  for byte in promptBytes:
    embedding = neuralState.embeddings[byte] or fallbackByteEmbedding(byte)
    hidden = bounded_relu((embedding * inputW + hidden * recurrentW) / 16 + bias)
  return hidden

decode(hidden):
  best = argmax over fixed candidate heads:
    hidden[0] * w0 + hidden[1] * w1 + hidden[2] * w2 + hidden[3] * w3 + bias

  append tokenBytes[best]
  hidden = step(hidden, neuralState.embeddings[best])
  repeat
```

`nextModelToken(previousToken)` still exists for owner transition overrides and
single-token debugging:

```text
nextModelToken(previousToken):
  row = transitions[previousToken]
  if row exists:
    return row.nextToken
  hidden = step([0,0,0,0], embeddings[previousToken])
  return decode one token from hidden
```

The `predictNext(previousToken)` get-method is kept for the explicit transition
table and returns token `0` when no transition exists. The
`neuralPredictNext(previousToken)` get-method exposes the single-token recurrent
path directly.

Transaction replies use this prediction rule in a loop:

```text
generate(prompt):
  result = text-comment opcode
  hidden = encodePrompt(prompt)
  while generated < maxGenerate:
    nextToken = decode(hidden)
    if no next token:
      break
    append tokenBytes[nextToken]
    hidden = step(hidden, embedding(nextToken))
  if generated == 0:
    append "?"
  send result
```

For transaction comments:

```text
on text comment:
  if knownReplies[hash(prompt)] exists:
    reply = known reply comment
    append generated TinyLM tail if transitions exist
    send reply comment back to sender
  else:
    generate(prompt)
```

## Test Plan

Tolk tests should cover:

- deploy exposes initial config;
- owner can update model metadata;
- non-owner cannot update model metadata;
- owner can set token bytes;
- owner can set transition rows;
- default knowledge answers identity, creator, TON, and Telegram questions;
- unknown questions use the default recurrent TinyNN prompt encoder + logits;
- different unknown prompt shapes can produce different fallback logits;
- `neuralPredictNext` returns the configured default neural token sequence;
- known replies can be extended by TinyLM-generated tails;
- owner can add and clear known replies;
- `predictNext` returns the configured next token;
- unknown transition falls back to token `0`;
- prompt comment produces a reply comment transaction;
- paused contract rejects prompt comments;
- invalid token ids fail with named errors.

## Frontend Plan

React/Vite app:

- TonConnect button;
- network selector;
- deploy model form;
- open existing model by address;
- prompt input that sends a TON transaction with a text comment;
- transaction status and reply watcher;
- admin panel for token/transition/known-reply upload;
- show raw debug output during early development.

The frontend should not reimplement inference. It may tokenize text for user
input if the token vocabulary is known, but the model decision and reply must
come from the contract transaction flow.

## Pure TON Sharding Prototype

For larger on-chain models, inference can be split across child contracts. The
first prototype uses:

- `ShardedLmCoordinator`: accepts prompt comments, creates jobs, sends hidden
  vectors to children, reduces shard results, appends the winning token to the
  reply body, loads the next token embedding from on-chain storage, and repeats
  until the short answer is complete;
- `VocabShard`: stores a page of output-head weights and returns only local
  `topToken + score` for the requested round;
- four shard contracts in sandbox, each with two candidate tokens. The current
  test model emits four token pieces per answer.

The message flow is intentionally asynchronous:

```text
User -> Coordinator(prompt)
Coordinator -> VocabShard[0..3](jobId, round, hidden)
VocabShard[i] -> Coordinator(jobId, round, localTopToken, localTopScore)
Coordinator -> VocabShard[0..3](jobId, nextRound, nextHidden)
...
Coordinator -> User(generated text comment)
```

This proves the path where storage and compute are distributed across TON
contracts. The current prototype already repeats the coordinator/shard round per
generated token and keeps shard weights behind a page cell. The next version
should replace the two-candidate toy pages with packed quantized matrix pages
and a real tokenizer/export pipeline.

## CraftGPT Single-Contract Probe

CraftGPT itself is a much larger target than TinyLM: the reference emulator uses
6 transformer blocks, 5 attention heads, `EMBED_SIZE = 240`, `VOCAB_SIZE = 1920`,
and a 64-token context. The checked-in weight files are roughly 6 MB, so storage
is close to the single-account ceiling but not the first blocker. The blocker is
transaction compute.

`CraftGptMonoProbe.tolk` keeps this test honest without hand-porting the full
weight dump. It runs a deterministic weighted-contribution loop sized like the
lower bound of one CraftGPT token step:

```text
6 * (QKV + attention projection + MLP up/down) + lm_head
= 6 * (3 * 240 * 240 + 240 * 240 + 2 * 240 * 960) + 1920 * 240
= 4,608,000 weighted contributions
```

This excludes layernorm, softmax, KV-cache movement, tokenizer and sampling, so
it is intentionally optimistic. In Acton sandbox, 1000 weighted contributions
consume about `623519` gas, while the 4,608,000-contribution one-token probe
hits `1000000` gas and exits with out-of-gas (`-14`). Full CraftGPT therefore
does not fit a single ordinary TON transaction; any real path needs a much
smaller student model or an async multi-transaction execution scheme.

## TONGPT Student Model

The first trained student lives in `C:\Users\Admin\Desktop\TONGPT`. It is trained
outside the contract and exported into Tolk source files:

- `TONGPT/train.py`: trains and quantizes the model;
- `TONGPT/dataset.jsonl`: small instruction dataset for Tolki/TON/Telegram
  behavior;
- `TONGPT/exports/model.json`: quantized manifest;
- `TONGPT/exports/tongpt_types.tolk` and
  `TONGPT/exports/tongpt_weights.tolk`: generated contract model files.

The on-chain contract is `TonGpt.tolk`. It intentionally has no exact-answer
cache:

```text
comment bytes
-> learned byte embeddings
-> additive recurrent hidden state
-> learned linear output-head logits
-> greedy answer token
-> optional EOS step
-> text-comment reply
```

The first working export uses 16 hidden dimensions, 128-byte prompt vocabulary,
11 output tokens, and `maxGenerate = 2`. Output tokens are short answer tokens
rather than word pieces so the full neural forward-pass fits one ordinary TON
transaction. Word-piece generation was tested first, but 66 candidates and up to
18 generated pieces exceeded the transaction gas limit.

## Acton Workflow

Use WSL where Acton is installed:

```bash
cd /mnt/c/Users/Admin/Desktop/ton-ai
$HOME/.acton/bin/acton build
$HOME/.acton/bin/acton test
$HOME/.acton/bin/acton wrapper TinyLm --ts --output-dir wrappers-ts
npm ci
npm run dev
```

Common commands:

```bash
$HOME/.acton/bin/acton build
$HOME/.acton/bin/acton test
$HOME/.acton/bin/acton check
$HOME/.acton/bin/acton fmt
$HOME/.acton/bin/acton script contracts/scripts/deploy.tolk
$HOME/.acton/bin/acton script contracts/scripts/deploy.tolk --net testnet
```

## First Implementation Task

Implement the first MVP of TON AI.

Step 1:

- Add a frontend chat form that sends a TON text-comment transaction.
- Watch for or link to the contract reply transaction.
- Add owner/admin tooling for loading byte tokens, transitions, and known replies.
- Keep inference deterministic and computed inside the contract.

Current contract MVP already includes:

- `TinyLm.tolk`;
- owner-only model metadata, token, transition, known-reply, pause, and withdraw messages;
- `config`, `token`, `transition`, `neuralEmbedding`, `neuralHead`,
  `neuralPredictNext`, and `predictNext` get-methods;
- sandbox tests for transaction comment prompts, known replies, and reply comments.
