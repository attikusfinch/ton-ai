import "types"

contract TinyLm {
    author: "Acton User"
    version: "0.1.0"
    description: "Tiny on-chain recurrent language model"
    storage: Storage
    incomingMessages: AllowedMessage
}

struct NeuralRuntime {
    h0: int
    h1: int
    h2: int
    h3: int
}

struct NeuralBest {
    tokenId: uint16
    score: int
    hasBest: bool
}

fun assertOwner(sender: address, storage: Storage) {
    assert (sender == storage.owner) throw Errors.NotOwner;
}

fun validateModelMeta(
    _modelVersion: uint32,
    vocabSize: uint16,
    maxContext: uint8,
    maxGenerate: uint8,
) {
    assert (vocabSize > 0) throw Errors.InvalidConfig;
    assert (maxContext > 0 && maxContext <= 128) throw Errors.InvalidConfig;
    assert (maxGenerate > 0 && maxGenerate <= 32) throw Errors.InvalidConfig;
}

fun validateTokenId(tokenId: uint16, storage: Storage) {
    assert (tokenId < storage.vocabSize) throw Errors.InvalidToken;
}

fun isTextComment(body: slice): bool {
    return body.remainingBitsCount() >= 32 && body.preloadUint(32) == 0;
}

fun promptHashFromComment(body: slice): uint256 {
    var prompt = body;
    prompt.skipBits(32);
    return prompt.hash();
}

fun knownReplyBodyForComment(body: slice, storage: Storage): cell? {
    val lookup = storage.knownReplies.get(promptHashFromComment(body));
    if (lookup.isFound) {
        return lookup.loadValue();
    }

    return null;
}

fun parsePreviousTokenFromComment(body: slice, storage: Storage): uint16 {
    var prompt = body;
    prompt.skipBits(32);
    assert (prompt.remainingBitsCount() >= 8) throw Errors.InvalidPrompt;

    var previousToken = 0;
    while (prompt.remainingBitsCount() >= 8) {
        previousToken = prompt.loadUint(8);
    }

    val tokenId = previousToken as uint16;
    validateTokenId(tokenId, storage);
    return tokenId;
}

fun predictNextFromStorage(previousToken: uint16, storage: Storage): uint16 {
    assert (!storage.isPaused) throw Errors.Paused;
    validateTokenId(previousToken, storage);

    val lookup = storage.transitions.get(previousToken);
    if (lookup.isFound) {
        return lookup.loadValue().nextToken;
    }

    return 0;
}

fun commentBodyForToken(tokenId: uint16, storage: Storage): cell {
    val lookup = storage.tokenBytes.get(tokenId);
    if (lookup.isFound) {
        return beginCell().storeUint(0, 32).storeSlice(lookup.loadValue().beginParse()).endCell();
    }

    return beginCell().storeUint(0, 32).storeUint(0x3f, 8).endCell();
}

fun appendModelToken(mutate result: builder, tokenId: uint16, storage: Storage): bool {
    val tokenLookup = storage.tokenBytes.get(tokenId);
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

fun relu(value: int): int {
    return value > 0 ? value : 0;
}

fun boundedRelu(value: int): int {
    return min(relu(value), 512);
}

fun emptyNeuralRuntime(): NeuralRuntime {
    return NeuralRuntime {
        h0: 0,
        h1: 0,
        h2: 0,
        h3: 0,
    };
}

fun neuralStepDim(
    inputValue: int,
    hiddenValue: int,
    inputWeight: int,
    recurrentWeight: int,
    bias: int,
): int {
    return boundedRelu((inputValue * inputWeight + hiddenValue * recurrentWeight) / 16 + bias);
}

fun neuralStepRuntime(
    embedding: NeuralEmbedding,
    runtime: NeuralRuntime,
    step: NeuralStep,
): NeuralRuntime {
    return NeuralRuntime {
        h0: neuralStepDim(embedding.e0, runtime.h0, step.inputW0, step.recurrentW0, step.bias0),
        h1: neuralStepDim(embedding.e1, runtime.h1, step.inputW1, step.recurrentW1, step.bias1),
        h2: neuralStepDim(embedding.e2, runtime.h2, step.inputW2, step.recurrentW2, step.bias2),
        h3: neuralStepDim(embedding.e3, runtime.h3, step.inputW3, step.recurrentW3, step.bias3),
    };
}

fun fallbackByteEmbedding(tokenId: uint16): NeuralEmbedding {
    if (tokenId == 0x3f) {
        return NeuralEmbedding {
            e0: 16,
            e1: 0,
            e2: 0,
            e3: 0,
        };
    }

    if (tokenId == 0x2c) {
        return NeuralEmbedding {
            e0: 0,
            e1: 160,
            e2: 0,
            e3: 0,
        };
    }

    if (tokenId == 0x48 || tokenId == 0x68) {
        return NeuralEmbedding {
            e0: 0,
            e1: 80,
            e2: 0,
            e3: 0,
        };
    }

    if (tokenId == 0x57 || tokenId == 0x77) {
        return NeuralEmbedding {
            e0: 160,
            e1: 0,
            e2: 0,
            e3: 0,
        };
    }

    if (tokenId == 0x49 || tokenId == 0x69) {
        return NeuralEmbedding {
            e0: 40,
            e1: 0,
            e2: 0,
            e3: 0,
        };
    }

    return NeuralEmbedding {
        e0: 0,
        e1: 0,
        e2: 1,
        e3: 0,
    };
}

fun neuralStepPromptToken(
    tokenId: uint16,
    neuralState: NeuralState,
    runtime: NeuralRuntime,
): NeuralRuntime {
    val embeddingLookup = neuralState.embeddings.get(tokenId);
    if (embeddingLookup.isFound) {
        return neuralStepRuntime(embeddingLookup.loadValue(), runtime, neuralState.step);
    }

    return neuralStepRuntime(fallbackByteEmbedding(tokenId), runtime, neuralState.step);
}

fun neuralStepGeneratedToken(
    tokenId: uint16,
    neuralState: NeuralState,
    _runtime: NeuralRuntime,
): NeuralRuntime? {
    val embeddingLookup = neuralState.embeddings.get(tokenId);
    if (!embeddingLookup.isFound) {
        return null;
    }

    return neuralStepRuntime(embeddingLookup.loadValue(), emptyNeuralRuntime(), neuralState.step);
}

fun neuralHeadScore(runtime: NeuralRuntime, head: NeuralHead): int {
    return runtime.h0 * head.w0 + runtime.h1 * head.w1 + runtime.h2 * head.w2 +
    runtime.h3 * head.w3 +
    head.bias;
}

fun considerNeuralCandidate(
    candidateToken: uint16,
    runtime: NeuralRuntime,
    neuralState: NeuralState,
    tokenBytes: map<uint16, cell>,
    best: NeuralBest,
): NeuralBest {
    val headLookup = neuralState.heads.get(candidateToken);
    if (!headLookup.isFound) {
        return best;
    }

    val tokenLookup = tokenBytes.get(candidateToken);
    if (!tokenLookup.isFound) {
        return best;
    }

    val score = neuralHeadScore(runtime, headLookup.loadValue());
    if (!best.hasBest || score > best.score) {
        return NeuralBest {
            tokenId: candidateToken,
            score,
            hasBest: true,
        };
    }

    return best;
}

fun neuralPredictFromRuntime(
    runtime: NeuralRuntime,
    neuralState: NeuralState,
    tokenBytes: map<uint16, cell>,
): uint16? {
    var best = NeuralBest {
        tokenId: 0,
        score: 0,
        hasBest: false,
    };

    best = considerNeuralCandidate(200, runtime, neuralState, tokenBytes, best);
    best = considerNeuralCandidate(201, runtime, neuralState, tokenBytes, best);
    best = considerNeuralCandidate(202, runtime, neuralState, tokenBytes, best);
    best = considerNeuralCandidate(203, runtime, neuralState, tokenBytes, best);
    best = considerNeuralCandidate(210, runtime, neuralState, tokenBytes, best);
    best = considerNeuralCandidate(211, runtime, neuralState, tokenBytes, best);
    best = considerNeuralCandidate(212, runtime, neuralState, tokenBytes, best);
    best = considerNeuralCandidate(213, runtime, neuralState, tokenBytes, best);

    if (best.hasBest) {
        return best.tokenId;
    }

    return null;
}

fun neuralPredictNextToken(previousToken: uint16, storage: Storage): uint16? {
    val neuralState = storage.neuralState.load();
    val runtime = neuralStepGeneratedToken(previousToken, neuralState, emptyNeuralRuntime());
    if (runtime == null) {
        return null;
    }

    return neuralPredictFromRuntime(runtime!, neuralState, storage.tokenBytes);
}

fun nextModelToken(previousToken: uint16, storage: Storage): uint16? {
    val transitionLookup = storage.transitions.get(previousToken);
    if (transitionLookup.isFound) {
        val nextToken = transitionLookup.loadValue().nextToken;
        if (nextToken >= storage.vocabSize) {
            return null;
        }

        return nextToken;
    }

    return neuralPredictNextToken(previousToken, storage);
}

fun generatedCommentFromRuntime(
    runtimeStart: NeuralRuntime,
    storage: Storage,
    neuralState: NeuralState,
): cell {
    var result = beginCell();
    result.storeUint(0, 32);

    var runtime = runtimeStart;
    var generated = 0;
    var shouldGenerate = true;

    while (generated < storage.maxGenerate && shouldGenerate) {
        val nextToken = neuralPredictFromRuntime(runtime, neuralState, storage.tokenBytes);
        if (nextToken == null) {
            shouldGenerate = false;
        } else {
            if (appendModelToken(mutate result, nextToken!, storage)) {
                generated += 1;
                val nextRuntime = neuralStepGeneratedToken(nextToken!, neuralState, runtime);
                if (nextRuntime == null) {
                    shouldGenerate = false;
                } else {
                    runtime = nextRuntime!;
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

fun generatedCommentFromPrompt(body: slice, storage: Storage): cell {
    var prompt = body;
    prompt.skipBits(32);
    assert (prompt.remainingBitsCount() >= 8) throw Errors.InvalidPrompt;
    assert (prompt.remainingBitsCount() / 8 <= storage.maxContext) throw Errors.InvalidPrompt;

    val neuralState = storage.neuralState.load();
    var runtime = emptyNeuralRuntime();
    var lastToken = 0;

    while (prompt.remainingBitsCount() >= 8) {
        lastToken = prompt.loadUint(8) as uint16;
        validateTokenId(lastToken, storage);
        runtime = neuralStepPromptToken(lastToken, neuralState, runtime);
    }

    if (storage.transitions.get(lastToken).isFound) {
        return generatedCommentFromToken(lastToken, storage);
    }

    return generatedCommentFromRuntime(runtime, storage, neuralState);
}

fun generatedCommentFromToken(previousTokenStart: uint16, storage: Storage): cell {
    var result = beginCell();
    result.storeUint(0, 32);

    var previousToken = previousTokenStart;
    var generated = 0;
    var shouldGenerate = true;

    while (generated < storage.maxGenerate && shouldGenerate) {
        val nextToken = nextModelToken(previousToken, storage);
        if (nextToken == null) {
            shouldGenerate = false;
        } else {
            if (appendModelToken(mutate result, nextToken!, storage)) {
                previousToken = nextToken!;
                generated += 1;
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

fun lastByteFromTextCommentBody(replyBody: cell): uint16 {
    var body = replyBody.beginParse();
    if (!isTextComment(body)) {
        return 0;
    }

    body.skipBits(32);

    var lastByte = 0;
    while (body.remainingBitsCount() >= 8) {
        lastByte = body.loadUint(8);
    }

    return lastByte as uint16;
}

fun appendGeneratedTail(replyBody: cell, storage: Storage): cell {
    val body = replyBody.beginParse();
    if (!isTextComment(body)) {
        return replyBody;
    }

    var result = beginCell();
    result.storeSlice(replyBody.beginParse());

    var previousToken = lastByteFromTextCommentBody(replyBody);
    var generated = 0;
    var shouldGenerate = true;

    while (generated < storage.maxGenerate && shouldGenerate) {
        val nextToken = nextModelToken(previousToken, storage);
        if (nextToken == null) {
            shouldGenerate = false;
        } else {
            if (appendModelToken(mutate result, nextToken!, storage)) {
                previousToken = nextToken!;
                generated += 1;
            } else {
                shouldGenerate = false;
            }
        }
    }

    return result.endCell();
}

fun replyToPromptComment(senderAddress: address, body: slice) {
    val storage = lazy Storage.load();
    assert (!storage.isPaused) throw Errors.Paused;

    var replyBody = knownReplyBodyForComment(body, storage);
    if (replyBody != null) {
        replyBody = appendGeneratedTail(replyBody!, storage);
    }
    if (replyBody == null) {
        replyBody = generatedCommentFromPrompt(body, storage);
    }

    val outMsg = createMessage({
        bounce: BounceMode.NoBounce,
        value: ton("0.01"),
        dest: senderAddress,
        body: replyBody!,
    });
    outMsg.send(SEND_MODE_REGULAR);
}

fun onInternalMessage(in: InMessage) {
    if (isTextComment(in.body)) {
        replyToPromptComment(in.senderAddress, in.body);
        return;
    }

    val msg = lazy AllowedMessage.fromSlice(in.body);

    match (msg) {
        SetModelMeta => {
            var storage = lazy Storage.load();
            assertOwner(in.senderAddress, storage);
            validateModelMeta(msg.modelVersion, msg.vocabSize, msg.maxContext, msg.maxGenerate);
            storage.modelVersion = msg.modelVersion;
            storage.vocabSize = msg.vocabSize;
            storage.maxContext = msg.maxContext;
            storage.maxGenerate = msg.maxGenerate;
            storage.save();
        }
        SetToken => {
            var storage = lazy Storage.load();
            assertOwner(in.senderAddress, storage);
            validateTokenId(msg.tokenId, storage);
            storage.tokenBytes.set(msg.tokenId, msg.tokenData);
            storage.save();
        }
        SetTransition => {
            var storage = lazy Storage.load();
            assertOwner(in.senderAddress, storage);
            validateTokenId(msg.previousToken, storage);
            validateTokenId(msg.nextToken, storage);
            storage
                .transitions
                .set(
                    msg.previousToken,
                    TransitionRow {
                        nextToken: msg.nextToken,
                        score: msg.score,
                    },
                );
            storage.save();
        }
        ClearTransition => {
            var storage = lazy Storage.load();
            assertOwner(in.senderAddress, storage);
            validateTokenId(msg.previousToken, storage);
            storage.transitions.delete(msg.previousToken);
            storage.save();
        }
        SetKnownReply => {
            var storage = lazy Storage.load();
            assertOwner(in.senderAddress, storage);
            storage.knownReplies.set(msg.promptHash, msg.replyBody);
            storage.save();
        }
        ClearKnownReply => {
            var storage = lazy Storage.load();
            assertOwner(in.senderAddress, storage);
            storage.knownReplies.delete(msg.promptHash);
            storage.save();
        }
        SetPaused => {
            var storage = lazy Storage.load();
            assertOwner(in.senderAddress, storage);
            storage.isPaused = msg.isPaused;
            storage.save();
        }
        Withdraw => {
            val storage = lazy Storage.load();
            assertOwner(in.senderAddress, storage);
            assert (msg.amount > 0) throw Errors.InvalidAmount;

            val outMsg = createMessage({
                bounce: BounceMode.NoBounce,
                value: msg.amount,
                dest: msg.to,
            });
            outMsg.send(SEND_MODE_REGULAR);
        }
        else => {
            assert (in.body.isEmpty()) throw Errors.InvalidMessage;
        }
    }
}

fun onBouncedMessage(_in: InMessageBounced) {}

get fun owner(): address {
    val storage = lazy Storage.load();
    return storage.owner;
}

get fun config(): TinyLmConfig {
    val storage = lazy Storage.load();
    return TinyLmConfig {
        owner: storage.owner,
        modelVersion: storage.modelVersion,
        vocabSize: storage.vocabSize,
        maxContext: storage.maxContext,
        maxGenerate: storage.maxGenerate,
        isPaused: storage.isPaused,
    };
}

get fun token(tokenId: uint16): TokenLookup {
    val storage = lazy Storage.load();
    validateTokenId(tokenId, storage);

    val lookup = storage.tokenBytes.get(tokenId);
    if (lookup.isFound) {
        return TokenLookup {
            exists: true,
            tokenData: lookup.loadValue(),
        };
    }

    return TokenLookup {
        exists: false,
        tokenData: createEmptyCell(),
    };
}

get fun transition(previousToken: uint16): TransitionLookup {
    val storage = lazy Storage.load();
    validateTokenId(previousToken, storage);

    val lookup = storage.transitions.get(previousToken);
    if (lookup.isFound) {
        val row = lookup.loadValue();
        return TransitionLookup {
            exists: true,
            nextToken: row.nextToken,
            score: row.score,
        };
    }

    return TransitionLookup {
        exists: false,
        nextToken: 0,
        score: 0,
    };
}

get fun neuralEmbedding(tokenId: uint16): NeuralEmbeddingLookup {
    val storage = lazy Storage.load();
    validateTokenId(tokenId, storage);

    val neuralState = storage.neuralState.load();
    val lookup = neuralState.embeddings.get(tokenId);
    if (lookup.isFound) {
        val embedding = lookup.loadValue();
        return NeuralEmbeddingLookup {
            exists: true,
            e0: embedding.e0,
            e1: embedding.e1,
            e2: embedding.e2,
            e3: embedding.e3,
        };
    }

    return NeuralEmbeddingLookup {
        exists: false,
        e0: 0,
        e1: 0,
        e2: 0,
        e3: 0,
    };
}

get fun neuralHead(tokenId: uint16): NeuralHeadLookup {
    val storage = lazy Storage.load();
    validateTokenId(tokenId, storage);

    val neuralState = storage.neuralState.load();
    val lookup = neuralState.heads.get(tokenId);
    if (lookup.isFound) {
        val head = lookup.loadValue();
        return NeuralHeadLookup {
            exists: true,
            w0: head.w0,
            w1: head.w1,
            w2: head.w2,
            w3: head.w3,
            bias: head.bias,
        };
    }

    return NeuralHeadLookup {
        exists: false,
        w0: 0,
        w1: 0,
        w2: 0,
        w3: 0,
        bias: 0,
    };
}

get fun neuralPredictNext(previousToken: uint16): uint16 {
    val storage = lazy Storage.load();
    assert (!storage.isPaused) throw Errors.Paused;
    validateTokenId(previousToken, storage);

    val nextToken = neuralPredictNextToken(previousToken, storage);
    if (nextToken != null) {
        return nextToken!;
    }

    return 0;
}

get fun predictNext(previousToken: uint16): uint16 {
    val storage = lazy Storage.load();
    return predictNextFromStorage(previousToken, storage);
}
