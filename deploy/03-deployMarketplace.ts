import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

import { developmentChains } from "../helper-hardhat-config";
import { verifyContract } from "../scripts/utils";

const toWei = (num: Number) => ethers.utils.parseEther(num.toString());

const deployMarketplace: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // on live networks we need to wait 6 blocks for Etherscan to generate the bytecode
  const waitConfirmations = !developmentChains.includes(network.name) ? 6 : 1;

  const nel = await deployments.get("Nelthereum");
  const rdioNFT = await deployments.get("RadioDAONFT");
  const initialMarketplaceFee = toWei(0.5);

  const deployArgs = [nel.address, rdioNFT.address, initialMarketplaceFee];

  log("Deploying RadioDAOMarketplace contract ...");
  const rdioMarketplace = await deploy("RadioDAOMarketplace", {
    from: deployer,
    args: deployArgs,
    log: true,
    waitConfirmations: waitConfirmations, // wait 6 blocks so Etherscan has time to generate bytecode
  });

  log("... Done! Deployed Nelthereum contract at", rdioMarketplace.address);

  // verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying contract ...");
    await verifyContract(rdioMarketplace.address, []);
  }
};

export default deployMarketplace;
deployMarketplace.tags = ["all", "marketplace"];
