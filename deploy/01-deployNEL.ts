import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import { developmentChains } from "../helper-hardhat-config";
import { verifyContract } from "../scripts/utils";

const deployNelthereum: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const CONTRACT_TO_DEPLOY_NAME = "Nelthereum";

  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // on live networks we need to wait 6 blocks for Etherscan to generate the bytecode
  const waitConfirmations = !developmentChains.includes(network.name) ? 6 : 1;

  log("--------------------------------------------------");
  log(`\nDeploying ${CONTRACT_TO_DEPLOY_NAME} contract ...`);
  const nel = await deploy(CONTRACT_TO_DEPLOY_NAME, {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: waitConfirmations, // wait 6 blocks so Etherscan has time to generate bytecode
  });

  log(
    `... Done! Deployed ${CONTRACT_TO_DEPLOY_NAME} contract at ${nel.address}\n`
  );

  // verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log(`\nVerifying ${CONTRACT_TO_DEPLOY_NAME} contract ...`);
    await verifyContract(nel.address, []);
  }

  log("--------------------------------------------------");
};

export default deployNelthereum;
deployNelthereum.tags = ["all", "marketplace", "nel"];
