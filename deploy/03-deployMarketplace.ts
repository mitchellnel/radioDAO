import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

import { developmentChains } from "../helper-hardhat-config";
import { verifyContract } from "../scripts/utils";
import { BigNumber } from "ethers";

const toWei = (num: Number) => ethers.utils.parseEther(num.toString());

const deployMarketplace: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const CONTRACT_TO_DEPLOY_NAME = "RadioDAOMarketplace";

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

  log("--------------------------------------------------");
  log(`\nDeploying ${CONTRACT_TO_DEPLOY_NAME} contract ...`);
  const rdioMarketplace = await deploy(CONTRACT_TO_DEPLOY_NAME, {
    from: deployer,
    args: deployArgs,
    log: true,
    waitConfirmations: waitConfirmations, // wait 6 blocks so Etherscan has time to generate bytecode
  });

  log(
    `... Done! Deployed ${CONTRACT_TO_DEPLOY_NAME} contract at ${rdioMarketplace.address}\n`
  );

  const nelContract = await ethers.getContract("Nelthereum");
  const rdioNFTContract = await ethers.getContract("RadioDAONFT");
  const rdioMarketplaceContract = await ethers.getContract(
    "RadioDAOMarketplace"
  );

  const MAX_TOKENS = await rdioNFTContract.getMaxTokens();

  log(`\nListing ${MAX_TOKENS} RadioDAONFTs on the RadioDAOMarketplace`);

  const initialSellPrice = toWei(1);

  // approve all NEL marketplace fee transfers
  const approveNELTxn = await nelContract.approve(
    rdioMarketplace.address,
    BigNumber.from(initialMarketplaceFee).mul(MAX_TOKENS)
  );
  await approveNELTxn.wait(1);

  for (let i = 3; i < MAX_TOKENS; i++) {
    log(`\tListing token ${i} ...`);

    // approve NFT transfer
    const approveNFTTxn = await rdioNFTContract.approve(
      rdioMarketplace.address,
      i
    );
    await approveNFTTxn.wait(1);

    // make the sale
    const sellTxn = await rdioMarketplaceContract.sellNFT(i, initialSellPrice);
    await sellTxn.wait(1);
    log("\t... Done!");
  }

  log(
    `\n... Done! Successfully listed all ${MAX_TOKENS} RadioDAONFTs on the RadioDAOMarketplace`
  );

  // verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log(`\nVerifying ${CONTRACT_TO_DEPLOY_NAME} contract ...`);
    await verifyContract(rdioMarketplace.address, deployArgs);
  }

  log("--------------------------------------------------");
};

export default deployMarketplace;
deployMarketplace.tags = ["all", "marketplace", "onlyMarketplace"];
