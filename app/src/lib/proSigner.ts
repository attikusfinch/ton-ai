import {
  beginCell,
  Cell,
  SendMode,
  WalletContractV5R1,
  external,
  internal,
  loadStateInit,
  storeMessage,
  type MessageRelaxed,
  type TonClient,
} from '@ton/ton';
import { mnemonicToPrivateKey, mnemonicValidate } from '@ton/crypto';
import { Buffer } from 'buffer';

import type { Network } from './router';

export type DirectWalletMessage = {
  address: string;
  amount: string;
  payload?: string;
  stateInit?: string;
};

export type DirectSendResult = {
  address: string;
  messageCount: number;
  seqno: number;
  bocBytes: number;
  cellCount: number;
  walletState: string;
};

type CellStats = {
  bocBytes: number;
  bocBase64Chars: number;
  cells: number;
  bits: number;
  refs: number;
};

type RpcDiagnostics = {
  walletAddress?: string;
  walletState?: string;
  messageCount?: number;
  seqno?: number;
  boc?: CellStats;
};

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

function normalizeSeed(seed: string): string[] {
  return seed.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function networkGlobalId(network: Network): number {
  return network === 'testnet' ? -3 : -239;
}

async function openSeedWallet(seed: string, network: Network) {
  const words = normalizeSeed(seed);
  if (words.length === 0) throw new Error('Enter seed phrase');

  const isValid = await mnemonicValidate(words);
  if (!isValid) throw new Error('Invalid seed phrase');

  const keyPair = await mnemonicToPrivateKey(words);
  const wallet = WalletContractV5R1.create({
    publicKey: Buffer.from(keyPair.publicKey),
    walletId: {
      networkGlobalId: networkGlobalId(network),
      context: {
        walletVersion: 'v5r1',
        workchain: 0,
        subwalletNumber: 0,
      },
    },
  });

  return {
    wallet,
    secretKey: Buffer.from(keyPair.secretKey),
  };
}

function toRelaxedMessage(message: DirectWalletMessage): MessageRelaxed {
  return internal({
    to: message.address,
    value: BigInt(message.amount),
    bounce: false,
    body: message.payload ? Cell.fromBase64(message.payload) : undefined,
    init: message.stateInit
      ? loadStateInit(Cell.fromBase64(message.stateInit).beginParse())
      : undefined,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function stringifyUnknown(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') return value;

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function limitText(value: string, limit = 500): string {
  return value.length > limit ? `${value.slice(0, limit)}...` : value;
}

function extractResponseDetails(error: unknown): string | null {
  if (!isRecord(error) || !isRecord(error.response)) return null;

  const response = error.response;
  const status = stringifyUnknown(response.status);
  const statusText = stringifyUnknown(response.statusText);
  const data = stringifyUnknown(response.data);
  const parts = [
    status ? `HTTP ${status}` : null,
    statusText,
    data ? `response ${limitText(data)}` : null,
  ].filter(Boolean);

  return parts.length ? parts.join(', ') : null;
}

function describeDiagnostics(diagnostics?: RpcDiagnostics): string | null {
  if (!diagnostics) return null;

  const parts = [
    diagnostics.walletAddress ? `wallet ${diagnostics.walletAddress}` : null,
    diagnostics.walletState ? `wallet state ${diagnostics.walletState}` : null,
    diagnostics.seqno !== undefined ? `seqno ${diagnostics.seqno}` : null,
    diagnostics.messageCount !== undefined
      ? `messages ${diagnostics.messageCount}`
      : null,
    diagnostics.boc
      ? `BOC ${diagnostics.boc.bocBytes} bytes (${diagnostics.boc.bocBase64Chars} base64 chars), ${diagnostics.boc.cells} cells, ${diagnostics.boc.bits} bits`
      : null,
  ].filter(Boolean);

  return parts.length ? parts.join('; ') : null;
}

function wrapRpcError(
  error: unknown,
  step: string,
  diagnostics?: RpcDiagnostics,
): Error {
  const message = error instanceof Error ? error.message : String(error);
  const details = extractResponseDetails(error);
  const diagnosticText = describeDiagnostics(diagnostics);
  const parts = [
    `TonCenter RPC failed during ${step}`,
    details,
    diagnosticText,
    message && !details?.includes(message) ? message : null,
  ].filter(Boolean);

  return new Error(parts.join('. '), { cause: error });
}

async function rpcStep<T>(
  step: string,
  action: () => Promise<T>,
  diagnostics?: RpcDiagnostics,
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    throw wrapRpcError(error, step, diagnostics);
  }
}

function collectCellStats(root: Cell, boc: Buffer): CellStats {
  const stack = [root];
  const seen = new Set<string>();
  let cells = 0;
  let bits = 0;
  let refs = 0;

  while (stack.length > 0) {
    const cell = stack.pop();
    if (!cell) continue;

    const hash = Buffer.from(cell.hash()).toString('hex');
    if (seen.has(hash)) continue;
    seen.add(hash);
    cells += 1;
    bits += cell.bits.length;
    refs += cell.refs.length;
    stack.push(...cell.refs);
  }

  return {
    bocBytes: boc.length,
    bocBase64Chars: Math.ceil(boc.length / 3) * 4,
    cells,
    bits,
    refs,
  };
}

export async function deriveDirectWalletAddress(
  seed: string,
  network: Network,
): Promise<string> {
  const { wallet } = await openSeedWallet(seed, network);
  return wallet.address.toString({
    bounceable: false,
    testOnly: network === 'testnet',
  });
}

export async function sendDirectWalletMessages(
  client: TonClient,
  network: Network,
  seed: string,
  messages: DirectWalletMessage[],
): Promise<DirectSendResult> {
  if (messages.length === 0) throw new Error('No messages to send');

  const { wallet, secretKey } = await openSeedWallet(seed, network);
  const walletAddress = wallet.address.toString({
    bounceable: false,
    testOnly: network === 'testnet',
  });
  const walletState = await rpcStep(
    'read wallet state',
    () => client.getContractState(wallet.address),
    { walletAddress, messageCount: messages.length },
  );
  if (walletState.state === 'frozen') {
    throw new Error(`Direct signer wallet is frozen: ${walletAddress}`);
  }

  const openedWallet = client.open(wallet);
  const seqno =
    walletState.state === 'active'
      ? await rpcStep('read wallet seqno', () => openedWallet.getSeqno(), {
          walletAddress,
          walletState: walletState.state,
          messageCount: messages.length,
        })
      : 0;
  const relaxedMessages = messages.map(toRelaxedMessage);
  const transfer = await wallet.createTransfer({
    seqno,
    secretKey,
    messages: relaxedMessages,
    sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    timeout: Math.floor(Date.now() / 1000) + 300,
  });
  const externalMessage = external({
    to: wallet.address,
    init: walletState.state === 'active' ? undefined : wallet.init,
    body: transfer,
  });
  const externalCell = beginCell()
    .store(storeMessage(externalMessage))
    .endCell();
  const boc = externalCell.toBoc();
  const bocStats = collectCellStats(externalCell, boc);

  await rpcStep('sendBoc', () => client.sendFile(boc), {
    walletAddress,
    walletState: walletState.state,
    messageCount: messages.length,
    seqno,
    boc: bocStats,
  });

  return {
    address: walletAddress,
    messageCount: messages.length,
    seqno,
    bocBytes: bocStats.bocBytes,
    cellCount: bocStats.cells,
    walletState: walletState.state,
  };
}

export async function waitForDirectWalletSeqno(
  client: TonClient,
  network: Network,
  seed: string,
  minSeqno: number,
): Promise<number> {
  const { wallet } = await openSeedWallet(seed, network);
  const walletAddress = wallet.address.toString({
    bounceable: false,
    testOnly: network === 'testnet',
  });
  const openedWallet = client.open(wallet);

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const walletState = await rpcStep(
      'read wallet state',
      () => client.getContractState(wallet.address),
      { walletAddress },
    );
    if (walletState.state === 'active') {
      const seqno = await rpcStep(
        'read wallet seqno',
        () => openedWallet.getSeqno(),
        { walletAddress, walletState: walletState.state },
      );
      if (seqno >= minSeqno) return seqno;
    }

    await sleep(1500);
  }

  throw new Error(
    `Direct signer seqno did not reach ${minSeqno} for ${walletAddress}`,
  );
}
