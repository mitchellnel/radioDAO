import { network, ethers } from "hardhat";

import * as path from "path";

import { developmentChains } from "../helper-hardhat-config";
import { pinFile, pinMetadata, verifyContract } from "../scripts/utils";

import songs from "../src/assets/songs";
import { RadioDAONFTMetadata } from "../scripts/types";

import * as dotenv from "dotenv";
dotenv.config();

async function main({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  let tokenURIs: string[] = [
    "these",
    "are",
    "16",
    "strings",
    "that",
    "are",
    "the",
    "temporary",
    "uris",
    "when",
    "we",
    "do",
    "not",
    "pin",
    "to",
    "pinata",
  ];

  if (process.env.PIN_TO_PINATA === "true") {
    tokenURIs = await handleTokenURIs();
  }

  const deployArgs = [tokenURIs];

  log("Deploying RadioDAONFT contract ...");
  const rdioNFT = await deploy("RadioDAONFT", {
    from: deployer,
    args: deployArgs,
    log: true,
    waitConfirmations: 1,
  });

  log("... Done! Deployed RadioDAONFT contract at", rdioNFT.address);

  // verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying contract ...");
    await verifyContract(rdioNFT.address, deployArgs);
  }
}

async function handleTokenURIs(): Promise<string[]> {
  let tokenURIs: string[] = [];

  for (const song of songs) {
    console.log("Pinning data for", song.title, "...");

    const imagePath = path.join("public/" + song.imgSrc);
    const audioPath = path.join("public/" + song.src);

    console.log("\t- pinning", imagePath, "...");
    const imageResponse = await pinFile(imagePath);
    console.log("\t\t... Done!");

    console.log("\t- pinning", audioPath, "...");
    const audioResponse = await pinFile(audioPath);
    console.log("\t\t... Done!");

    const metadata: RadioDAONFTMetadata = {
      title: song.title,
      artist: song.artist,
      image: `ipfs://${imageResponse.IpfsHash}`,
      audio: `ipfs://${audioResponse.IpfsHash}`,
    };

    console.log("\t- pinning NFT metadata ...");
    const metadataResponse = await pinMetadata(metadata);
    console.log("\t\t... Done!");

    tokenURIs.push(`ipfs://${metadataResponse.IpfsHash}`);
  }

  return tokenURIs;
}

export default main;
