import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import { developmentChains } from "../helper-hardhat-config";
import { verifyContract } from "../scripts/utils";

const deployRadioDAO: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const CONTRACT_TO_DEPLOY_NAME = "RadioDAO";

  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // on live networks we need to wait 6 blocks for Etherscan to generate the bytecode
  const waitConfirmations = !developmentChains.includes(network.name) ? 6 : 1;

  const rdioNFT = await deployments.get("RadioDAONFT");
  const timelock = await deployments.get("RadioTimelock");

  const deployArgs = [rdioNFT.address, timelock.address];

  log("--------------------------------------------------");
  log(`\nDeploying ${CONTRACT_TO_DEPLOY_NAME} contract ...`);
  const dao = await deploy(CONTRACT_TO_DEPLOY_NAME, {
    from: deployer,
    args: deployArgs,
    log: true,
    waitConfirmations: waitConfirmations, // wait 6 blocks so Etherscan has time to generate bytecode
  });

  log(
    `... Done! Deployed ${CONTRACT_TO_DEPLOY_NAME} contract at ${dao.address}\n`
  );

  // verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log(`\nVerifying ${CONTRACT_TO_DEPLOY_NAME} contract ...`);
    await verifyContract(dao.address, deployArgs);
  }

  log("--------------------------------------------------");
};

export default deployRadioDAO;
deployRadioDAO.tags = ["all", "governance", "dao"];
