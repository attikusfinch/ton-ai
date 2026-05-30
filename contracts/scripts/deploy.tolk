import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"

import "@contracts/types"
import "@wrappers/TinyLm.gen"

fun main() {
    val deployer = scripts.wallet("deployer");

    val contract = TinyLm.fromStorage({
        owner: deployer.address,
        modelVersion: 1,
        vocabSize: 256,
        maxContext: 64,
        maxGenerate: 8,
        tokenBytes: defaultTokenBytes(),
        transitions: defaultTransitions(),
        neuralState: defaultNeuralState(),
        knownReplies: defaultKnownReplies(),
        isPaused: false,
    });
    val res = contract.deploy(deployer.address, { value: ton("0.5") });
    if (res.waitForFirstTransaction() == null) {
        return;
    }

    println("Deployed TinyLM contract to {}", contract.address);
    println("Owner is {}", contract.owner());
}
