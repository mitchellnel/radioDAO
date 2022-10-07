import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

import { developmentChains } from "../helper-hardhat-config";
import { verifyContract } from "../scripts/utils";

const deployRadio: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const CONTRACT_TO_DEPLOY_NAME = "Radio";

  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // on live networks we need to wait 6 blocks for Etherscan to generate the bytecode
  const waitConfirmations = !developmentChains.includes(network.name) ? 6 : 1;

  log("--------------------------------------------------");
  log(`\nDeploying ${CONTRACT_TO_DEPLOY_NAME} contract ...`);
  const radio = await deploy(CONTRACT_TO_DEPLOY_NAME, {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: waitConfirmations, // wait 6 blocks so Etherscan has time to generate bytecode
  });

  log(
    `... Done! Deployed ${CONTRACT_TO_DEPLOY_NAME} contract at ${radio.address}\n`
  );

  // verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log(`\nVerifying ${CONTRACT_TO_DEPLOY_NAME} contract ...`);
    await verifyContract(radio.address, []);
  }

  log("\nGiving ownership of the Radio to the RadioTimeLock ...");
  const radioContract = await ethers.getContract("Radio");
  const timelockContract = await ethers.getContract("RadioTimeLock");

  const transferOwnershipTxn = await radioContract.transferOwnership(
    timelockContract.address
  );
  await transferOwnershipTxn.wait(1);
  log("... Done! The RadioTimeLock is now the owner of the Radio contract");

  log("--------------------------------------------------");
};

export default deployRadio;
deployRadio.tags = ["all", "governance", "radio"];
