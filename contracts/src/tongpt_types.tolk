enum TonGptErrors {
    NotOwner = 300
    Paused = 301
    InvalidPrompt = 302
    InvalidToken = 303
    JobNotFound = 304
    InvalidMessage = 0xFFFE
}

struct TonGptVector {
    v0: int16
    v1: int16
    v2: int16
    v3: int16
    v4: int16
    v5: int16
    v6: int16
    v7: int16
    v8: int16
    v9: int16
    v10: int16
    v11: int16
    v12: int16
    v13: int16
    v14: int16
    v15: int16
}

struct TonGptHidden {
    h0: int16
    h1: int16
    h2: int16
    h3: int16
    h4: int16
    h5: int16
    h6: int16
    h7: int16
    h8: int16
    h9: int16
    h10: int16
    h11: int16
    h12: int16
    h13: int16
    h14: int16
    h15: int16
}

struct TonGptHead {
    w0: int16
    w1: int16
    w2: int16
    w3: int16
    w4: int16
    w5: int16
    w6: int16
    w7: int16
    w8: int16
    w9: int16
    w10: int16
    w11: int16
    w12: int16
    w13: int16
    w14: int16
    w15: int16
    bias: int32
}

struct TonGptBest {
    tokenId: uint16
    score: int32
    hasBest: bool
}

struct TonGptPromptEmbeddings {
    byteEmbeddings: map<uint8, TonGptVector>
    positionEmbeddings: map<uint8, TonGptVector>
    pairEmbeddings: map<uint16, TonGptVector>
}

struct TonGptOutputWeights {
    tokenEmbeddings: map<uint16, TonGptVector>
    heads: map<uint16, TonGptHead>
    tokenBytes: map<uint16, cell>
}

struct TonGptModelStorage {
    prompt: Cell<TonGptPromptEmbeddings>
    output: Cell<TonGptOutputWeights>
}

struct TonGptJob {
    user: address
    hidden: TonGptHidden
    generated: uint8
    replyBody: cell
    scanCursor: uint16
    bestToken: uint16
    bestScore: int32
    hasBest: bool
}

struct TonGptStorage {
    owner: address
    nextJobId: uint32
    maxContext: uint8
    maxGenerate: uint8
    eosToken: uint16
    model: Cell<TonGptModelStorage>
    jobs: map<uint32, TonGptJob>
    isPaused: bool
}

struct TonGptConfig {
    owner: address
    nextJobId: uint32
    maxContext: uint8
    maxGenerate: uint8
    eosToken: uint16
    candidateCount: uint16
    isPaused: bool
}

type TonGptMessage = SetTonGptPaused | WithdrawTonGpt | ContinueTonGpt

struct (0x54475053) SetTonGptPaused {
    isPaused: bool
}

struct (0x54475744) WithdrawTonGpt {
    to: address
    amount: coins
}

struct (0x5447434e) ContinueTonGpt {
    jobId: uint32
}

fun TonGptStorage.load(): TonGptStorage {
    return TonGptStorage.fromCell(contract.getData());
}

fun TonGptStorage.save(self) {
    contract.setData(self.toCell());
}

fun TonGptStorage.modelData(self): TonGptModelStorage {
    return TonGptModelStorage.fromCell(self.model);
}

fun TonGptModelStorage.promptData(self): TonGptPromptEmbeddings {
    return TonGptPromptEmbeddings.fromCell(self.prompt);
}

fun TonGptModelStorage.outputData(self): TonGptOutputWeights {
    return TonGptOutputWeights.fromCell(self.output);
}

fun tonGptTextComment(text: string): cell {
    return beginCell().storeUint(0, 32).storeSlice(text.beginParse()).endCell();
}

fun tonGptTextPayload(text: string): cell {
    return beginCell().storeSlice(text.beginParse()).endCell();
}

fun emptyTonGptHidden(): TonGptHidden {
    return TonGptHidden {
        h0: 0,
        h1: 0,
        h2: 0,
        h3: 0,
        h4: 0,
        h5: 0,
        h6: 0,
        h7: 0,
        h8: 0,
        h9: 0,
        h10: 0,
        h11: 0,
        h12: 0,
        h13: 0,
        h14: 0,
        h15: 0,
    };
}

fun clampTonGpt(value: int): int16 {
    return max(-1024, min(1024, value)) as int16;
}

fun addTonGptVector(hidden: TonGptHidden, vector: TonGptVector): TonGptHidden {
    return TonGptHidden {
        h0: clampTonGpt(hidden.h0 + vector.v0),
        h1: clampTonGpt(hidden.h1 + vector.v1),
        h2: clampTonGpt(hidden.h2 + vector.v2),
        h3: clampTonGpt(hidden.h3 + vector.v3),
        h4: clampTonGpt(hidden.h4 + vector.v4),
        h5: clampTonGpt(hidden.h5 + vector.v5),
        h6: clampTonGpt(hidden.h6 + vector.v6),
        h7: clampTonGpt(hidden.h7 + vector.v7),
        h8: clampTonGpt(hidden.h8 + vector.v8),
        h9: clampTonGpt(hidden.h9 + vector.v9),
        h10: clampTonGpt(hidden.h10 + vector.v10),
        h11: clampTonGpt(hidden.h11 + vector.v11),
        h12: clampTonGpt(hidden.h12 + vector.v12),
        h13: clampTonGpt(hidden.h13 + vector.v13),
        h14: clampTonGpt(hidden.h14 + vector.v14),
        h15: clampTonGpt(hidden.h15 + vector.v15),
    };
}

fun tonGptHeadScore(hidden: TonGptHidden, head: TonGptHead): int32 {
    return (
        hidden.h0 * head.w0 +
        hidden.h1 * head.w1 +
        hidden.h2 * head.w2 +
        hidden.h3 * head.w3 +
        hidden.h4 * head.w4 +
        hidden.h5 * head.w5 +
        hidden.h6 * head.w6 +
        hidden.h7 * head.w7 +
        hidden.h8 * head.w8 +
        hidden.h9 * head.w9 +
        hidden.h10 * head.w10 +
        hidden.h11 * head.w11 +
        hidden.h12 * head.w12 +
        hidden.h13 * head.w13 +
        hidden.h14 * head.w14 +
        hidden.h15 * head.w15 +
        head.bias
    ) as int32;
}

fun considerTonGptCandidate(
    tokenId: uint16,
    hidden: TonGptHidden,
    output: TonGptOutputWeights,
    best: TonGptBest,
): TonGptBest {
    val headLookup = output.heads.get(tokenId);
    if (!headLookup.isFound) {
        return best;
    }

    val score = tonGptHeadScore(hidden, headLookup.loadValue());
    if (!best.hasBest || score > best.score) {
        return TonGptBest { tokenId, score, hasBest: true };
    }

    return best;
}

fun considerTonGptHead(
    tokenId: uint16,
    hidden: TonGptHidden,
    head: TonGptHead,
    best: TonGptBest,
): TonGptBest {
    val score = tonGptHeadScore(hidden, head);
    if (!best.hasBest || score > best.score) {
        return TonGptBest { tokenId, score, hasBest: true };
    }

    return best;
}

fun tongptCandidateChunkSize(): uint16 {
    return 128;
}

fun tongptConsiderCandidateRange(
    hidden: TonGptHidden,
    output: TonGptOutputWeights,
    start: uint16,
    stop: uint16,
    best: TonGptBest,
): TonGptBest {
    var tokenId = start;
    var result = best;
    while (tokenId < stop) {
        result = considerTonGptCandidate(tokenId, hidden, output, result);
        tokenId += 1;
    }
    return result;
}
