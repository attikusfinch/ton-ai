# TON On-chain Minecraft

Acton + React starter for a Minecraft-like voxel world on TON.

The important idea: the contract calculates the world and returns ready-to-draw
view data through get-methods. The frontend connects a wallet, sends
transactions for actions, calls get-methods, decodes packed output, and draws it.

Read [SPEC.md](./SPEC.md) before implementation.

## Layout

- `app/` contains the React + Vite frontend.
- `package.json`, `tsconfig.json`, and `vite.config.ts` configure the app
  toolchain.
- `package-lock.json` pins the npm dependency tree for reproducible installs.
- When generated with `acton new --template empty --app`, the Acton contract
  sources, scripts, tests, and Tolk wrappers live under `contracts/`.

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

When this app is generated inside an Acton project, the usual Acton commands are
available from the same directory:

```bash
acton build
acton test
acton check
acton fmt --check
```

## Acton From WSL

On this machine Acton is installed in WSL:

```bash
cd /mnt/c/Users/Admin/Desktop/ton-onchain-minecraft
$HOME/.acton/bin/acton build
$HOME/.acton/bin/acton test
```

## Notes

- The app uses Vite, npm, shadcn-style UI primitives, and Tailwind CSS.
- CI runs `npm run typecheck`, `npm run build`, `npm run fmt:check`, and,
  when `Acton.toml` exists, `acton build`, `acton test`,
  `acton check --output-format github`, and `acton fmt --check`.
- Copy `.env.example` to a local `.env` for Toncenter keys. Both Acton CLI
  (when this app is generated inside an Acton project) and the Vite app read
  `TONCENTER_MAINNET_API_KEY` and `TONCENTER_TESTNET_API_KEY`; Vite allows the
  `TONCENTER_` prefix via `envPrefix` in `vite.config.ts`.
