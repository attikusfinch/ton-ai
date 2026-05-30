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
    expect(config.candidateCount).toEqual(132);
    expect(config.isPaused).toBeFalse();
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
    var sent = 0;
    var result = model.sendContinueTonGpt(user.address, jobId, { value: ton("0.08") });
    sent += 1;
    while (sent < steps) {
        result = model.sendContinueTonGpt(user.address, jobId, { value: ton("0.08") });
        sent += 1;
    }
    return result;
}
