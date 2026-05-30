import "tongpt_types"

contract TonGpt {
    author: "Acton User"
    version: "0.1.0"
    description: "TONGPT no-cache recurrent on-chain language model"
    storage: TonGptStorage
    incomingMessages: TonGptMessage
}

fun assertTonGptOwner(sender: address, storage: TonGptStorage) {
    assert (sender == storage.owner) throw TonGptErrors.NotOwner;
}

fun isTonGptTextComment(body: slice): bool {
    return body.remainingBitsCount() >= 32 && body.preloadUint(32) == 0;
}

fun normalizeTonGptByte(byteValue: uint16): uint8 {
    if (byteValue >= 0x41 && byteValue <= 0x5a) {
        return (byteValue + 0x20) as uint8;
    }

    if (byteValue < 128) {
        return byteValue as uint8;
    }

    return 0x3f;
}

fun encodeTonGptPrompt(body: slice, storage: TonGptStorage): TonGptHidden {
    var prompt = body;
    prompt.skipBits(32);
    assert (prompt.remainingBitsCount() >= 8) throw TonGptErrors.InvalidPrompt;
    assert (prompt.remainingBitsCount() / 8 <= storage.maxContext) throw TonGptErrors.InvalidPrompt;

    val model = storage.modelData();
    val promptWeights = model.promptData();
    var hidden = emptyTonGptHidden();
    var position: uint8 = 0;
    var hasPrevious = false;
    var previousByte: uint8 = 0;

    while (prompt.remainingBitsCount() >= 8) {
        val byteValue = normalizeTonGptByte(prompt.loadUint(8) as uint16);
        val embeddingLookup = promptWeights.byteEmbeddings.get(byteValue);
        if (embeddingLookup.isFound) {
            hidden = addTonGptVector(hidden, embeddingLookup.loadValue());
        }
        val positionLookup = promptWeights.positionEmbeddings.get(position);
        if (positionLookup.isFound) {
            hidden = addTonGptVector(hidden, positionLookup.loadValue());
        }
        if (hasPrevious) {
            val pairId = ((previousByte as uint16) * 128 + (byteValue as uint16)) as uint16;
            val pairLookup = promptWeights.pairEmbeddings.get(pairId);
            if (pairLookup.isFound) {
                hidden = addTonGptVector(hidden, pairLookup.loadValue());
            }
        }
        previousByte = byteValue;
        hasPrevious = true;
        position += 1;
    }

    return hidden;
}

fun appendTonGptToken(
    mutate result: builder,
    tokenId: uint16,
    outputWeights: TonGptOutputWeights,
): bool {
    val tokenLookup = outputWeights.tokenBytes.get(tokenId);
    if (!tokenLookup.isFound) {
        return false;
    }

    val tokenData = tokenLookup.loadValue().beginParse();
    val (tokenBits, tokenRefs) = tokenData.remainingBitsAndRefsCount();
    if (result.bitsCount() + tokenBits > 1023 || result.refsCount() + tokenRefs > 4) {
        return false;
    }

    result.storeSlice(tokenData);
    return true;
}

fun emptyTonGptReply(): cell {
    return beginCell().storeUint(0, 32).endCell();
}

fun appendTonGptTokenToCell(
    replyBody: cell,
    tokenId: uint16,
    outputWeights: TonGptOutputWeights,
): cell? {
    val tokenLookup = outputWeights.tokenBytes.get(tokenId);
    if (!tokenLookup.isFound) {
        return null;
    }

    var result = beginCell();
    result.storeSlice(replyBody.beginParse());

    val tokenData = tokenLookup.loadValue().beginParse();
    val (tokenBits, tokenRefs) = tokenData.remainingBitsAndRefsCount();
    if (result.bitsCount() + tokenBits > 1023 || result.refsCount() + tokenRefs > 4) {
        return null;
    }

    result.storeSlice(tokenData);
    return result.endCell();
}

fun stepTonGptGeneratedToken(
    hidden: TonGptHidden,
    tokenId: uint16,
    outputWeights: TonGptOutputWeights,
): TonGptHidden? {
    val embeddingLookup = outputWeights.tokenEmbeddings.get(tokenId);
    if (!embeddingLookup.isFound) {
        return null;
    }

    return addTonGptVector(hidden, embeddingLookup.loadValue());
}

fun generatedTonGptCommentFromHidden(hiddenStart: TonGptHidden, storage: TonGptStorage): cell {
    var result = beginCell();
    result.storeUint(0, 32);

    val model = storage.modelData();
    val outputWeights = model.outputData();
    var hidden = hiddenStart;
    var generated = 0;
    var shouldGenerate = true;

    while (generated < storage.maxGenerate && shouldGenerate) {
        var best = TonGptBest {
            tokenId: 0,
            score: 0,
            hasBest: false,
        };
        best = tongptConsiderCandidateRange(hidden, outputWeights, 0, storage.candidateCount, best);
        if (!best.hasBest || best.tokenId == storage.eosToken) {
            shouldGenerate = false;
        } else {
            if (appendTonGptToken(mutate result, best.tokenId, outputWeights)) {
                generated += 1;
                val nextHidden = stepTonGptGeneratedToken(hidden, best.tokenId, outputWeights);
                if (nextHidden == null) {
                    shouldGenerate = false;
                } else {
                    hidden = nextHidden!;
                }
            } else {
                shouldGenerate = false;
            }
        }
    }

    if (generated == 0) {
        result.storeUint(0x3f, 8);
    }

    return result.endCell();
}

fun sendTonGptRefund(user: address) {
    val outMsg = createMessage({
        bounce: BounceMode.NoBounce,
        value: 0,
        dest: user,
    });
    outMsg.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE + SEND_MODE_IGNORE_ERRORS);
}

fun sendFinalTonGptReply(user: address, replyBody: cell) {
    val outMsg = createMessage({
        bounce: BounceMode.NoBounce,
        value: 0,
        dest: user,
        body: replyBody,
    });
    outMsg.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE + SEND_MODE_IGNORE_ERRORS);
}

fun startTonGptJob(senderAddress: address, body: slice) {
    var storage = lazy TonGptStorage.load();
    assert (!storage.isPaused) throw TonGptErrors.Paused;

    val hidden = encodeTonGptPrompt(body, storage);
    val jobId = storage.nextJobId;
    storage.nextJobId += 1;
    storage
        .jobs
        .set(
            jobId,
            TonGptJob {
                user: senderAddress,
                hidden,
                generated: 0,
                replyBody: emptyTonGptReply(),
                scanCursor: 0,
                bestToken: 0,
                bestScore: 0,
                hasBest: false,
            },
        );
    storage.save();
    sendTonGptRefund(senderAddress);
}

fun continueTonGptJob(senderAddress: address, msg: ContinueTonGpt) {
    var storage = lazy TonGptStorage.load();
    assert (!storage.isPaused) throw TonGptErrors.Paused;

    val lookup = storage.jobs.get(msg.jobId);
    if (!lookup.isFound) {
        sendTonGptRefund(senderAddress);
        return;
    }

    var job = lookup.loadValue();
    val model = storage.modelData();
    val outputWeights = model.outputData();
    val candidateCount = storage.candidateCount;
    var nextCursor = (job.scanCursor + tongptCandidateChunkSize()) as uint16;
    if (nextCursor > candidateCount) {
        nextCursor = candidateCount;
    }

    var best = TonGptBest {
        tokenId: job.bestToken,
        score: job.bestScore,
        hasBest: job.hasBest,
    };
    best = tongptConsiderCandidateRange(
        job.hidden,
        outputWeights,
        job.scanCursor,
        nextCursor,
        best,
    );

    if (nextCursor < candidateCount) {
        job.scanCursor = nextCursor;
        job.bestToken = best.tokenId;
        job.bestScore = best.score;
        job.hasBest = best.hasBest;
        storage.jobs.set(msg.jobId, job);
        storage.save();
        sendTonGptRefund(job.user);
        return;
    }

    if (!best.hasBest || best.tokenId == storage.eosToken) {
        storage.jobs.delete(msg.jobId);
        storage.save();
        sendFinalTonGptReply(job.user, job.generated == 0 ? tonGptTextComment("?") : job.replyBody);
        return;
    }

    val nextReplyBody = appendTonGptTokenToCell(job.replyBody, best.tokenId, outputWeights);
    if (nextReplyBody == null) {
        storage.jobs.delete(msg.jobId);
        storage.save();
        sendFinalTonGptReply(job.user, job.generated == 0 ? tonGptTextComment("?") : job.replyBody);
        return;
    }

    job.replyBody = nextReplyBody!;
    job.generated += 1;

    val nextHidden = stepTonGptGeneratedToken(job.hidden, best.tokenId, outputWeights);
    if (job.generated >= storage.maxGenerate || nextHidden == null) {
        storage.jobs.delete(msg.jobId);
        storage.save();
        sendFinalTonGptReply(job.user, job.replyBody);
        return;
    }

    job.hidden = nextHidden!;
    job.scanCursor = 0;
    job.bestToken = 0;
    job.bestScore = 0;
    job.hasBest = false;
    storage.jobs.set(msg.jobId, job);
    storage.save();
}

fun uploadTonGptPromptChunk(senderAddress: address, msg: UploadTonGptPromptChunk) {
    var storage = lazy TonGptStorage.load();
    assertTonGptOwner(senderAddress, storage);

    val model = storage.modelData();
    var promptWeights = model.promptData();
    mergeTonGptVectorMap8(mutate promptWeights.byteEmbeddings, msg.byteEmbeddings);
    mergeTonGptVectorMap8(mutate promptWeights.positionEmbeddings, msg.positionEmbeddings);
    mergeTonGptVectorMap16(mutate promptWeights.pairEmbeddings, msg.pairEmbeddings);

    storage.model = TonGptModelStorage {
        prompt: promptWeights.toCell(),
        output: model.output,
    }.toCell();
    storage.save();
}

fun uploadTonGptOutputChunk(senderAddress: address, msg: UploadTonGptOutputChunk) {
    var storage = lazy TonGptStorage.load();
    assertTonGptOwner(senderAddress, storage);

    val model = storage.modelData();
    var outputWeights = model.outputData();
    mergeTonGptVectorMap16(mutate outputWeights.tokenEmbeddings, msg.tokenEmbeddings);
    mergeTonGptHeadMap16(mutate outputWeights.heads, msg.heads);
    mergeTonGptCellMap16(mutate outputWeights.tokenBytes, msg.tokenBytes);

    storage.model = TonGptModelStorage {
        prompt: model.prompt,
        output: outputWeights.toCell(),
    }.toCell();
    storage.save();
}

fun onInternalMessage(in: InMessage) {
    if (isTonGptTextComment(in.body)) {
        startTonGptJob(in.senderAddress, in.body);
        return;
    }

    val msg = lazy TonGptMessage.fromSlice(in.body);

    match (msg) {
        SetTonGptPaused => {
            var storage = lazy TonGptStorage.load();
            assertTonGptOwner(in.senderAddress, storage);
            storage.isPaused = msg.isPaused;
            storage.save();
        }
        WithdrawTonGpt => {
            val storage = lazy TonGptStorage.load();
            assertTonGptOwner(in.senderAddress, storage);

            val outMsg = createMessage({
                bounce: BounceMode.NoBounce,
                value: msg.amount,
                dest: msg.to,
            });
            outMsg.send(SEND_MODE_REGULAR);
        }
        ContinueTonGpt => {
            continueTonGptJob(in.senderAddress, msg);
        }
        UploadTonGptPromptChunk => {
            uploadTonGptPromptChunk(in.senderAddress, msg);
        }
        UploadTonGptOutputChunk => {
            uploadTonGptOutputChunk(in.senderAddress, msg);
        }
        else => {
            assert (in.body.isEmpty()) throw TonGptErrors.InvalidMessage;
        }
    }
}

fun onBouncedMessage(_in: InMessageBounced) {}

get fun config(): TonGptConfig {
    val storage = lazy TonGptStorage.load();
    return TonGptConfig {
        owner: storage.owner,
        nextJobId: storage.nextJobId,
        maxContext: storage.maxContext,
        maxGenerate: storage.maxGenerate,
        eosToken: storage.eosToken,
        candidateCount: storage.candidateCount,
        isPaused: storage.isPaused,
    };
}

get fun generate(body: cell): cell {
    val storage = lazy TonGptStorage.load();
    val hidden = encodeTonGptPrompt(body.beginParse(), storage);
    return generatedTonGptCommentFromHidden(hidden, storage);
}

get fun modelStatus(): TonGptModelStatus {
    val storage = lazy TonGptStorage.load();
    val model = storage.modelData();
    val promptWeights = model.promptData();
    val outputWeights = model.outputData();
    val byteEmbeddings = countTonGptVectorMap8(promptWeights.byteEmbeddings);
    val positionEmbeddings = countTonGptVectorMap8(promptWeights.positionEmbeddings);
    val pairEmbeddings = countTonGptVectorMap16(promptWeights.pairEmbeddings);
    val tokenEmbeddings = countTonGptVectorMap16(outputWeights.tokenEmbeddings);
    val heads = countTonGptHeadMap16(outputWeights.heads);
    val tokenBytes = countTonGptCellMap16(outputWeights.tokenBytes);
    val nonEosTokenCount = (storage.candidateCount - 1) as uint16;

    return TonGptModelStatus {
        byteEmbeddings,
        positionEmbeddings,
        pairEmbeddings,
        tokenEmbeddings,
        heads,
        tokenBytes,
        isReady: byteEmbeddings >= tongptExpectedByteEmbeddingCount() &&
        positionEmbeddings >= storage.maxContext &&
        pairEmbeddings >= tongptExpectedPairEmbeddingCount() &&
        tokenEmbeddings >= nonEosTokenCount &&
        heads >= storage.candidateCount &&
        tokenBytes >= nonEosTokenCount,
    };
}
