import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"

import "@contracts/sharded_types"
import "@wrappers/ShardedLmCoordinator.gen"
import "@wrappers/VocabShard.gen"

get fun `test sharded coordinator wires child contracts`() {
    val (
        coordinator,
        shard0,
        shard1,
        shard2,
        shard3,
        _,
        _,
    ) = setupShardedTest();

    val config = coordinator.config();
    expect(config.shard0).toEqual(shard0.address);
    expect(config.shard1).toEqual(shard1.address);
    expect(config.shard2).toEqual(shard2.address);
    expect(config.shard3).toEqual(shard3.address);
    expect(config.nextJobId).toEqual(1);
    expect(config.maxContext).toEqual(64);
    expect(config.maxGenerate).toEqual(4);
}

get fun `test vocab shard scores local candidates`() {
    val (
        _,
        shard0,
        _,
        _,
        _,
        _,
        _,
    ) = setupShardedTest();

    val whatScore = shard0.score(ShardedHidden {
        h0: 160,
        h1: 0,
        h2: 0,
        h3: 16,
    });
    expect(whatScore.tokenId).toEqual(100);

    val helloScore = shard0.score(ShardedHidden {
        h0: 0,
        h1: 240,
        h2: 0,
        h3: 16,
    });
    expect(helloScore.tokenId).toEqual(110);
}

get fun `test sharded inference answers infer question through child logits`() {
    val (
        coordinator,
        shard0,
        shard1,
        shard2,
        shard3,
        _,
        user,
    ) = setupShardedTest();

    val prompt = shardedTextComment("What cloud color is?");
    val res = coordinator.sendAny(user.address, prompt, { value: ton("1") });

    expect(res).toHaveSuccessfulTx({
        from: user.address,
        to: coordinator.address,
        body: prompt,
    });
    expect(res).toHaveSuccessfulTx({
        from: coordinator.address,
        to: shard0.address,
    });
    expect(res).toHaveSuccessfulTx({
        from: coordinator.address,
        to: shard1.address,
    });
    expect(res).toHaveSuccessfulTx({
        from: coordinator.address,
        to: shard2.address,
    });
    expect(res).toHaveSuccessfulTx({
        from: coordinator.address,
        to: shard3.address,
    });
    expect(res).toHaveSuccessfulTx({
        from: coordinator.address,
        to: user.address,
        body: shardedTextComment("I use sharded TON."),
    });
}

get fun `test sharded inference answers hello through child logits`() {
    val (
        coordinator,
        _,
        _,
        _,
        _,
        _,
        user,
    ) = setupShardedTest();

    val prompt = shardedTextComment("Hello, how are you?");
    val res = coordinator.sendAny(user.address, prompt, { value: ton("1") });

    expect(res).toHaveSuccessfulTx({
        from: coordinator.address,
        to: user.address,
        body: shardedTextComment("I am fine on-chain."),
    });
}

fun setupShardedTest(): (
    ShardedLmCoordinator,
    VocabShard,
    VocabShard,
    VocabShard,
    VocabShard,
    Treasury,
    Treasury,
) {
    val deployer = testing.treasury("sharded-deployer");
    val user = testing.treasury("sharded-user");

    val coordinator = ShardedLmCoordinator.fromStorage(defaultCoordinatorStorage(deployer.address));
    val deployCoordinator = coordinator.deploy(deployer.address, { value: ton("0.5") });
    expect(deployCoordinator).toHaveSuccessfulDeploy({
        to: coordinator.address,
    });

    val shard0 = VocabShard.fromStorage(
        defaultVocabShardStorage(deployer.address, coordinator.address, 0),
    );
    val shard1 = VocabShard.fromStorage(
        defaultVocabShardStorage(deployer.address, coordinator.address, 1),
    );
    val shard2 = VocabShard.fromStorage(
        defaultVocabShardStorage(deployer.address, coordinator.address, 2),
    );
    val shard3 = VocabShard.fromStorage(
        defaultVocabShardStorage(deployer.address, coordinator.address, 3),
    );

    expect(shard0.deploy(deployer.address, { value: ton("0.2") })).toHaveSuccessfulDeploy({
        to: shard0.address,
    });
    expect(shard1.deploy(deployer.address, { value: ton("0.2") })).toHaveSuccessfulDeploy({
        to: shard1.address,
    });
    expect(shard2.deploy(deployer.address, { value: ton("0.2") })).toHaveSuccessfulDeploy({
        to: shard2.address,
    });
    expect(shard3.deploy(deployer.address, { value: ton("0.2") })).toHaveSuccessfulDeploy({
        to: shard3.address,
    });

    val setShards = coordinator.sendSetShards(
        deployer.address,
        CoordinatorShards {
            first: CoordinatorShardPair {
                shard0: shard0.address,
                shard1: shard1.address,
            }.toCell(),
            second: CoordinatorShardPair {
                shard0: shard2.address,
                shard1: shard3.address,
            }.toCell(),
        },
        { value: ton("0.05") },
    );
    expect(setShards).toHaveSuccessfulTx<SetShards>({
        from: deployer.address,
        to: coordinator.address,
    });

    return (
        coordinator,
        shard0,
        shard1,
        shard2,
        shard3,
        deployer,
        user,
    );
}
