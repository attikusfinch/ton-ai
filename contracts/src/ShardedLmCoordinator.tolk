import "sharded_types"

contract ShardedLmCoordinator {
    author: "Acton User"
    version: "0.1.0"
    description: "Coordinator for pure on-chain sharded language-model inference"
    storage: CoordinatorStorage
    incomingMessages: ShardedCoordinatorMessage
}

fun assertCoordinatorOwner(sender: address, storage: CoordinatorStorage) {
    assert (sender == storage.owner) throw ShardedErrors.NotOwner;
}

fun isTextComment(body: slice): bool {
    return body.remainingBitsCount() >= 32 && body.preloadUint(32) == 0;
}

fun clampHidden(value: int): int16 {
    return min(value, 512) as int16;
}

fun addHiddenFeature(hidden: ShardedHidden, token: uint16): ShardedHidden {
    var h0 = hidden.h0;
    var h1 = hidden.h1;
    var h2 = hidden.h2;
    var h3 = hidden.h3;

    if (token == 0x57 || token == 0x77) {
        h0 = clampHidden(h0 + 160);
    } else if (token == 0x48 || token == 0x68 || token == 0x2c) {
        h1 = clampHidden(h1 + 120);
    } else if (token == 0x54 || token == 0x74) {
        h2 = clampHidden(h2 + 120);
    } else if (token == 0x3f) {
        h3 = clampHidden(h3 + 16);
    } else if ((token >= 0x41 && token <= 0x5a) || (token >= 0x61 && token <= 0x7a)) {
        h3 = clampHidden(h3 + 1);
    }

    return ShardedHidden { h0, h1, h2, h3 };
}

fun encodePrompt(body: slice, storage: CoordinatorStorage): ShardedHidden {
    var prompt = body;
    prompt.skipBits(32);
    assert (prompt.remainingBitsCount() >= 8) throw ShardedErrors.InvalidPrompt;
    assert (
        prompt.remainingBitsCount() / 8 <= storage.maxContext
    ) throw ShardedErrors.InvalidPrompt;

    var hidden = ShardedHidden {
        h0: 0,
        h1: 0,
        h2: 0,
        h3: 0,
    };

    while (prompt.remainingBitsCount() >= 8) {
        hidden = addHiddenFeature(hidden, prompt.loadUint(8) as uint16);
    }

    return hidden;
}

fun sendComputeToShard(shard: address, jobId: uint32, round: uint8, hidden: ShardedHidden) {
    val outMsg = createMessage({
        bounce: BounceMode.NoBounce,
        value: ton("0.03"),
        dest: shard,
        body: ShardCompute { jobId, round, hidden },
    });
    outMsg.send(SEND_MODE_REGULAR);
}

fun sendComputeRound(storage: CoordinatorStorage, jobId: uint32, round: uint8, hidden: ShardedHidden) {
    val shards = storage.shards.load();
    val first = shards.first.load();
    val second = shards.second.load();
    sendComputeToShard(first.shard0, jobId, round, hidden);
    sendComputeToShard(first.shard1, jobId, round, hidden);
    sendComputeToShard(second.shard0, jobId, round, hidden);
    sendComputeToShard(second.shard1, jobId, round, hidden);
}

fun appendShardToken(replyBody: cell, tokenId: uint16, storage: CoordinatorStorage): cell? {
    val lookup = storage.tokenBytes.get(tokenId);
    if (!lookup.isFound) {
        return null;
    }

    var result = beginCell();
    result.storeSlice(replyBody.beginParse());

    val tokenData = lookup.loadValue().beginParse();
    val (tokenBits, tokenRefs) = tokenData.remainingBitsAndRefsCount();
    if (result.bitsCount() + tokenBits > 1023 || result.refsCount() + tokenRefs > 4) {
        return null;
    }

    result.storeSlice(tokenData);
    return result.endCell();
}

fun hiddenAfterToken(tokenId: uint16, storage: CoordinatorStorage): ShardedHidden? {
    val lookup = storage.embeddings.get(tokenId);
    if (lookup.isFound) {
        return lookup.loadValue();
    }

    return null;
}

fun sendFinalReply(user: address, replyBody: cell) {
    val outMsg = createMessage({
        bounce: BounceMode.NoBounce,
        value: ton("0.01"),
        dest: user,
        body: replyBody,
    });
    outMsg.send(SEND_MODE_REGULAR);
}

fun isKnownShard(sender: address, storage: CoordinatorStorage): bool {
    val shards = storage.shards.load();
    val first = shards.first.load();
    val second = shards.second.load();
    return sender == first.shard0 || sender == first.shard1 || sender == second.shard0 ||
    sender == second.shard1;
}

fun startInference(senderAddress: address, body: slice) {
    var storage = lazy CoordinatorStorage.load();
    assert (!storage.isPaused) throw ShardedErrors.Paused;

    val hidden = encodePrompt(body, storage);
    val jobId = storage.nextJobId;
    storage.nextJobId += 1;
    storage
        .jobs
        .set(
            jobId,
            ShardedJob {
                user: senderAddress,
                hidden,
                round: 0,
                generated: 0,
                replyBody: emptyShardedReply(),
                pending: 4,
                received: 0,
                bestToken: 0,
                bestScore: 0,
                hasBest: false,
            },
        );
    storage.save();

    sendComputeRound(storage, jobId, 0, hidden);
}

fun receiveShardResult(senderAddress: address, msg: ShardResult) {
    var storage = lazy CoordinatorStorage.load();
    assert (isKnownShard(senderAddress, storage)) throw ShardedErrors.NotShard;

    val lookup = storage.jobs.get(msg.jobId);
    assert (lookup.isFound) throw ShardedErrors.JobNotFound;

    var job = lookup.loadValue();
    assert (msg.round == job.round) throw ShardedErrors.InvalidMessage;
    if (!job.hasBest || msg.score > job.bestScore) {
        job.bestToken = msg.tokenId;
        job.bestScore = msg.score;
        job.hasBest = true;
    }
    job.received += 1;

    if (job.received >= job.pending) {
        val nextReplyBody = appendShardToken(job.replyBody, job.bestToken, storage);
        if (nextReplyBody == null) {
            storage.jobs.delete(msg.jobId);
            storage.save();
            sendFinalReply(job.user, job.generated == 0 ? shardedTextComment("?") : job.replyBody);
            return;
        }

        job.replyBody = nextReplyBody!;
        job.generated += 1;

        val nextHidden = hiddenAfterToken(job.bestToken, storage);
        if (job.generated >= storage.maxGenerate || nextHidden == null) {
            storage.jobs.delete(msg.jobId);
            storage.save();
            sendFinalReply(job.user, job.replyBody);
            return;
        }

        job.hidden = nextHidden!;
        job.round += 1;
        job.received = 0;
        job.bestToken = 0;
        job.bestScore = 0;
        job.hasBest = false;
        storage.jobs.set(msg.jobId, job);
        storage.save();
        sendComputeRound(storage, msg.jobId, job.round, job.hidden);
    } else {
        storage.jobs.set(msg.jobId, job);
        storage.save();
    }
}

fun onInternalMessage(in: InMessage) {
    if (isTextComment(in.body)) {
        startInference(in.senderAddress, in.body);
        return;
    }

    val msg = lazy ShardedCoordinatorMessage.fromSlice(in.body);

    match (msg) {
        SetShards => {
            var storage = lazy CoordinatorStorage.load();
            assertCoordinatorOwner(in.senderAddress, storage);
            storage.shards = msg.shards;
            storage.save();
        }
        SetCoordinatorPaused => {
            var storage = lazy CoordinatorStorage.load();
            assertCoordinatorOwner(in.senderAddress, storage);
            storage.isPaused = msg.isPaused;
            storage.save();
        }
        ShardResult => {
            receiveShardResult(in.senderAddress, msg);
        }
        else => {
            assert (in.body.isEmpty()) throw ShardedErrors.InvalidMessage;
        }
    }
}

fun onBouncedMessage(_in: InMessageBounced) {}

get fun config(): ShardedCoordinatorConfig {
    val storage = lazy CoordinatorStorage.load();
    val shards = storage.shards.load();
    val first = shards.first.load();
    val second = shards.second.load();
    return ShardedCoordinatorConfig {
        owner: storage.owner,
        nextJobId: storage.nextJobId,
        maxContext: storage.maxContext,
        maxGenerate: storage.maxGenerate,
        shard0: first.shard0,
        shard1: first.shard1,
        shard2: second.shard0,
        shard3: second.shard1,
        isPaused: storage.isPaused,
    };
}

get fun encode(body: cell): ShardedHidden {
    val storage = lazy CoordinatorStorage.load();
    return encodePrompt(body.beginParse(), storage);
}
