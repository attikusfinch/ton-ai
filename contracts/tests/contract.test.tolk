import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"

import "@contracts/types"
import "@wrappers/TinyLm.gen"

get fun `test deploy exposes initial config`() {
    val (contract, deployer, _) = setupTest();

    val config = contract.config();
    expect(config.owner).toEqual(deployer.address);
    expect(config.modelVersion).toEqual(1);
    expect(config.vocabSize).toEqual(256);
    expect(config.maxContext).toEqual(64);
    expect(config.maxGenerate).toEqual(8);
    expect(config.isPaused).toBeFalse();
}

get fun `test owner can update model metadata`() {
    val (contract, deployer, _) = setupTest();

    val res = contract.sendSetModelMeta(
        deployer.address,
        2,
        128,
        1,
        12,
        { value: ton("0.05") },
    );
    expect(res).toHaveSuccessfulTx<SetModelMeta>({
        from: deployer.address,
        to: contract.address,
    });

    val config = contract.config();
    expect(config.modelVersion).toEqual(2);
    expect(config.vocabSize).toEqual(128);
    expect(config.maxGenerate).toEqual(12);
}

get fun `test non-owner cannot update model metadata`() {
    val (contract, _, notDeployer) = setupTest();

    val res = contract.sendSetModelMeta(
        notDeployer.address,
        2,
        128,
        1,
        12,
        { value: ton("0.05") },
    );
    expect(res).toHaveFailedTx<SetModelMeta>({
        from: notDeployer.address,
        to: contract.address,
        exitCode: Errors.NotOwner,
    });

    expect(contract.config().modelVersion).toEqual(1);
}

get fun `test owner can set tokens and transition`() {
    val (contract, deployer, _) = setupTest();

    val tokenRes = contract.sendSetToken(
        deployer.address,
        98,
        oneByteCell(0x62),
        { value: ton("0.05") },
    );
    expect(tokenRes).toHaveSuccessfulTx<SetToken>({
        from: deployer.address,
        to: contract.address,
    });

    val transitionRes = contract.sendSetTransition(
        deployer.address,
        97,
        98,
        100,
        { value: ton("0.05") },
    );
    expect(transitionRes).toHaveSuccessfulTx<SetTransition>({
        from: deployer.address,
        to: contract.address,
    });

    val token = contract.token(98);
    expect(token.exists).toBeTrue();
    expect(token.tokenData.hash()).toEqual(oneByteCell(0x62).hash());

    val transition = contract.transition(97);
    expect(transition.exists).toBeTrue();
    expect(transition.nextToken).toEqual(98);
    expect(transition.score).toEqual(100);
    expect(contract.predictNext(97)).toEqual(98);
}

get fun `test unknown transition falls back to token zero`() {
    val (contract, _, _) = setupTest();
    expect(contract.predictNext(120)).toEqual(0);
}

get fun `test prompt comment produces reply comment transaction`() {
    val (contract, deployer, user) = setupTest();

    contract.sendSetToken(deployer.address, 98, oneByteCell(0x62), { value: ton("0.05") });
    contract.sendSetTransition(deployer.address, 97, 98, 100, { value: ton("0.05") });

    val res = contract.sendAny(user.address, textCommentBody(0x61), { value: ton("0.2") });
    expect(res).toHaveSuccessfulTx({
        from: user.address,
        to: contract.address,
        body: textCommentBody(0x61),
    });
    expect(res).toHaveSuccessfulTx({
        from: contract.address,
        to: user.address,
        body: textCommentBody(0x62),
    });
}

get fun `test phrase prompt hello how are you replies canned phrase`() {
    val (contract, deployer, user) = setupTest();

    contract.sendSetToken(deployer.address, 1, imFinePayload(), { value: ton("0.05") });
    contract.sendSetTransition(deployer.address, 0x3f, 1, 100, { value: ton("0.05") });

    val res = contract.sendAny(user.address, helloHowAreYouBody(), { value: ton("0.2") });
    expect(res).toHaveSuccessfulTx({
        from: user.address,
        to: contract.address,
        body: helloHowAreYouBody(),
    });
    expect(res).toHaveSuccessfulTx({
        from: contract.address,
        to: user.address,
        body: imFineReplyBody(),
    });
}

get fun `test default TinyNN scorer picks neural tokens`() {
    val (contract, _, _) = setupTest();

    expect(contract.neuralPredictNext(0x3f)).toEqual(200);
    expect(contract.neuralPredictNext(200)).toEqual(201);
    expect(contract.neuralPredictNext(201)).toEqual(202);
    expect(contract.neuralPredictNext(202)).toEqual(203);
    expect(contract.neuralPredictNext(203)).toEqual(0);
}

get fun `test unknown question uses default TinyNN logits`() {
    val (contract, _, user) = setupTest();

    val res = contract.sendAny(
        user.address,
        textComment("What can you really infer?"),
        { value: ton("0.2") },
    );
    expect(res).toHaveSuccessfulTx({
        from: contract.address,
        to: user.address,
        body: textComment("I use tiny neural logits."),
    });
}

get fun `test hello question uses prompt encoder greeting logits`() {
    val (contract, _, user) = setupTest();

    val res = contract.sendAny(user.address, helloHowAreYouBody(), { value: ton("0.2") });
    expect(res).toHaveSuccessfulTx({
        from: contract.address,
        to: user.address,
        body: textComment("I am fine on-chain."),
    });
}

get fun `test default knowledge answers identity questions`() {
    val (contract, _, user) = setupTest();

    val nameRes = contract.sendAny(
        user.address,
        textComment("What is your name?"),
        { value: ton("0.2") },
    );
    expect(nameRes).toHaveSuccessfulTx({
        from: contract.address,
        to: user.address,
        body: textComment("I am Tolki."),
    });

    val creatorRes = contract.sendAny(
        user.address,
        textComment("Who created you?"),
        { value: ton("0.2") },
    );
    expect(creatorRes).toHaveSuccessfulTx({
        from: contract.address,
        to: user.address,
        body: textComment("I was created by User (@fiscalforever)."),
    });
}

get fun `test default knowledge answers ton and telegram questions`() {
    val (contract, _, user) = setupTest();

    val tonRes = contract.sendAny(user.address, textComment("What is TON?"), { value: ton("0.2") });
    expect(tonRes).toHaveSuccessfulTx({
        from: contract.address,
        to: user.address,
        body: textComment("TON is The Open Network, a scalable L1 blockchain for apps, payments, and smart contracts."),
    });

    val telegramRes = contract.sendAny(
        user.address,
        textComment("What is Telegram?"),
        { value: ton("0.2") },
    );
    expect(telegramRes).toHaveSuccessfulTx({
        from: contract.address,
        to: user.address,
        body: textComment("Telegram is a cloud-based messaging app focused on speed and security."),
    });
}

get fun `test known reply is extended by TinyLM generated tail`() {
    val (contract, deployer, user) = setupTest();

    contract.sendSetToken(
        deployer.address,
        2,
        textPayload(" Built on-chain."),
        { value: ton("0.05") },
    );
    contract.sendSetTransition(deployer.address, 0x2e, 2, 100, { value: ton("0.05") });

    val res = contract.sendAny(
        user.address,
        textComment("What is your name?"),
        { value: ton("0.2") },
    );
    expect(res).toHaveSuccessfulTx({
        from: contract.address,
        to: user.address,
        body: textComment("I am Tolki. Built on-chain."),
    });
}

get fun `test owner can add and clear known reply`() {
    val (contract, deployer, user) = setupTest();

    val prompt = textComment("What is your favorite chain?");
    val reply = textComment("TON, obviously.");
    val promptHashValue = promptHashFromBody(prompt);

    val setRes = contract.sendSetKnownReply(
        deployer.address,
        promptHashValue,
        reply,
        { value: ton("0.05") },
    );
    expect(setRes).toHaveSuccessfulTx<SetKnownReply>({
        from: deployer.address,
        to: contract.address,
    });

    val promptRes = contract.sendAny(user.address, prompt, { value: ton("0.2") });
    expect(promptRes).toHaveSuccessfulTx({
        from: contract.address,
        to: user.address,
        body: reply,
    });

    val clearRes = contract.sendClearKnownReply(
        deployer.address,
        promptHashValue,
        { value: ton("0.05") },
    );
    expect(clearRes).toHaveSuccessfulTx<ClearKnownReply>({
        from: deployer.address,
        to: contract.address,
    });
}

get fun `test paused contract rejects prompt comments`() {
    val (contract, deployer, user) = setupTest();

    contract.sendSetPaused(deployer.address, true, { value: ton("0.05") });

    val res = contract.sendAny(user.address, textCommentBody(0x61), { value: ton("0.2") });
    expect(res).toHaveFailedTx({
        from: user.address,
        to: contract.address,
        exitCode: Errors.Paused,
    });
}

get fun `test invalid token id fails`() {
    val (contract, deployer, _) = setupTest();

    val res = contract.sendSetTransition(
        deployer.address,
        255,
        256,
        1,
        { value: ton("0.05") },
    );
    expect(res).toHaveFailedTx<SetTransition>({
        from: deployer.address,
        to: contract.address,
        exitCode: Errors.InvalidToken,
    });
}

get fun `test unknown message fails with named error`() {
    val (contract, deployer, _) = setupTest();

    val res = contract.sendAny(
        deployer.address,
        beginCell().storeUint(0x999, 32).endCell(),
        { value: ton("0.05") },
    );
    expect(res).toHaveFailedTx({
        from: deployer.address,
        to: contract.address,
        exitCode: Errors.InvalidMessage,
    });

    val res2 = contract.sendAny(deployer.address, createEmptyCell(), { value: ton("0.05") });
    expect(res2).toHaveSuccessfulTx({
        from: deployer.address,
        to: contract.address,
    });
}

fun setupTest(): (TinyLm, Treasury, Treasury) {
    val deployer = testing.treasury("deployer");
    val user = testing.treasury("user");

    val contract = TinyLm.fromStorage(initialStorage(deployer.address));
    val res = contract.deploy(deployer.address, { value: ton("0.5") });
    expect(res).toHaveSuccessfulDeploy({
        to: contract.address,
    });

    return (contract, deployer, user);
}

fun initialStorage(owner: address): Storage {
    return Storage {
        owner,
        modelVersion: 1,
        vocabSize: 256,
        maxContext: 64,
        maxGenerate: 8,
        tokenBytes: defaultTokenBytes(),
        transitions: defaultTransitions(),
        neuralState: defaultNeuralState(),
        knownReplies: defaultKnownReplies(),
        isPaused: false,
    };
}

fun oneByteCell(byteValue: uint8): cell {
    return beginCell().storeUint(byteValue, 8).endCell();
}

fun textCommentBody(byteValue: uint8): cell {
    return beginCell().storeUint(0, 32).storeUint(byteValue, 8).endCell();
}

fun helloHowAreYouBody(): cell {
    return beginCell()
        .storeUint(0, 32)
        .storeUint(0x48, 8)
        .storeUint(0x65, 8)
        .storeUint(0x6c, 8)
        .storeUint(0x6c, 8)
        .storeUint(0x6f, 8)
        .storeUint(0x2c, 8)
        .storeUint(0x20, 8)
        .storeUint(0x68, 8)
        .storeUint(0x6f, 8)
        .storeUint(0x77, 8)
        .storeUint(0x20, 8)
        .storeUint(0x61, 8)
        .storeUint(0x72, 8)
        .storeUint(0x65, 8)
        .storeUint(0x20, 8)
        .storeUint(0x79, 8)
        .storeUint(0x6f, 8)
        .storeUint(0x75, 8)
        .storeUint(0x3f, 8)
        .endCell();
}

fun imFinePayload(): cell {
    return beginCell()
        .storeUint(0x49, 8)
        .storeUint(0x27, 8)
        .storeUint(0x6d, 8)
        .storeUint(0x20, 8)
        .storeUint(0x66, 8)
        .storeUint(0x69, 8)
        .storeUint(0x6e, 8)
        .storeUint(0x65, 8)
        .storeUint(0x2e, 8)
        .endCell();
}

fun imFineReplyBody(): cell {
    return beginCell().storeUint(0, 32).storeSlice(imFinePayload().beginParse()).endCell();
}

fun promptHashFromBody(body: cell): uint256 {
    var prompt = body.beginParse();
    prompt.skipBits(32);
    return prompt.hash();
}
