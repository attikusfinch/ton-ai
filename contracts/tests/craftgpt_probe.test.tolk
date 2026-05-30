import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/io"
import "@acton/testing/expect"

import "@contracts/CraftGptMonoProbe"
import "@wrappers/CraftGptMonoProbe.gen"

get fun `test craftgpt mono probe shows full token step exceeds transaction gas`() {
    val (probe, deployer, user) = setupCraftProbeTest();

    val small = probe.sendRunCraftProbe(user.address, 1000, { value: ton("0.2") });
    expect(small).toHaveSuccessfulTx<RunCraftProbe>({
        from: user.address,
        to: probe.address,
    });
    println("CraftGPT mono probe: 1000 weighted contribs gas={}", small.at(0).gasUsed);

    val fullContribs = probe.config().fullTokenWeightedContribs;
    expect(fullContribs).toEqual(4608000);

    val full = probe.sendRunCraftProbe(user.address, fullContribs, { value: ton("10") });
    println("CraftGPT mono probe: full one-token lower-bound gas={}", full.at(0).gasUsed);
    expect(full).toHaveFailedTx<RunCraftProbe>({
        from: user.address,
        to: probe.address,
        exitCode: -14,
    });

    val config = probe.config();
    expect(config.owner).toEqual(deployer.address);
}

fun setupCraftProbeTest(): (CraftGptMonoProbe, Treasury, Treasury) {
    val deployer = testing.treasury("craft-probe-deployer");
    val user = testing.treasury("craft-probe-user");

    val probe = CraftGptMonoProbe.fromStorage(
        CraftProbeStorage {
            owner: deployer.address,
            lastScore: 0,
        },
    );
    val deploy = probe.deploy(deployer.address, { value: ton("0.5") });
    expect(deploy).toHaveSuccessfulDeploy({
        to: probe.address,
    });

    return (probe, deployer, user);
}
