import "sharded_types"

contract VocabShard {
    author: "Acton User"
    version: "0.1.0"
    description: "Child contract that stores one shard of output-head weights"
    storage: VocabShardStorage
    incomingMessages: VocabShardMessage
}

fun assertShardOwner(sender: address, storage: VocabShardStorage) {
    assert (sender == storage.owner) throw ShardedErrors.NotOwner;
}

fun shardScore(hidden: ShardedHidden, head: ShardHead): int32 {
    return (hidden.h0 * head.w0 + hidden.h1 * head.w1 + hidden.h2 * head.w2 + hidden.h3 * head.w3 +
    head.bias) as int32;
}

fun onInternalMessage(in: InMessage) {
    val msg = lazy VocabShardMessage.fromSlice(in.body);

    match (msg) {
        ShardCompute => {
            val storage = lazy VocabShardStorage.load();
            assert (!storage.isPaused) throw ShardedErrors.Paused;
            assert (in.senderAddress == storage.coordinator) throw ShardedErrors.NotCoordinator;

            val page = storage.page.load();
            var bestToken = page.token0;
            var bestScore = shardScore(msg.hidden, page.head0);

            val score1 = shardScore(msg.hidden, page.head1);
            if (score1 > bestScore) {
                bestToken = page.token1;
                bestScore = score1;
            }

            val outMsg = createMessage({
                bounce: BounceMode.NoBounce,
                value: ton("0.01"),
                dest: storage.coordinator,
                body: ShardResult {
                    jobId: msg.jobId,
                    round: msg.round,
                    tokenId: bestToken,
                    score: bestScore,
                },
            });
            outMsg.send(SEND_MODE_REGULAR);
        }
        SetVocabShardPaused => {
            var storage = lazy VocabShardStorage.load();
            assertShardOwner(in.senderAddress, storage);
            storage.isPaused = msg.isPaused;
            storage.save();
        }
        else => {
            assert (in.body.isEmpty()) throw ShardedErrors.InvalidMessage;
        }
    }
}

fun onBouncedMessage(_in: InMessageBounced) {}

get fun config(): VocabShardConfig {
    val storage = lazy VocabShardStorage.load();
    val page = storage.page.load();
    return VocabShardConfig {
        owner: storage.owner,
        coordinator: storage.coordinator,
        shardId: storage.shardId,
        token0: page.token0,
        token1: page.token1,
        isPaused: storage.isPaused,
    };
}

get fun score(hidden: ShardedHidden): ShardResult {
    val storage = lazy VocabShardStorage.load();
    val page = storage.page.load();
    var bestToken = page.token0;
    var bestScore = shardScore(hidden, page.head0);

    val score1 = shardScore(hidden, page.head1);
    if (score1 > bestScore) {
        bestToken = page.token1;
        bestScore = score1;
    }

    return ShardResult {
        jobId: 0,
        round: 0,
        tokenId: bestToken,
        score: bestScore,
    };
}
