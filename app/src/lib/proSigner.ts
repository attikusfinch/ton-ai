import {
  Cell,
  SendMode,
  WalletContractV5R1,
  internal,
  loadStateInit,
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
};

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
  const openedWallet = client.open(wallet);
  const seqno = await openedWallet.getSeqno();

  await openedWallet.sendTransfer({
    seqno,
    secretKey,
    messages: messages.map(toRelaxedMessage),
    sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    timeout: Math.floor(Date.now() / 1000) + 300,
  });

  return {
    address: wallet.address.toString({
      bounceable: false,
      testOnly: network === 'testnet',
    }),
    messageCount: messages.length,
    seqno,
  };
}
