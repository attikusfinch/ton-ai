enum Errors {
    NotOwner = 100
    Paused = 101
    InvalidToken = 102
    InvalidConfig = 103
    InvalidAmount = 104
    InvalidPrompt = 105
    InvalidMessage = 0xFFFF
}

struct Storage {
    owner: address
    modelVersion: uint32
    vocabSize: uint16
    maxContext: uint8
    maxGenerate: uint8
    tokenBytes: map<uint16, cell>
    transitions: map<uint16, TransitionRow>
    neuralState: Cell<NeuralState>
    knownReplies: map<uint256, cell>
    isPaused: bool
}

fun Storage.load(): Storage {
    return Storage.fromCell(contract.getData());
}

fun Storage.save(self) {
    contract.setData(self.toCell());
}

struct TransitionRow {
    nextToken: uint16
    score: int16
}

struct NeuralEmbedding {
    e0: int16
    e1: int16
    e2: int16
    e3: int16
}

struct NeuralHead {
    w0: int16
    w1: int16
    w2: int16
    w3: int16
    bias: int16
}

struct NeuralStep {
    inputW0: int16
    inputW1: int16
    inputW2: int16
    inputW3: int16
    recurrentW0: int16
    recurrentW1: int16
    recurrentW2: int16
    recurrentW3: int16
    bias0: int16
    bias1: int16
    bias2: int16
    bias3: int16
}

struct NeuralState {
    embeddings: map<uint16, NeuralEmbedding>
    step: NeuralStep
    heads: map<uint16, NeuralHead>
}

struct TinyLmConfig {
    owner: address
    modelVersion: uint32
    vocabSize: uint16
    maxContext: uint8
    maxGenerate: uint8
    isPaused: bool
}

struct TokenLookup {
    exists: bool
    tokenData: cell
}

struct TransitionLookup {
    exists: bool
    nextToken: uint16
    score: int16
}

struct NeuralEmbeddingLookup {
    exists: bool
    e0: int16
    e1: int16
    e2: int16
    e3: int16
}

struct NeuralHeadLookup {
    exists: bool
    w0: int16
    w1: int16
    w2: int16
    w3: int16
    bias: int16
}

type AllowedMessage =
    | SetModelMeta
    | SetToken
    | SetTransition
    | ClearTransition
    | SetKnownReply
    | ClearKnownReply
    | SetPaused
    | Withdraw

struct (0x4d455441) SetModelMeta {
    modelVersion: uint32
    vocabSize: uint16
    maxContext: uint8
    maxGenerate: uint8
}

struct (0x544f4b4e) SetToken {
    tokenId: uint16
    tokenData: cell
}

struct (0x5452414e) SetTransition {
    previousToken: uint16
    nextToken: uint16
    score: int16
}

struct (0x434c5254) ClearTransition {
    previousToken: uint16
}

struct (0x4b4e4f57) SetKnownReply {
    promptHash: uint256
    replyBody: cell
}

struct (0x434c524b) ClearKnownReply {
    promptHash: uint256
}

struct (0x50415553) SetPaused {
    isPaused: bool
}

struct (0x57495448) Withdraw {
    to: address
    amount: coins
}

fun promptHash(prompt: string): uint256 {
    return prompt.beginParse().hash();
}

fun textComment(text: string): cell {
    return beginCell().storeUint(0, 32).storeSlice(text.beginParse()).endCell();
}

fun textPayload(text: string): cell {
    return beginCell().storeSlice(text.beginParse()).endCell();
}

fun defaultTokenBytes(): map<uint16, cell> {
    var tokens: map<uint16, cell> = [];

    tokens.set(0, textPayload("?"));
    tokens.set(200, textPayload("I"));
    tokens.set(201, textPayload(" use"));
    tokens.set(202, textPayload(" tiny"));
    tokens.set(203, textPayload(" neural logits."));
    tokens.set(210, textPayload("I"));
    tokens.set(211, textPayload(" am"));
    tokens.set(212, textPayload(" fine"));
    tokens.set(213, textPayload(" on-chain."));

    return tokens;
}

fun defaultTransitions(): map<uint16, TransitionRow> {
    val transitions: map<uint16, TransitionRow> = [];

    return transitions;
}

fun defaultNeuralEmbeddings(): map<uint16, NeuralEmbedding> {
    var embeddings: map<uint16, NeuralEmbedding> = [];

    embeddings.set(
        0x3f,
        NeuralEmbedding {
            e0: 16,
            e1: 0,
            e2: 0,
            e3: 0,
        },
    );
    embeddings.set(
        200,
        NeuralEmbedding {
            e0: 0,
            e1: 0,
            e2: 64,
            e3: 0,
        },
    );
    embeddings.set(
        201,
        NeuralEmbedding {
            e0: 0,
            e1: 0,
            e2: 0,
            e3: 64,
        },
    );
    embeddings.set(
        202,
        NeuralEmbedding {
            e0: 64,
            e1: 64,
            e2: 0,
            e3: 0,
        },
    );
    embeddings.set(
        210,
        NeuralEmbedding {
            e0: 0,
            e1: 0,
            e2: 64,
            e3: 64,
        },
    );
    embeddings.set(
        211,
        NeuralEmbedding {
            e0: 64,
            e1: 0,
            e2: 0,
            e3: 64,
        },
    );
    embeddings.set(
        212,
        NeuralEmbedding {
            e0: 0,
            e1: 64,
            e2: 64,
            e3: 0,
        },
    );

    return embeddings;
}

fun defaultNeuralStep(): NeuralStep {
    return NeuralStep {
        inputW0: 16,
        inputW1: 16,
        inputW2: 16,
        inputW3: 16,
        recurrentW0: 16,
        recurrentW1: 16,
        recurrentW2: 16,
        recurrentW3: 16,
        bias0: 0,
        bias1: 0,
        bias2: 0,
        bias3: 0,
    };
}

fun defaultNeuralHeads(): map<uint16, NeuralHead> {
    var heads: map<uint16, NeuralHead> = [];

    heads.set(
        200,
        NeuralHead {
            w0: 80,
            w1: 0,
            w2: 0,
            w3: 0,
            bias: 0,
        },
    );
    heads.set(
        201,
        NeuralHead {
            w0: 0,
            w1: 0,
            w2: 50,
            w3: 0,
            bias: 0,
        },
    );
    heads.set(
        202,
        NeuralHead {
            w0: 0,
            w1: 0,
            w2: 0,
            w3: 50,
            bias: 0,
        },
    );
    heads.set(
        203,
        NeuralHead {
            w0: 45,
            w1: 45,
            w2: 0,
            w3: 0,
            bias: 0,
        },
    );
    heads.set(
        210,
        NeuralHead {
            w0: 0,
            w1: 80,
            w2: 0,
            w3: 0,
            bias: 0,
        },
    );
    heads.set(
        211,
        NeuralHead {
            w0: 0,
            w1: 0,
            w2: 45,
            w3: 45,
            bias: 0,
        },
    );
    heads.set(
        212,
        NeuralHead {
            w0: 45,
            w1: 0,
            w2: 0,
            w3: 45,
            bias: 0,
        },
    );
    heads.set(
        213,
        NeuralHead {
            w0: 0,
            w1: 45,
            w2: 45,
            w3: 0,
            bias: 0,
        },
    );

    return heads;
}

fun defaultNeuralState(): Cell<NeuralState> {
    return NeuralState {
        embeddings: defaultNeuralEmbeddings(),
        step: defaultNeuralStep(),
        heads: defaultNeuralHeads(),
    }.toCell();
}

fun defaultKnownReplies(): map<uint256, cell> {
    var replies: map<uint256, cell> = [];

    val name = textComment("I am Tolki.");
    replies.set(promptHash("What is your name?"), name);
    replies.set(promptHash("Who are you?"), name);

    val creator = textComment("I was created by User (@fiscalforever).");
    replies.set(promptHash("Who created you?"), creator);
    replies.set(promptHash("Who is your creator?"), creator);
    replies.set(promptHash("Who made you?"), creator);

    val identity = textComment("I am Tolki, a tiny AI living in a TON smart contract.");
    replies.set(promptHash("What are you?"), identity);
    replies.set(promptHash("What can you do?"), identity);

    val work = textComment("I read TON transaction comments, check on-chain knowledge, and reply with comments.");
    replies.set(promptHash("How do you work?"), work);
    replies.set(promptHash("Are you really on-chain?"), work);

    val ton = textComment("TON is The Open Network, a scalable L1 blockchain for apps, payments, and smart contracts.");
    replies.set(promptHash("What is TON?"), ton);
    replies.set(promptHash("What is The Open Network?"), ton);

    val telegram = textComment("Telegram is a cloud-based messaging app focused on speed and security.");
    replies.set(promptHash("What is Telegram?"), telegram);

    val telegramTon = textComment("Telegram gives TON apps a human-friendly place to reach users through chats and wallets.");
    replies.set(promptHash("How is Telegram related to TON?"), telegramTon);

    val train = textComment("My owner can add knowledge by storing prompt hashes and reply comments on-chain.");
    replies.set(promptHash("Can I add new knowledge?"), train);
    replies.set(promptHash("How do I train you?"), train);

    val unknown = textComment("If I do not know an answer, I run a tiny on-chain recurrent model.");
    replies.set(promptHash("What happens if you do not know the answer?"), unknown);

    return replies;
}
