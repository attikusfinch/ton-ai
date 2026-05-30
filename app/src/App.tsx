import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  CHAIN,
  TonConnectButton,
  THEME,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from '@tonconnect/ui-react';
import { Address, Cell, toNano } from '@ton/core';
import {
  Bot,
  CheckCircle2,
  Copy,
  Database,
  ExternalLink,
  KeyRound,
  LogOut,
  Moon,
  Pause,
  Play,
  Plug,
  RefreshCw,
  Rocket,
  Send,
  Sparkles,
  Sun,
  Upload,
  User,
  Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NetworkDropdown } from '@/components/NetworkDropdown';
import { IconTonDiamond } from '@/components/TonDiamond';
import { cn } from '@/lib/utils';
import { useRouter } from '@/lib/router';
import {
  formatAddressForNetwork,
  getTonClient,
  networkChain,
  networkLabel,
  tonviewerUrl,
} from '@/lib/ton';
import {
  deriveDirectWalletAddress,
  sendDirectWalletMessages,
  waitForDirectWalletSeqno,
} from '@/lib/proSigner';
import {
  adminValue,
  bodyFromContinue,
  bodyFromCell,
  bodyFromText,
  continueValue,
  createTonGptForOwner,
  createTonGptUploadChunks,
  defaultPrompts,
  deployValue,
  parseTextComment,
  replyValue,
  stateInitToBase64,
  tongptMetadata,
  uploadMessagesPerTransaction,
  uploadValue,
} from '@/lib/tongpt';
import {
  TonGpt,
  type TonGptConfig,
  type TonGptModelStatus,
} from '@wrappers/TonGpt.gen';

type StatusKind = 'idle' | 'pending' | 'success' | 'error';

type AppStatus = {
  kind: StatusKind;
  text: string;
};

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant' | 'system';
  text: string;
  state?: 'pending' | 'sent' | 'received' | 'error';
  txHash?: string;
};

type ReplyMatch = {
  text: string;
  txHash: string;
};

const emptyStatus: AppStatus = { kind: 'idle', text: 'Ready' };

const inputClass =
  'h-10 rounded-md border bg-background px-3 text-[14px] outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30 disabled:opacity-60';
const textareaClass =
  'min-h-[88px] resize-none rounded-md border bg-background p-3 text-[14px] outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30 disabled:opacity-60';

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = localStorage.getItem('ton-ai:theme');
    return stored === 'light' ? 'light' : 'dark';
  });
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ton-ai:theme', theme);
    tonConnectUI.uiOptions = {
      uiPreferences: { theme: theme === 'light' ? THEME.LIGHT : THEME.DARK },
    };
  }, [theme, tonConnectUI]);

  return { theme, setTheme };
}

function parseAddressOrNull(value: string): Address | null {
  try {
    return value.trim() ? Address.parse(value.trim()) : null;
  } catch {
    return null;
  }
}

function shortAddress(address: string) {
  if (address.length <= 18) return address;
  return `${address.slice(0, 9)}...${address.slice(-8)}`;
}

function bigintText(value: bigint | null | undefined) {
  return value === null || value === undefined ? '-' : value.toString();
}

function countText(value: bigint | null | undefined, total: number) {
  return `${bigintText(value)}/${total}`;
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

function formatError(error: unknown): string {
  if (isRecord(error) && isRecord(error.response)) {
    const response = error.response;
    const status = stringifyUnknown(response.status);
    const statusText = stringifyUnknown(response.statusText);
    const data = stringifyUnknown(response.data);
    return [
      status ? `HTTP ${status}` : null,
      statusText,
      data ? limitText(data) : null,
    ]
      .filter(Boolean)
      .join(': ');
  }

  if (error instanceof Error) return error.message;
  return String(error);
}

function parseTonAmount(value: string): bigint | null {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(\.\d{1,9})?$/.test(normalized)) return null;
  return toNano(normalized);
}

function base64EmptyCell() {
  return Cell.EMPTY.toBoc().toString('base64');
}

function StatusPill({ status }: { status: AppStatus }) {
  return (
    <div
      title={status.text}
      className={cn(
        'inline-flex h-8 max-w-full items-center gap-2 rounded-md border px-3 text-[13px]',
        status.kind === 'error' && 'border-destructive/40 text-destructive',
        status.kind === 'success' && 'border-success/40 text-success',
        status.kind === 'pending' && 'border-primary/40 text-primary',
      )}
    >
      {status.kind === 'pending' ? (
        <span className="spinner size-3" />
      ) : (
        <CheckCircle2 className="size-3.5 opacity-70" />
      )}
      <span className="truncate">{status.text}</span>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn('grid min-w-0 gap-1.5 text-[13px] font-medium', className)}
    >
      <span className="text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export default function App() {
  const { network, setTestnet } = useRouter();
  const walletAddress = useTonAddress();
  const walletRawAddress = useTonAddress(false);
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { theme, setTheme } = useTheme();

  const storageKey = `ton-ai:${network}:tongpt-contract`;
  const toncenterKeyStorageKey = `ton-ai:${network}:toncenter-key`;
  const [contractInput, setContractInput] = useState(
    () => localStorage.getItem(storageKey) ?? '',
  );
  const [toncenterKey, setToncenterKey] = useState(
    () => localStorage.getItem(toncenterKeyStorageKey) ?? '',
  );
  const [proMode, setProMode] = useState(false);
  const [proSeed, setProSeed] = useState('');
  const [proSignerAddress, setProSignerAddress] = useState('');
  const [isCheckingProSigner, setIsCheckingProSigner] = useState(false);
  const [prompt, setPrompt] = useState('Hello, how are you?');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [status, setStatus] = useState<AppStatus>(emptyStatus);
  const [config, setConfig] = useState<TonGptConfig | null>(null);
  const [modelStatus, setModelStatus] = useState<TonGptModelStatus | null>(
    null,
  );
  const [contractBalance, setContractBalance] = useState<bigint | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUploadingModel, setIsUploadingModel] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    sent: number;
    total: number;
  } | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'system',
      text: 'TONGPT trained recurrent model',
      state: 'received',
    },
  ]);

  const client = useMemo(
    () => getTonClient(network, toncenterKey),
    [network, toncenterKey],
  );

  useEffect(() => {
    const saved = localStorage.getItem(storageKey) ?? '';
    setContractInput(saved);
    setConfig(null);
    setModelStatus(null);
    setContractBalance(null);
  }, [storageKey]);

  useEffect(() => {
    setToncenterKey(localStorage.getItem(toncenterKeyStorageKey) ?? '');
  }, [toncenterKeyStorageKey]);

  useEffect(() => {
    setProSignerAddress('');
  }, [network]);

  const saveToncenterKey = useCallback(
    (value: string) => {
      setToncenterKey(value);
      const normalized = value.trim();
      if (normalized) localStorage.setItem(toncenterKeyStorageKey, normalized);
      else localStorage.removeItem(toncenterKeyStorageKey);
    },
    [toncenterKeyStorageKey],
  );

  const checkProSigner = useCallback(async () => {
    setIsCheckingProSigner(true);
    try {
      const address = await deriveDirectWalletAddress(proSeed, network);
      setProSignerAddress(address);
      setStatus({ kind: 'success', text: 'Direct signer ready' });
    } catch (error) {
      setProSignerAddress('');
      setStatus({ kind: 'error', text: formatError(error) });
    } finally {
      setIsCheckingProSigner(false);
    }
  }, [network, proSeed]);

  const ensureProSignerAddress = useCallback(async () => {
    if (!proMode) return proSignerAddress;
    if (proSignerAddress) return proSignerAddress;

    const address = await deriveDirectWalletAddress(proSeed, network);
    setProSignerAddress(address);
    return address;
  }, [network, proMode, proSeed, proSignerAddress]);

  const clearProSigner = useCallback(() => {
    setProSeed('');
    setProSignerAddress('');
    setStatus({ kind: 'idle', text: 'Direct signer cleared' });
  }, []);

  const walletChainMatches =
    !wallet ||
    (network === 'testnet'
      ? wallet.account.chain === CHAIN.TESTNET
      : wallet.account.chain === CHAIN.MAINNET);

  const userWallet = proMode
    ? proSignerAddress
    : walletAddress
      ? (() => {
          try {
            return formatAddressForNetwork(walletAddress, network);
          } catch {
            return walletAddress;
          }
        })()
      : '';

  const contractAddress = useMemo(
    () => parseAddressOrNull(contractInput),
    [contractInput],
  );

  const contractForDisplay = contractAddress
    ? contractAddress.toString({
        bounceable: false,
        testOnly: network === 'testnet',
      })
    : contractInput.trim();

  const connectedOwnerAddress = useMemo(
    () => parseAddressOrNull(walletRawAddress || walletAddress),
    [walletRawAddress, walletAddress],
  );

  const proOwnerAddress = useMemo(
    () => parseAddressOrNull(proSignerAddress),
    [proSignerAddress],
  );

  const ownerAddress = proMode ? proOwnerAddress : connectedOwnerAddress;

  const derivedContract = useMemo(
    () => (ownerAddress ? createTonGptForOwner(ownerAddress) : null),
    [ownerAddress],
  );

  const derivedAddress = derivedContract
    ? derivedContract.address.toString({
        bounceable: false,
        testOnly: network === 'testnet',
      })
    : '';

  const openedContract = useMemo(
    () =>
      contractAddress ? client.open(TonGpt.fromAddress(contractAddress)) : null,
    [client, contractAddress],
  );

  const isOwner = Boolean(
    config && ownerAddress && config.owner.equals(ownerAddress),
  );
  const canUseContract = Boolean(contractAddress);
  const hasProSeed = proSeed.trim().length > 0;
  const canUseWallet = Boolean(
    canUseContract &&
    (proMode ? hasProSeed : walletAddress && walletChainMatches),
  );
  const isModelReady = Boolean(modelStatus?.isReady);
  const modelStatusKnown = modelStatus !== null;
  const canSend = Boolean(canUseWallet && (!modelStatusKnown || isModelReady));
  const canWithdraw = Boolean(canUseWallet && isOwner && withdrawAmount.trim());
  const canUploadModel = Boolean(
    contractAddress &&
    proMode &&
    hasProSeed &&
    !isSending &&
    !isUploadingModel &&
    (!config || !proSignerAddress || isOwner),
  );
  const generationValueTon =
    Number(replyValue) / 1_000_000_000 +
    (Number(continueValue) / 1_000_000_000) *
      tongptMetadata.maxGenerate *
      tongptMetadata.continuationWindows;
  const uploadValueTon =
    (Number(uploadValue) / 1_000_000_000) * tongptMetadata.uploadChunks;
  const loadedModelEntries = modelStatus
    ? Number(modelStatus.byteEmbeddings) +
      Number(modelStatus.positionEmbeddings) +
      Number(modelStatus.pairEmbeddings) +
      Number(modelStatus.tokenEmbeddings) +
      Number(modelStatus.heads) +
      Number(modelStatus.tokenBytes)
    : 0;
  const loadedModelPercent =
    tongptMetadata.modelEntries.total > 0
      ? Math.min(
          100,
          Math.round(
            (loadedModelEntries / tongptMetadata.modelEntries.total) * 100,
          ),
        )
      : 0;

  const saveContractInput = useCallback(
    (value: string) => {
      setContractInput(value);
      setModelStatus(null);
      if (value.trim()) localStorage.setItem(storageKey, value.trim());
      else localStorage.removeItem(storageKey);
    },
    [storageKey],
  );

  const refreshConfig = useCallback(async () => {
    if (!openedContract || !contractAddress) {
      setConfig(null);
      setModelStatus(null);
      setContractBalance(null);
      return;
    }

    setIsRefreshing(true);
    try {
      const [nextConfig, balance, nextModelStatus] = await Promise.all([
        openedContract.getConfig(),
        client.getBalance(contractAddress),
        openedContract.getModelStatus().catch(() => null),
      ]);
      setConfig(nextConfig);
      setModelStatus(nextModelStatus);
      setContractBalance(balance);
      setStatus({ kind: 'success', text: 'Config refreshed' });
    } catch (error) {
      setConfig(null);
      setModelStatus(null);
      setStatus({ kind: 'error', text: formatError(error) });
    } finally {
      setIsRefreshing(false);
    }
  }, [client, contractAddress, openedContract]);

  useEffect(() => {
    void refreshConfig();
  }, [refreshConfig]);

  type TonConnectMessage = {
    address: string;
    amount: string;
    payload?: string;
    stateInit?: string;
  };

  const sendMessages = useCallback(
    async (messages: TonConnectMessage[]) => {
      if (proMode) {
        const result = await sendDirectWalletMessages(
          client,
          network,
          proSeed,
          messages,
        );
        setProSignerAddress(result.address);
        return result;
      }

      if (!walletAddress) throw new Error('Connect wallet');
      if (!walletChainMatches) {
        throw new Error(`Switch wallet to ${networkLabel(network)}`);
      }

      return tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        network: networkChain(network),
        messages,
      });
    },
    [
      client,
      network,
      proMode,
      proSeed,
      tonConnectUI,
      walletAddress,
      walletChainMatches,
    ],
  );

  const sendSingleMessage = useCallback(
    async (message: TonConnectMessage) => sendMessages([message]),
    [sendMessages],
  );

  const buildGenerationMessages = useCallback(
    (address: string, text: string, jobId: bigint, steps: number) => {
      const messages: TonConnectMessage[] = [
        {
          address,
          amount: replyValue,
          payload: bodyFromText(text),
        },
      ];
      for (let step = 0; step < steps; step += 1) {
        messages.push({
          address,
          amount: continueValue,
          payload: bodyFromContinue(jobId),
        });
      }
      return messages;
    },
    [],
  );

  const findLatestReply = useCallback(
    async (
      sinceUnix: number,
      replyOwnerAddress = ownerAddress,
    ): Promise<ReplyMatch | null> => {
      if (!contractAddress || !replyOwnerAddress) return null;

      const contractTransactions = await client.getTransactions(
        contractAddress,
        {
          limit: 40,
          archival: false,
        },
      );

      for (const tx of contractTransactions) {
        if (tx.now < sinceUnix - 30) continue;
        for (const message of tx.outMessages.values()) {
          if (message.info.type !== 'internal') continue;
          if (!message.info.src.equals(contractAddress)) continue;
          if (!message.info.dest.equals(replyOwnerAddress)) continue;

          const text = parseTextComment(message.body);
          if (text === null) continue;

          return {
            text,
            txHash: tx.hash().toString('hex'),
          };
        }
      }

      const walletTransactions = await client.getTransactions(
        replyOwnerAddress,
        {
          limit: 20,
          archival: false,
        },
      );

      for (const tx of walletTransactions) {
        if (tx.now < sinceUnix - 30) continue;
        const message = tx.inMessage;
        if (!message || message.info.type !== 'internal') continue;
        if (!message.info.src.equals(contractAddress)) continue;

        const text = parseTextComment(message.body);
        if (text === null) continue;

        return {
          text,
          txHash: tx.hash().toString('hex'),
        };
      }

      return null;
    },
    [client, contractAddress, ownerAddress],
  );

  const pollReply = useCallback(
    async (replyOwnerAddress?: Address) => {
      const sinceUnix = Math.floor(Date.now() / 1000);
      for (let attempt = 0; attempt < 12; attempt += 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, attempt === 0 ? 1800 : 4000),
        );
        try {
          const reply = await findLatestReply(sinceUnix, replyOwnerAddress);
          if (reply) return reply;
        } catch {
          // Indexers can lag or a wallet can be fresh. Keep polling.
        }
      }
      return null;
    },
    [findLatestReply],
  );

  const deployContract = async () => {
    let contractToDeploy = derivedContract;

    if (!contractToDeploy && proMode && hasProSeed) {
      setStatus({ kind: 'pending', text: 'Preparing direct signer' });
      try {
        const signerAddress = await ensureProSignerAddress();
        contractToDeploy = createTonGptForOwner(Address.parse(signerAddress));
      } catch (error) {
        setStatus({ kind: 'error', text: formatError(error) });
        return;
      }
    }

    if (!contractToDeploy) {
      setStatus({
        kind: 'error',
        text: proMode ? 'Enter seed phrase' : 'Connect wallet first',
      });
      return;
    }

    setStatus({ kind: 'pending', text: 'Deploy transaction' });
    try {
      await sendSingleMessage({
        address: contractToDeploy.address.toString({
          bounceable: false,
          testOnly: network === 'testnet',
        }),
        amount: deployValue,
        stateInit: stateInitToBase64(contractToDeploy),
        payload: base64EmptyCell(),
      });
      saveContractInput(
        contractToDeploy.address.toString({
          bounceable: false,
          testOnly: network === 'testnet',
        }),
      );
      setStatus({ kind: 'success', text: 'Deploy sent' });
      setTimeout(() => void refreshConfig(), 3500);
    } catch (error) {
      setStatus({ kind: 'error', text: formatError(error) });
    }
  };

  const sendPrompt = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!contractAddress || !openedContract || !prompt.trim()) return;
    if (modelStatusKnown && !isModelReady) {
      setStatus({ kind: 'error', text: 'Upload weights first' });
      return;
    }
    if (!modelStatusKnown) {
      const nextModelStatus = await openedContract
        .getModelStatus()
        .catch(() => null);
      if (nextModelStatus) {
        setModelStatus(nextModelStatus);
        if (!nextModelStatus.isReady) {
          setStatus({ kind: 'error', text: 'Upload weights first' });
          return;
        }
      }
    }

    let replyOwnerAddress = ownerAddress;
    if (!replyOwnerAddress && proMode && hasProSeed) {
      try {
        const signerAddress = await ensureProSignerAddress();
        replyOwnerAddress = Address.parse(signerAddress);
      } catch (error) {
        setStatus({ kind: 'error', text: formatError(error) });
        return;
      }
    }

    const text = prompt.trim();
    const contractTarget = contractAddress.toString({
      bounceable: false,
      testOnly: network === 'testnet',
    });
    const userMessageId = Date.now();
    const assistantMessageId = userMessageId + 1;
    setChat((items) => [
      ...items,
      { id: userMessageId, role: 'user', text, state: 'sent' },
      {
        id: assistantMessageId,
        role: 'assistant',
        text: 'Waiting for reply transaction',
        state: 'pending',
      },
    ]);

    setIsSending(true);
    setStatus({ kind: 'pending', text: 'Preparing generation job' });
    try {
      const nextConfig = await openedContract.getConfig();
      setConfig(nextConfig);
      const steps =
        Math.max(1, Number(nextConfig.maxGenerate)) *
        tongptMetadata.continuationWindows;
      const messages = buildGenerationMessages(
        contractTarget,
        text,
        nextConfig.nextJobId,
        steps,
      );
      setStatus({
        kind: 'pending',
        text: `Generation transaction (${messages.length} messages)`,
      });
      await sendMessages(messages);
      setStatus({ kind: 'pending', text: 'Waiting for reply' });
      const reply = await pollReply(replyOwnerAddress ?? undefined);

      setChat((items) =>
        items.map((item) =>
          item.id === assistantMessageId
            ? {
                ...item,
                text: reply?.text ?? 'Reply not found yet',
                state: reply ? 'received' : 'error',
                txHash: reply?.txHash,
              }
            : item,
        ),
      );
      setStatus({
        kind: reply ? 'success' : 'error',
        text: reply ? 'Reply received' : 'Reply not found',
      });
    } catch (error) {
      setChat((items) =>
        items.map((item) =>
          item.id === assistantMessageId
            ? { ...item, text: formatError(error), state: 'error' }
            : item,
        ),
      );
      setStatus({ kind: 'error', text: formatError(error) });
    } finally {
      setIsSending(false);
      setTimeout(() => void refreshConfig(), 3500);
    }
  };

  const sendAdminBody = async (body: Cell, label: string) => {
    if (!contractAddress) return;
    setStatus({ kind: 'pending', text: label });
    try {
      await sendSingleMessage({
        address: contractAddress.toString({
          bounceable: false,
          testOnly: network === 'testnet',
        }),
        amount: adminValue,
        payload: bodyFromCell(body),
      });
      setStatus({ kind: 'success', text: `${label} sent` });
      setTimeout(() => void refreshConfig(), 3500);
    } catch (error) {
      setStatus({ kind: 'error', text: formatError(error) });
    }
  };

  const uploadModel = async () => {
    if (!contractAddress) return;
    if (!proMode) {
      setStatus({ kind: 'error', text: 'Direct signer required for upload' });
      return;
    }

    setIsUploadingModel(true);
    setUploadProgress(null);
    try {
      const signerAddress = await ensureProSignerAddress();
      const signerOwner = Address.parse(signerAddress);
      if (config && !config.owner.equals(signerOwner)) {
        throw new Error('Direct signer is not contract owner');
      }

      const chunks = createTonGptUploadChunks();
      const contractTarget = contractAddress.toString({
        bounceable: false,
        testOnly: network === 'testnet',
      });
      setUploadProgress({ sent: 0, total: chunks.length });

      for (
        let start = 0;
        start < chunks.length;
        start += uploadMessagesPerTransaction
      ) {
        const batchChunks = chunks.slice(
          start,
          start + uploadMessagesPerTransaction,
        );
        const end = start + batchChunks.length;
        setStatus({
          kind: 'pending',
          text: `Uploading weights ${start + 1}-${end}/${chunks.length}`,
        });

        const result = await sendMessages(
          batchChunks.map((chunk) => ({
            address: contractTarget,
            amount: uploadValue,
            payload: bodyFromCell(chunk.body),
          })),
        );

        setStatus({
          kind: 'pending',
          text: `Confirming weights ${end}/${chunks.length}`,
        });
        if (isRecord(result) && typeof result.seqno === 'number') {
          await waitForDirectWalletSeqno(
            client,
            network,
            proSeed,
            result.seqno + 1,
          );
        }
        setUploadProgress({ sent: end, total: chunks.length });
      }

      setStatus({ kind: 'success', text: 'Model upload complete' });
      setTimeout(() => void refreshConfig(), 1500);
    } catch (error) {
      setStatus({ kind: 'error', text: formatError(error) });
    } finally {
      setIsUploadingModel(false);
    }
  };

  const togglePaused = async () => {
    await sendAdminBody(
      TonGpt.createCellOfSetTonGptPaused({
        isPaused: !(config?.isPaused ?? false),
      }),
      config?.isPaused ? 'Unpause' : 'Pause',
    );
  };

  const withdrawTon = async () => {
    if (!ownerAddress) {
      setStatus({
        kind: 'error',
        text: proMode ? 'Check direct signer first' : 'Connect owner wallet',
      });
      return;
    }
    const amount = parseTonAmount(withdrawAmount);
    if (amount === null || amount <= 0n) {
      setStatus({ kind: 'error', text: 'Invalid withdraw amount' });
      return;
    }

    await sendAdminBody(
      TonGpt.createCellOfWithdrawTonGpt({
        to: ownerAddress,
        amount,
      }),
      'Withdraw',
    );
    setWithdrawAmount('');
  };

  const copyContract = async () => {
    if (!contractForDisplay) return;
    await navigator.clipboard.writeText(contractForDisplay);
    setStatus({ kind: 'success', text: 'Address copied' });
  };

  const contractTonviewer = contractAddress
    ? `${tonviewerUrl(network)}/${contractAddress.toString({
        bounceable: false,
        testOnly: network === 'testnet',
      })}`
    : '';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-[64px] w-full max-w-[1440px] items-center justify-between gap-3 px-6 py-3 max-md:flex-wrap max-sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#0098EA]">
              <IconTonDiamond size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-[16px] font-bold">TONGPT</div>
              <div className="truncate text-[12px] text-muted-foreground">
                {contractAddress
                  ? shortAddress(contractForDisplay)
                  : 'No contract'}
              </div>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2 max-sm:w-full max-sm:flex-wrap">
            <StatusPill status={status} />
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-md bg-secondary"
              title="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </Button>
            <NetworkDropdown network={network} setTestnet={setTestnet} />
            <TonConnectButton />
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1440px] grid-cols-[340px_minmax(0,1fr)_360px] gap-4 px-6 py-5 max-xl:grid-cols-[320px_minmax(0,1fr)] max-lg:grid-cols-1 max-sm:px-4">
        <section className="grid min-w-0 content-start gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold">
                <Plug className="size-4 text-primary" />
                Contract
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                title="Refresh config"
                onClick={() => void refreshConfig()}
                disabled={!contractAddress || isRefreshing}
              >
                <RefreshCw className={cn(isRefreshing && 'animate-spin')} />
              </Button>
            </div>

            <div className="grid gap-3">
              <Field label="Address">
                <div className="flex gap-2">
                  <input
                    className={cn(
                      inputClass,
                      'min-w-0 flex-1 font-mono text-[12px]',
                    )}
                    value={contractInput}
                    onChange={(event) => saveContractInput(event.target.value)}
                    placeholder="EQ..."
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    title="Copy address"
                    onClick={() => void copyContract()}
                    disabled={!contractForDisplay}
                  >
                    <Copy />
                  </Button>
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    derivedAddress && saveContractInput(derivedAddress)
                  }
                  disabled={!derivedAddress}
                  title="Use derived address"
                >
                  <Wallet />
                  Derive
                </Button>
                <Button
                  type="button"
                  onClick={() => void deployContract()}
                  disabled={
                    proMode
                      ? !hasProSeed
                      : !derivedContract || !walletChainMatches
                  }
                  title="Deploy TONGPT"
                >
                  <Rocket />
                  Deploy
                </Button>
              </div>

              <div className="grid gap-2 rounded-md border bg-background p-3 text-[13px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Wallet</span>
                  <span className="min-w-0 truncate font-mono">
                    {userWallet
                      ? shortAddress(userWallet)
                      : proMode
                        ? 'Seed not checked'
                        : 'Disconnected'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Network</span>
                  <span
                    className={cn(
                      'font-semibold',
                      network === 'mainnet' ? 'text-success' : 'text-warning',
                    )}
                  >
                    {networkLabel(network)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Balance</span>
                  <span className="font-mono">
                    {contractBalance === null
                      ? '-'
                      : `${Number(contractBalance) / 1_000_000_000} TON`}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 rounded-md border bg-background p-3 text-[13px]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <KeyRound className="size-4 text-primary" />
                    Pro signer
                  </div>
                  <label className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={proMode}
                      onChange={(event) => setProMode(event.target.checked)}
                    />
                    Direct
                  </label>
                </div>

                {proMode && (
                  <>
                    <textarea
                      className={cn(textareaClass, 'min-h-[72px] font-mono')}
                      value={proSeed}
                      onChange={(event) => {
                        setProSeed(event.target.value);
                        setProSignerAddress('');
                      }}
                      placeholder="24 seed words"
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                    <div className="flex items-center justify-between gap-2 text-[12px] text-muted-foreground">
                      <span>Memory only, never saved</span>
                      <span className="min-w-0 truncate font-mono">
                        {proSignerAddress
                          ? shortAddress(proSignerAddress)
                          : 'No signer'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void checkProSigner()}
                        disabled={!hasProSeed || isCheckingProSigner}
                      >
                        {isCheckingProSigner ? (
                          <span className="spinner" />
                        ) : (
                          <KeyRound />
                        )}
                        Check
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={clearProSigner}
                        disabled={!proSeed && !proSignerAddress}
                      >
                        Clear
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <Field label="Toncenter API key">
                <input
                  className={cn(inputClass, 'font-mono text-[12px]')}
                  value={toncenterKey}
                  onChange={(event) => saveToncenterKey(event.target.value)}
                  placeholder={`${networkLabel(network)} key`}
                  type="password"
                  autoComplete="off"
                />
              </Field>

              <Field label="Withdraw TON">
                <div className="flex gap-2">
                  <input
                    className={cn(inputClass, 'min-w-0 flex-1 font-mono')}
                    value={withdrawAmount}
                    onChange={(event) => setWithdrawAmount(event.target.value)}
                    placeholder="0.1"
                    inputMode="decimal"
                    disabled={!isOwner}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => void withdrawTon()}
                    disabled={!canWithdraw}
                    title="Withdraw to connected owner wallet"
                  >
                    <LogOut />
                    Withdraw
                  </Button>
                </div>
              </Field>

              {contractTonviewer && (
                <Button variant="outline" asChild>
                  <a href={contractTonviewer} target="_blank" rel="noreferrer">
                    <ExternalLink />
                    Tonviewer
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <Sparkles className="size-4 text-primary" />
              Model
            </div>
            <div
              className={cn(
                'mb-3 rounded-md border bg-background p-3 text-[13px]',
                modelStatusKnown &&
                  (isModelReady ? 'border-success/40' : 'border-warning/40'),
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Weights</span>
                <span
                  className={cn(
                    'font-semibold',
                    modelStatusKnown
                      ? isModelReady
                        ? 'text-success'
                        : 'text-warning'
                      : 'text-muted-foreground',
                  )}
                >
                  {modelStatusKnown
                    ? isModelReady
                      ? 'Ready'
                      : 'Missing'
                    : 'Unknown'}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    'h-full rounded-full',
                    isModelReady ? 'bg-success' : 'bg-warning',
                  )}
                  style={{
                    width: modelStatusKnown ? `${loadedModelPercent}%` : '0%',
                  }}
                />
              </div>
              <div className="mt-2 font-mono text-[12px] text-muted-foreground">
                {modelStatusKnown
                  ? `${loadedModelEntries}/${tongptMetadata.modelEntries.total} entries`
                  : 'Status method unavailable until redeploy'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              {[
                ['Hidden', tongptMetadata.hidden],
                ['Tokens', tongptMetadata.tokenCount],
                ['Chunk', tongptMetadata.candidateChunkSize],
                ['Context', tongptMetadata.maxContext],
                ['Generate', tongptMetadata.maxGenerate],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border bg-background p-3"
                >
                  <div className="text-muted-foreground">{label}</div>
                  <div className="mt-1 font-mono text-[15px]">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
              {[
                [
                  'Byte',
                  countText(
                    modelStatus?.byteEmbeddings,
                    tongptMetadata.modelEntries.byteEmbeddings,
                  ),
                ],
                [
                  'Position',
                  countText(
                    modelStatus?.positionEmbeddings,
                    tongptMetadata.modelEntries.positionEmbeddings,
                  ),
                ],
                [
                  'Pair',
                  countText(
                    modelStatus?.pairEmbeddings,
                    tongptMetadata.modelEntries.pairEmbeddings,
                  ),
                ],
                [
                  'Token',
                  countText(
                    modelStatus?.tokenEmbeddings,
                    tongptMetadata.modelEntries.tokenEmbeddings,
                  ),
                ],
                [
                  'Heads',
                  countText(
                    modelStatus?.heads,
                    tongptMetadata.modelEntries.heads,
                  ),
                ],
                [
                  'Pieces',
                  countText(
                    modelStatus?.tokenBytes,
                    tongptMetadata.modelEntries.tokenBytes,
                  ),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex min-w-0 justify-between gap-2 rounded-md border bg-background px-2.5 py-2"
                >
                  <span className="truncate text-muted-foreground">
                    {label}
                  </span>
                  <span className="font-mono">{value}</span>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              className="mt-3 w-full"
              disabled={!canUploadModel}
              onClick={() => void uploadModel()}
              title="Upload TONGPT weights"
            >
              {isUploadingModel ? <span className="spinner" /> : <Upload />}
              {isUploadingModel && uploadProgress
                ? `Uploading ${uploadProgress.sent}/${uploadProgress.total}`
                : 'Upload Weights'}
            </Button>
            <div className="mt-2 text-[12px] text-muted-foreground">
              {proMode
                ? `${tongptMetadata.uploadChunks} chunks / ${tongptMetadata.uploadTransactions} transactions / ${uploadValueTon.toFixed(2)} TON funding`
                : 'Direct signer required for model upload'}
            </div>
            <Button
              type="button"
              variant="secondary"
              className="mt-3 w-full"
              disabled={!canUseWallet || isUploadingModel}
              onClick={() => void togglePaused()}
            >
              {config?.isPaused ? <Play /> : <Pause />}
              {config?.isPaused ? 'Unpause' : 'Pause'}
            </Button>
          </div>
        </section>

        <section className="grid min-h-[720px] min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] rounded-lg border bg-card max-sm:min-h-[560px]">
          <div className="flex min-w-0 items-center justify-between gap-3 border-b p-4">
            <div className="flex shrink-0 items-center gap-2 font-semibold">
              <Bot className="size-4 text-primary" />
              Tolki
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
              {defaultPrompts.map((item) => (
                <Button
                  key={item}
                  variant="secondary"
                  size="sm"
                  className="shrink-0"
                  onClick={() => setPrompt(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <div className="min-h-0 space-y-3 overflow-y-auto p-4">
            {chat.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex gap-3',
                  item.role === 'user' && 'justify-end',
                  item.role === 'system' && 'justify-center',
                )}
              >
                {item.role === 'assistant' && (
                  <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Bot className="size-4" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[78%] rounded-lg border px-3.5 py-3 text-[14px]',
                    item.role === 'user' &&
                      'bg-primary text-primary-foreground',
                    item.role === 'assistant' && 'bg-background',
                    item.role === 'system' &&
                      'bg-secondary text-muted-foreground',
                    item.state === 'error' &&
                      'border-destructive/50 text-destructive',
                  )}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {item.text}
                  </div>
                  {item.state === 'pending' && (
                    <div className="mt-2 flex items-center gap-2 text-[12px] opacity-70">
                      <span className="spinner size-3" />
                      Pending
                    </div>
                  )}
                  {item.txHash && (
                    <a
                      className="mt-2 inline-flex items-center gap-1 text-[12px] text-primary"
                      href={`${tonviewerUrl(network)}/transaction/${item.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      tx {shortAddress(item.txHash)}
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
                {item.role === 'user' && (
                  <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                    <User className="size-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <form
            className="grid gap-3 border-t p-4"
            onSubmit={(event) => void sendPrompt(event)}
          >
            <textarea
              className={textareaClass}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              disabled={isSending || isUploadingModel}
            />
            <div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
              <div className="text-[13px] text-muted-foreground">
                {canSend
                  ? `${generationValueTon.toFixed(2)} TON / ${
                      tongptMetadata.maxGenerate *
                        tongptMetadata.continuationWindows +
                      1
                    } messages`
                  : !canUseContract
                    ? 'Contract required'
                    : proMode && !hasProSeed
                      ? 'Seed required'
                      : !proMode && !walletAddress
                        ? 'Wallet required'
                        : !proMode && !walletChainMatches
                          ? 'Wallet network required'
                          : modelStatusKnown && !isModelReady
                            ? 'Upload weights first'
                            : 'Model status unavailable'}
              </div>
              <Button
                disabled={
                  !canSend || isSending || isUploadingModel || !prompt.trim()
                }
              >
                {isSending ? <span className="spinner" /> : <Send />}
                Send Comment
              </Button>
            </div>
          </form>
        </section>

        <section className="grid min-w-0 content-start gap-4 max-xl:col-span-2 max-lg:col-span-1">
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold">
                <Database className="size-4 text-primary" />
                Config
              </div>
              <span
                className={cn(
                  'rounded-md border px-2 py-1 text-[12px] font-semibold',
                  config?.isPaused
                    ? 'border-warning/40 text-warning'
                    : 'border-success/40 text-success',
                )}
              >
                {config?.isPaused ? 'Paused' : 'Live'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[13px]">
              {[
                ['Candidates', bigintText(config?.candidateCount)],
                ['Next job', bigintText(config?.nextJobId)],
                ['EOS', bigintText(config?.eosToken)],
                ['Context', bigintText(config?.maxContext)],
                ['Generate', bigintText(config?.maxGenerate)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border bg-background p-3"
                >
                  <div className="text-muted-foreground">{label}</div>
                  <div className="mt-1 font-mono text-[15px]">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-md border bg-background p-3 text-[13px]">
              <div className="text-muted-foreground">Owner</div>
              <div className="mt-1 break-all font-mono text-[12px]">
                {config
                  ? config.owner.toString({
                      bounceable: false,
                      testOnly: network === 'testnet',
                    })
                  : '-'}
              </div>
            </div>
          </div>

          {!proMode && !walletChainMatches && (
            <div className="rounded-lg border border-warning/40 bg-card p-4 text-[13px] text-warning">
              Wallet network mismatch
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
