import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"

import "@contracts/tongpt_types"
import "@contracts/tongpt_weights"
import "@wrappers/TonGpt.gen"

get fun `test tongpt deploy exposes trained model config`() {
    val (model, deployer, _) = setupTonGptTest();

    val config = model.config();
    expect(config.owner).toEqual(deployer.address);
    expect(config.nextJobId).toEqual(1);
    expect(config.maxContext).toEqual(80);
    expect(config.maxGenerate).toEqual(8);
    expect(config.eosToken).toEqual(0);
    expect(config.candidateCount).toEqual(244);
    expect(config.isPaused).toBeFalse();

    val status = model.modelStatus();
    expect(status.isReady).toBeTrue();
    expect(status.heads).toEqual(244);
    expect(status.tokenBytes).toEqual(243);
}

get fun `test tongpt empty deploy accepts output weight chunks`() {
    val deployer = testing.treasury("tongpt-empty-deployer");
    val model = TonGpt.fromStorage(emptyTonGptStorage(deployer.address, 80, 1, 0, 2));
    val deploy = model.deploy(deployer.address, { value: ton("0.2") });
    expect(deploy).toHaveSuccessfulDeploy({
        to: model.address,
    });

    expect(model.generate(tonGptTextComment("x")).hash()).toEqual(tonGptTextComment("?").hash());
    expect(model.modelStatus().isReady).toBeFalse();

    var heads: map<uint16, TonGptHead> = [];
    heads.set(0, testTonGptHead(0));
    heads.set(1, testTonGptHead(1));

    var tokenBytes: map<uint16, cell> = [];
    tokenBytes.set(1, tonGptTextPayload("ok"));

    val upload = model.sendUploadTonGptOutputChunk(
        deployer.address,
        [],
        heads,
        tokenBytes,
        { value: ton("0.1") },
    );
    expect(upload).toHaveSuccessfulTx({
        from: deployer.address,
        to: model.address,
    });
    val status = model.modelStatus();
    expect(status.isReady).toBeFalse();
    expect(status.heads).toEqual(2);
    expect(status.tokenBytes).toEqual(1);
    expect(model.generate(tonGptTextComment("x")).hash()).toEqual(tonGptTextComment("ok").hash());
}

get fun `test tongpt deploy seed changes contract address`() {
    val deployer = testing.treasury("tongpt-seeded-deployer");
    val seedZero = TonGpt.fromStorage(
        emptyTonGptStorageWithDeploySeed(
            deployer.address,
            80,
            1,
            0,
            2,
            0,
        ),
    );
    val seedOne = TonGpt.fromStorage(
        emptyTonGptStorageWithDeploySeed(
            deployer.address,
            80,
            1,
            0,
            2,
            1,
        ),
    );

    expect(seedZero.address == seedOne.address).toBeFalse();
}

get fun `test tongpt get method runs neural generation without cache`() {
    val (model, _, _) = setupTonGptTest();

    expect(model.generate(tonGptTextComment("Hello, how are you?")).hash()).toEqual(
        tonGptTextComment("Hi, I am Tolki. I feel good and I am running on-chain.").hash(),
    );
    expect(model.generate(tonGptTextComment("Do you use cache?")).hash()).toEqual(
        tonGptTextComment("I do not use a reply cache; the contract computes embeddings, logits, and a token.").hash(),
    );
    expect(model.generate(tonGptTextComment("Who are you?")).hash()).toEqual(
        tonGptTextComment("I am Tolki, a tiny TON model running inside a smart contract.").hash(),
    );
    expect(model.generate(tonGptTextComment("What is Telegram?")).hash()).toEqual(
        tonGptTextComment("Telegram is a messenger created by Pavel Durov and connected with the TON ecosystem.").hash(),
    );
}

get fun `test tongpt chunked logits stay under transaction gas`() {
    val (model, _, user) = setupTonGptTest();

    val prompt = tonGptTextComment("Hello, how are you?");
    val start = model.sendAny(user.address, prompt, { value: ton("0.2") });
    expect(start).toHaveSuccessfulTx({
        from: user.address,
        to: model.address,
        body: prompt,
    });

    val firstChunk = model.sendContinueTonGpt(user.address, 1, { value: ton("0.08") });
    expect(firstChunk).toHaveSuccessfulTx({
        from: user.address,
        to: model.address,
    });
    expect(firstChunk).toHaveSuccessfulTx({
        from: model.address,
        to: user.address,
        value: fun(value: coins): bool {
            return value > ton("0.01");
        },
    });

    val secondChunk = model.sendContinueTonGpt(user.address, 1, { value: ton("0.08") });
    expect(secondChunk).toHaveSuccessfulTx({
        from: user.address,
        to: model.address,
    });

    println("TONGPT 244 candidate first chunk gas={}", firstChunk.at(0).gasUsed);
    println("TONGPT 244 candidate token chunk gas={}", secondChunk.at(0).gasUsed);
}

get fun `test tongpt answers comments through trained weights`() {
    val (model, _, user) = setupTonGptTest();

    val hello = tonGptTextComment("Hello, how are you?");
    val startHello = model.sendAny(user.address, hello, { value: ton("0.2") });
    expect(startHello).toHaveSuccessfulTx({
        from: user.address,
        to: model.address,
        body: hello,
    });
    val helloRes = continueTonGptSteps(model, user, 1, 6);
    expect(helloRes).toHaveSuccessfulTx({
        from: model.address,
        to: user.address,
        body: tonGptTextComment("Hi, I am Tolki. I feel good and I am running on-chain."),
    });

    val tonPrompt = tonGptTextComment("What is TON?");
    val startTon = model.sendAny(user.address, tonPrompt, { value: ton("0.2") });
    expect(startTon).toHaveSuccessfulTx({
        from: user.address,
        to: model.address,
        body: tonPrompt,
    });
    val tonRes = continueTonGptSteps(model, user, 2, 8);
    expect(tonRes).toHaveSuccessfulTx({
        from: model.address,
        to: user.address,
        body: tonGptTextComment("TON, The Open Network, is a fast blockchain for payments, apps, and smart contracts."),
    });

    val tonConnectPrompt = tonGptTextComment("What is TON Connect?");
    val startTonConnect = model.sendAny(user.address, tonConnectPrompt, { value: ton("0.2") });
    expect(startTonConnect).toHaveSuccessfulTx({
        from: user.address,
        to: model.address,
        body: tonConnectPrompt,
    });
    val tonConnectRes = continueTonGptSteps(model, user, 3, 6);
    expect(tonConnectRes).toHaveSuccessfulTx({
        from: model.address,
        to: user.address,
        body: tonGptTextComment("TON Connect lets apps request wallet actions without seeing private keys."),
    });
}

get fun `test tongpt answers identity and fallback without known replies`() {
    val (model, _, user) = setupTonGptTest();

    val startCreator = model.sendAny(
        user.address,
        tonGptTextComment("Who created you?"),
        { value: ton("0.2") },
    );
    expect(startCreator).toHaveSuccessfulTx({
        from: user.address,
        to: model.address,
        body: tonGptTextComment("Who created you?"),
    });
    val creatorRes = continueTonGptSteps(
        model,
        user,
        1,
        5,
    );
    expect(creatorRes).toHaveSuccessfulTx({
        from: model.address,
        to: user.address,
        body: tonGptTextComment("I was created by User, also known as @fiscalforever."),
    });

    val startFallback = model.sendAny(
        user.address,
        tonGptTextComment("What is pizza?"),
        { value: ton("0.2") },
    );
    expect(startFallback).toHaveSuccessfulTx({
        from: user.address,
        to: model.address,
        body: tonGptTextComment("What is pizza?"),
    });
    val fallbackRes = continueTonGptSteps(
        model,
        user,
        2,
        7,
    );
    expect(fallbackRes).toHaveSuccessfulTx({
        from: model.address,
        to: user.address,
        body: tonGptTextComment("I am a small on-chain model, so I can't explain that topic yet. Sorry."),
    });
}

fun setupTonGptTest(): (TonGpt, Treasury, Treasury) {
    val deployer = testing.treasury("tongpt-deployer");
    val user = testing.treasury("tongpt-user");

    val model = TonGpt.fromStorage(defaultTonGptStorage(deployer.address));
    val deploy = model.deploy(deployer.address, { value: ton("1") });
    expect(deploy).toHaveSuccessfulDeploy({
        to: model.address,
    });

    return (model, deployer, user);
}

fun continueTonGptSteps(
    model: TonGpt,
    user: Treasury,
    jobId: uint32,
    steps: int,
): SendResultList {
    val totalSteps = steps * 2;
    var sent = 0;
    var result = model.sendContinueTonGpt(user.address, jobId, { value: ton("0.08") });
    sent += 1;
    while (sent < totalSteps) {
        result = model.sendContinueTonGpt(user.address, jobId, { value: ton("0.08") });
        sent += 1;
    }
    return result;
}

fun testTonGptHead(bias: int32): TonGptHead {
    return TonGptHead {
        w0: 0,
        w1: 0,
        w2: 0,
        w3: 0,
        w4: 0,
        w5: 0,
        w6: 0,
        w7: 0,
        w8: 0,
        w9: 0,
        w10: 0,
        w11: 0,
        w12: 0,
        w13: 0,
        w14: 0,
        w15: 0,
        bias,
    };
}
