# TON On-chain Minecraft Spec

## Product Goal

Build a Minecraft-like voxel world on TON where the contract owns the game rules and view calculations.

The frontend is deliberately thin:

- connect wallet through TonConnect;
- deploy or open a world contract;
- call get-methods;
- decode packed contract output;
- draw the returned data on canvas;
- send transactions for state-changing actions.

The frontend must not generate terrain, decide block visibility, calculate height maps, simulate ownership, or render hidden world state by itself. Those calculations live in Tolk get-methods.

## Security Rule

Never ask users for wallet seed phrases, mnemonics, recovery phrases, or private keys in the web app.

For smooth gameplay use one of these:

- TonConnect transactions for each action;
- batched actions in one transaction;
- session keys registered by a TonConnect transaction;
- a relayer that submits session-key-signed actions.

If a developer mnemonic is ever needed for deploy scripts, it must live only in local `.env` files and never in browser code.

## MVP Scope

Start with a small deterministic voxel world, not a full 3D clone.

- World: deterministic terrain from `seed`.
- Initial view: top-down map.
- First viewport: 32x32 or 64x64 cells.
- Chunk size target: 16x16x32.
- Math: integers / fixed-point only.
- Rendering: contract returns packed ready-to-draw data from get-methods.

The first win is a working on-chain voxel kernel:

1. deploy world with seed;
2. contract computes `heightAt(x, z)`;
3. contract computes `blockAt(x, y, z)`;
4. users place/remove blocks through transactions;
5. `getTopDownView(...)` returns packed cells;
6. frontend draws the returned cells without recomputing terrain.

## Contract

Main contract:

```text
VoxelWorld.tolk
```

Recommended storage:

```text
owner: address
seed: uint32

worldSizeX: uint16
worldSizeZ: uint16
worldHeight: uint16

spawnX: int16
spawnY: int16
spawnZ: int16

baseGroundLevel: uint16
waterLevel: uint16

blockOverrides: map<uint64, BlockOverride>
players: map<address, PlayerState>

isPaused: bool
```

Types:

```text
BlockOverride {
  blockId: uint8
  updatedBy: address
  updatedAt: uint32
}

PlayerState {
  x: int16
  y: int16
  z: int16
  yaw: int16
  pitch: int16
}
```

Block IDs:

```text
0 = air
1 = grass
2 = dirt
3 = stone
4 = water
5 = sand
6 = wood
7 = leaves
8 = glass
9 = user block
```

## Coordinate Packing

Pack `(x, y, z)` into `uint64` for `blockOverrides`.

Example:

```text
packedX = x + 32768
packedZ = z + 32768
key = packedX << 32 | y << 16 | packedZ
```

Keep helpers explicit:

```text
packCoord(x, y, z): uint64
unpackCoord(key): (int16, uint16, int16)
```

## Messages

State-changing gameplay actions are internal messages:

```text
SetPaused(isPaused)
SetSpawn(x, y, z)
MovePlayer(x, y, z, yaw, pitch)
PlaceBlock(x, y, z, blockId)
RemoveBlock(x, y, z)
BatchPlaceBlocks(items)
ClearOverride(x, y, z)
Withdraw(to, amount)
```

Future session-key flow:

```text
RegisterSession(sessionPublicKey, expiresAt, maxActions, allowedActions)
RevokeSession(sessionPublicKey)
SignedGameAction(player, sessionPublicKey, nonce, actionKind, actionData, signature)
```

## Get Methods

Core:

```text
config()
player(address)
heightAt(x, z)
blockAt(x, y, z)
chunkInfo(chunkX, chunkZ)
```

Rendering/view methods:

```text
getTopDownView(centerX, centerZ, radius): cell
getIsometricView(centerX, centerY, centerZ, width, height): cell
getVisibleBlocks(cameraX, cameraY, cameraZ, yaw, pitch, maxDistance): cell
renderRows(cameraX, cameraY, cameraZ, yaw, pitch, width, height, y0, rows): cell
```

MVP should implement only:

```text
getTopDownView(centerX, centerZ, radius)
```

Packed output:

```text
magic: "VX01"
centerX:int16
centerZ:int16
size:uint16
cells:[
  x:int16
  z:int16
  topY:uint16
  blockId:uint8
  light:uint8
]
```

The frontend should draw exactly this output.

## Terrain Generation

Use deterministic integer hash noise.

Pseudo:

```text
heightAt(x, z):
  h1 = hash2(seed, x, z) % 8
  h2 = hash2(seed, x / 4, z / 4) % 12
  return baseGroundLevel + h1 + h2
```

Block logic:

```text
blockAt(x, y, z):
  if override exists:
    return override.blockId

  h = heightAt(x, z)

  if y > h:
    if y <= waterLevel:
      return water
    return air

  if y == h:
    if h <= waterLevel + 1:
      return sand
    return grass

  if y > h - 4:
    return dirt

  return stone
```

## Test Plan

Tolk tests should cover:

- deploy exposes initial config;
- same seed returns same `heightAt`;
- different seed changes terrain;
- `blockAt` returns generated terrain;
- `PlaceBlock` creates override;
- `RemoveBlock` creates air override;
- invalid block ID fails;
- out-of-bounds coordinates fail;
- `getTopDownView` returns expected size/magic and non-empty cells;
- non-owner cannot call owner-only admin messages.

## Frontend Plan

React/Vite app:

- TonConnect button;
- network selector;
- deploy world form with seed;
- open existing world by address;
- canvas viewport;
- controls for center X/Z and radius;
- selected block panel;
- place/remove block actions;
- refresh view button;
- raw decoded debug panel for early development.

Frontend libraries:

- `@tonconnect/ui-react`;
- generated wrappers from Acton;
- canvas rendering directly, no terrain recomputation.

## Acton Workflow

Use WSL where Acton is installed:

```bash
cd /mnt/c/Users/Admin/Desktop/ton-onchain-minecraft
$HOME/.acton/bin/acton build
$HOME/.acton/bin/acton test
$HOME/.acton/bin/acton wrapper --all --ts
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

## First Codex Task

Paste this into the new session:

```text
We are in an Acton + React project. Implement the first MVP of TON On-chain Minecraft.

Do not ask users for seed phrases. Use TonConnect for transactions.

Step 1:
- Rename the starter Empty contract to VoxelWorld.
- Add storage fields: owner, seed, world sizes, baseGroundLevel, waterLevel, blockOverrides, players, isPaused.
- Add messages: PlaceBlock, RemoveBlock, MovePlayer, SetPaused, Withdraw.
- Add get-methods: config, heightAt, blockAt, getTopDownView.
- Terrain must be deterministic and computed inside the contract with integer hash noise.
- getTopDownView must return packed ready-to-draw cell data.
- Add focused Tolk tests for deploy, deterministic terrain, block overrides, and top-down view.
- Run acton build/test.

Step 2 after tests pass:
- Update the React app to deploy/open a world, call getTopDownView, decode it, and draw a canvas.
```
