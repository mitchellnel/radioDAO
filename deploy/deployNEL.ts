import { network } from "hardhat";

import { developmentChains } from "../helper-hardhat-config";

import * as dotenv from "dotenv";
import { verifyContract } from "../scripts/utils";
dotenv.config();

async function main({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // on live networks we need to wait 6 blocks for Etherscan to generate the bytecode
  const waitConfirmations = !developmentChains.includes(network.name) ? 6 : 1;

  log("Deploying Nelthereum contract ...");
  const nel = await deploy("Nelthereum", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: waitConfirmations, // wait 6 blocks so Etherscan has time to generate bytecode
  });

  log("... Done! Deployed Nelthereum contract at", nel.address);

  // verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying contract ...");
    await verifyContract(nel.address, []);
  }
}

export default main;
