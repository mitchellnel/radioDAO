import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { constants } from "ethers";

const setupGovernanceContracts: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  // @ts-ignore
  const { getNamedAccounts, deployments } = hre;
  const { log } = deployments;
  const { deployer } = await getNamedAccounts();

  const timelock = await ethers.getContract("RadioTimelock");
  const dao = await ethers.getContract("RadioDAO");

  log("--------------------------------------------------");
  log("\nSetting up contracts for roles ...");
  // could also use ethereum-multicall here
  const proposerRole = await timelock.PROPOSER_ROLE();
  const executorRole = await timelock.EXECUTOR_ROLE();
  const adminRole = await timelock.TIMELOCK_ADMIN_ROLE();

  const grantProposerTxn = await timelock.grantRole(proposerRole, dao.address);
  await grantProposerTxn.wait(1);

  const grantExecutorTxn = await timelock.grantRole(
    executorRole,
    constants.AddressZero
  );
  await grantExecutorTxn.wait(1);

  const revokeAdminTxn = await timelock.revokeRole(adminRole, deployer);
  await revokeAdminTxn.wait(1);
  log(
    "... Done! Now the DAO is the sole proposer of things that the RadioTimelock can do"
  );

  log("--------------------------------------------------");
};

export default setupGovernanceContracts;
setupGovernanceContracts.tags = ["all", "governance", "setup"];
