import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import { developmentChains } from "../helper-hardhat-config";
import { verifyContract } from "../scripts/utils";

const deployRadioTimelock: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const CONTRACT_TO_DEPLOY_NAME = "RadioTimelock";

  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // on live networks we need to wait 6 blocks for Etherscan to generate the bytecode
  const waitConfirmations = !developmentChains.includes(network.name) ? 6 : 1;

  const deployArgs = [[], [], deployer];

  log("--------------------------------------------------");
  log(`\nDeploying ${CONTRACT_TO_DEPLOY_NAME} contract ...`);
  const timelock = await deploy(CONTRACT_TO_DEPLOY_NAME, {
    from: deployer,
    args: deployArgs,
    log: true,
    waitConfirmations: waitConfirmations, // wait 6 blocks so Etherscan has time to generate bytecode
  });

  log(
    `... Done! Deployed ${CONTRACT_TO_DEPLOY_NAME} contract at ${timelock.address}\n`
  );

  // verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log(`\nVerifying ${CONTRACT_TO_DEPLOY_NAME} contract ...`);
    await verifyContract(timelock.address, []);
  }

  log("--------------------------------------------------");
};

export default deployRadioTimelock;
deployRadioTimelock.tags = ["all", "governance", "timelock"];
