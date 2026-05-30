enum ShardedErrors {
    NotOwner = 200
    NotCoordinator = 201
    NotShard = 202
    JobNotFound = 203
    Paused = 204
    InvalidPrompt = 205
    InvalidConfig = 206
    InvalidMessage = 0xFFFE
}

struct ShardedHidden {
    h0: int16
    h1: int16
    h2: int16
    h3: int16
}

struct ShardHead {
    w0: int16
    w1: int16
    w2: int16
    w3: int16
    bias: int16
}

struct ShardedJob {
    user: address
    hidden: ShardedHidden
    round: uint8
    generated: uint8
    replyBody: cell
    pending: uint8
    received: uint8
    bestToken: uint16
    bestScore: int32
    hasBest: bool
}

struct CoordinatorShardPair {
    shard0: address
    shard1: address
}

struct CoordinatorShards {
    first: Cell<CoordinatorShardPair>
    second: Cell<CoordinatorShardPair>
}

struct CoordinatorStorage {
    owner: address
    nextJobId: uint32
    maxContext: uint8
    maxGenerate: uint8
    shards: Cell<CoordinatorShards>
    tokenBytes: map<uint16, cell>
    embeddings: map<uint16, ShardedHidden>
    jobs: map<uint32, ShardedJob>
    isPaused: bool
}

struct VocabShardPage {
    token0: uint16
    head0: ShardHead
    token1: uint16
    head1: ShardHead
}

struct VocabShardStorage {
    owner: address
    coordinator: address
    shardId: uint8
    page: Cell<VocabShardPage>
    isPaused: bool
}

struct ShardedCoordinatorConfig {
    owner: address
    nextJobId: uint32
    maxContext: uint8
    maxGenerate: uint8
    shard0: address
    shard1: address
    shard2: address
    shard3: address
    isPaused: bool
}

struct VocabShardConfig {
    owner: address
    coordinator: address
    shardId: uint8
    token0: uint16
    token1: uint16
    isPaused: bool
}

type ShardedCoordinatorMessage =
    | SetShards
    | SetCoordinatorPaused
    | ShardResult

type VocabShardMessage =
    | ShardCompute
    | SetVocabShardPaused

struct (0x53485244) SetShards {
    shards: Cell<CoordinatorShards>
}

struct (0x53485053) SetCoordinatorPaused {
    isPaused: bool
}

struct (0x52534c54) ShardResult {
    jobId: uint32
    round: uint8
    tokenId: uint16
    score: int32
}

struct (0x434d5054) ShardCompute {
    jobId: uint32
    round: uint8
    hidden: ShardedHidden
}

struct (0x56505345) SetVocabShardPaused {
    isPaused: bool
}

fun CoordinatorStorage.load(): CoordinatorStorage {
    return CoordinatorStorage.fromCell(contract.getData());
}

fun CoordinatorStorage.save(self) {
    contract.setData(self.toCell());
}

fun VocabShardStorage.load(): VocabShardStorage {
    return VocabShardStorage.fromCell(contract.getData());
}

fun VocabShardStorage.save(self) {
    contract.setData(self.toCell());
}

fun shardedTextComment(text: string): cell {
    return beginCell().storeUint(0, 32).storeSlice(text.beginParse()).endCell();
}

fun shardedTextPayload(text: string): cell {
    return beginCell().storeSlice(text.beginParse()).endCell();
}

fun emptyShardedReply(): cell {
    return beginCell().storeUint(0, 32).endCell();
}

fun defaultShardedTokenBytes(): map<uint16, cell> {
    var tokens: map<uint16, cell> = [];

    tokens.set(100, shardedTextPayload("I"));
    tokens.set(101, shardedTextPayload(" use"));
    tokens.set(102, shardedTextPayload(" sharded"));
    tokens.set(103, shardedTextPayload(" TON."));
    tokens.set(110, shardedTextPayload("I"));
    tokens.set(111, shardedTextPayload(" am"));
    tokens.set(112, shardedTextPayload(" fine"));
    tokens.set(113, shardedTextPayload(" on-chain."));

    return tokens;
}

fun shardedHidden(h0: int16, h1: int16, h2: int16, h3: int16): ShardedHidden {
    return ShardedHidden { h0, h1, h2, h3 };
}

fun defaultShardedEmbeddings(): map<uint16, ShardedHidden> {
    var embeddings: map<uint16, ShardedHidden> = [];

    embeddings.set(100, shardedHidden(0, 0, 256, 0));
    embeddings.set(101, shardedHidden(0, 0, 0, 256));
    embeddings.set(102, shardedHidden(128, 128, 0, 0));
    embeddings.set(110, shardedHidden(0, 0, 128, 128));
    embeddings.set(111, shardedHidden(128, 0, 0, 128));
    embeddings.set(112, shardedHidden(0, 128, 128, 0));

    return embeddings;
}

fun defaultCoordinatorStorage(owner: address): CoordinatorStorage {
    return CoordinatorStorage {
        owner,
        nextJobId: 1,
        maxContext: 64,
        maxGenerate: 4,
        shards: CoordinatorShards {
            first: CoordinatorShardPair {
                shard0: owner,
                shard1: owner,
            }.toCell(),
            second: CoordinatorShardPair {
                shard0: owner,
                shard1: owner,
            }.toCell(),
        }.toCell(),
        tokenBytes: defaultShardedTokenBytes(),
        embeddings: defaultShardedEmbeddings(),
        jobs: [],
        isPaused: false,
    };
}

fun shardedHead(w0: int16, w1: int16, w2: int16, w3: int16, bias: int16): ShardHead {
    return ShardHead { w0, w1, w2, w3, bias };
}

fun shardedPage(
    token0: uint16,
    head0: ShardHead,
    token1: uint16,
    head1: ShardHead,
): Cell<VocabShardPage> {
    return VocabShardPage { token0, head0, token1, head1 }.toCell();
}

fun defaultVocabShardStorage(
    owner: address,
    coordinator: address,
    shardId: uint8,
): VocabShardStorage {
    if (shardId == 0) {
        return VocabShardStorage {
            owner,
            coordinator,
            shardId,
            page: shardedPage(
                100,
                shardedHead(80, 0, 0, 0, 0),
                110,
                shardedHead(0, 80, 0, 0, 0),
            ),
            isPaused: false,
        };
    }

    if (shardId == 1) {
        return VocabShardStorage {
            owner,
            coordinator,
            shardId,
            page: shardedPage(
                101,
                shardedHead(0, 0, 80, 0, 0),
                111,
                shardedHead(0, 0, 45, 45, 0),
            ),
            isPaused: false,
        };
    }

    if (shardId == 2) {
        return VocabShardStorage {
            owner,
            coordinator,
            shardId,
            page: shardedPage(
                102,
                shardedHead(0, 0, 0, 80, 0),
                112,
                shardedHead(45, 0, 0, 45, 0),
            ),
            isPaused: false,
        };
    }

    return VocabShardStorage {
        owner,
        coordinator,
        shardId,
        page: shardedPage(
            103,
            shardedHead(45, 45, 0, 0, 0),
            113,
            shardedHead(0, 45, 45, 0, 0),
        ),
        isPaused: false,
    };
}
