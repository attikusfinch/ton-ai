enum CraftProbeErrors {
    InvalidMessage = 0xFFFE
}

struct CraftProbeStorage {
    owner: address
    lastScore: int32
}

struct CraftProbeConfig {
    owner: address
    lastScore: int32
    fullTokenWeightedContribs: uint32
}

type CraftProbeMessage = RunCraftProbe

struct (0x43505242) RunCraftProbe {
    weightedContribs: uint32
}

contract CraftGptMonoProbe {
    author: "Acton User"
    version: "0.1.0"
    description: "Single-contract CraftGPT compute-limit probe"
    storage: CraftProbeStorage
    incomingMessages: CraftProbeMessage
}

fun CraftProbeStorage.load(): CraftProbeStorage {
    return CraftProbeStorage.fromCell(contract.getData());
}

fun CraftProbeStorage.save(self) {
    contract.setData(self.toCell());
}

fun craftGptOneTokenWeightedContribs(): uint32 {
    // 6 * (QKV + attention projection + MLP up/down) + lm_head.
    // This excludes layernorm, softmax, cache movement, tokenizer and sampling.
    return 4608000;
}

fun craftGptWeightedLoop(weightedContribs: uint32): int32 {
    var i: uint32 = 0;
    var acc = 0;

    while (i < weightedContribs) {
        val x = (((i as int) * 31 + 7) % 257) - 128;
        val w = (((i as int) * 17 + 3) % 257) - 128;
        acc = (acc + x * w + ((acc % 97) * 3)) % 16777216;
        i += 1;
    }

    return acc as int32;
}

fun onInternalMessage(in: InMessage) {
    val msg = lazy CraftProbeMessage.fromSlice(in.body);

    match (msg) {
        RunCraftProbe => {
            var storage = lazy CraftProbeStorage.load();
            storage.lastScore = craftGptWeightedLoop(msg.weightedContribs);
            storage.save();
        }
        else => {
            assert (in.body.isEmpty()) throw CraftProbeErrors.InvalidMessage;
        }
    }
}

fun onBouncedMessage(_in: InMessageBounced) {}

get fun config(): CraftProbeConfig {
    val storage = lazy CraftProbeStorage.load();
    return CraftProbeConfig {
        owner: storage.owner,
        lastScore: storage.lastScore,
        fullTokenWeightedContribs: craftGptOneTokenWeightedContribs(),
    };
}

get fun estimate(weightedContribs: uint32): int32 {
    return craftGptWeightedLoop(weightedContribs);
}
