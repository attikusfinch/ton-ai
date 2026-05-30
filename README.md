# TON AI

Acton + React starter for experimenting with a tiny language model that runs
through a TON smart contract.

The important idea: the contract owns the model state and deterministic
inference logic. Users chat with the model by sending normal TON transactions
with text comments, and the contract replies with a text-comment transaction.
The frontend connects a wallet, deploys or opens a model contract, loads model
data through owner/admin transactions, and renders the on-chain reply flow.

Read [SPEC.md](./SPEC.md) before implementation.

## Layout

- `app/` contains the React + Vite frontend.
- `contracts/` contains the Acton/Tolk contract sources, scripts, and tests.
- `wrappers-ts/` contains generated TypeScript wrappers for the contract ABI.
- `package.json`, `tsconfig.json`, and `vite.config.ts` configure the frontend
  toolchain.
- `package-lock.json` pins the npm dependency tree for reproducible installs.

## Current State

This repository now contains the first TinyLM/TinyNN contract MVP:

- `contracts/src/TinyLm.tolk` stores byte token data, exact on-chain knowledge,
  and a tiny recurrent neural state with 4-d embeddings, a recurrent step, and
  linear output heads.
- Users send a TON text comment; exact prompt knowledge can seed the reply, then
  TinyLM transitions may append a short deterministic tail. Unknown prompts run
  a byte-by-byte recurrent encoder, then an autoregressive linear-head + argmax
  decoder directly in the contract.
- The default deployment knows its name (`Tolki`), its creator
  (`User`, `@fiscalforever`), short answers about TON and Telegram, and a small
  default recurrent fallback that replies `I use tiny neural logits.` to
  infer-style questions and `I am fine on-chain.` to the default hello prompt.
- `wrappers-ts/TinyLm.gen.ts` is generated output and should not be hand-edited.
- Tests under `contracts/tests/` run the flow in Acton sandbox/emulation.

The current no-cache trained model path is TONGPT:

- Training lives outside this repo at `C:\Users\Admin\Desktop\TONGPT`.
- `contracts/src/TonGpt.tolk` runs a trained recurrent model directly in the
  contract: byte prompt embeddings, additive recurrent hidden state, learned
  output heads, token embeddings, and greedy decode.
- `contracts/src/tongpt_types.tolk` and `contracts/src/tongpt_weights.tolk` are
  generated from `TONGPT/exports/model.json`.
- TONGPT has no known-reply map, no prompt hashes, and no transition cache.
  Responses come from model weights evaluated on-chain.

The repository also includes a first pure TON sharding prototype:

- `contracts/src/ShardedLmCoordinator.tolk` accepts a prompt, creates an
  inference job, sends the hidden vector to child contracts, reduces shard
  logits, then uses on-chain token embeddings to repeat the shard round until
  the reply is built.
- `contracts/src/VocabShard.tolk` stores one page of output-head weights and
  returns only its local top token and score for the requested round.
- `contracts/tests/sharded.test.tolk` deploys one coordinator plus four child
  shards and verifies the full asynchronous multi-round message path in
  sandbox.

There is also a single-contract CraftGPT feasibility probe:

- `contracts/src/CraftGptMonoProbe.tolk` mirrors the lower-bound arithmetic
  shape of one CraftGPT token step: 6 transformer blocks, 240-wide state, and a
  1920-token output head, but without importing the 6 MB weight dump.
- `contracts/tests/craftgpt_probe.test.tolk` shows that 1000 weighted
  contributions already consume about 623k gas, while the one-token lower bound
  of 4,608,000 contributions hits the 1,000,000 gas transaction limit and fails
  with out-of-gas in sandbox.

## Install

```bash
npm ci
```

## Commands

```bash
npm run build
npm run typecheck
npm run fmt:check
npm run dev
```

When working with the Acton contract:

```bash
acton build
acton test
acton check
acton fmt --check
```

## Acton From WSL

On this machine Acton is available through WSL:

```bash
cd /mnt/c/Users/Admin/Desktop/ton-ai
$HOME/.acton/bin/acton build
$HOME/.acton/bin/acton test
```

## Notes

- The app uses Vite, npm, shadcn-style UI primitives, Tailwind CSS, TonConnect,
  and the TON SDK.
- CI runs `npm run typecheck`, `npm run build`, `npm run fmt:check`, and, when
  `Acton.toml` exists, `acton build`, `acton test`,
  `acton check --output-format github`, and `acton fmt --check`.
- Copy `.env.example` to a local `.env` for Toncenter keys. Both Acton CLI and
  the Vite app read `TONCENTER_MAINNET_API_KEY` and
  `TONCENTER_TESTNET_API_KEY`; Vite allows the `TONCENTER_` prefix via
  `envPrefix` in `vite.config.ts`.
