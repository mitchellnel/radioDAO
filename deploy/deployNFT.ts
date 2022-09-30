import { network, ethers } from "hardhat";

import * as path from "path";

import { developmentChains } from "../helper-hardhat-config";
import {
  pinFile,
  pinMetadata,
  verifyContract,
  writeIPFSHashesToJSON,
} from "../scripts/utils";

import songs from "../src/assets/songs";
import { RadioDAONFTMetadata } from "../scripts/types";

import { readFileSync } from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const toWei = (num: Number) => ethers.utils.parseEther(num.toString());

async function main({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // on live networks we need to wait 6 blocks for Etherscan to generate the bytecode
  const waitConfirmations = !developmentChains.includes(network.name) ? 6 : 1;

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

  const initialMarketplaceFee = toWei(0.5);

  if (process.env.PIN_TO_PINATA === "true") {
    tokenURIs = await handleTokenURIs();
  } else {
    // CHANGE THIS TO CHANGE IPFS HASH SOURCE
    const HASH_JSON_FILENAME = path.resolve(
      path.join("ipfs", "hashes_25092022.json")
    );
    //

    const data = readFileSync(HASH_JSON_FILENAME, "utf8");
    const hashes = JSON.parse(data).hashes;
    const metadataPins = hashes.filter((pinnedFile) =>
      pinnedFile.name.includes("Metadata")
    );

    tokenURIs = [];
    metadataPins.forEach((pin) => {
      tokenURIs.push(pin.link);
    });
  }

  const nel = await deployments.get("Nelthereum");

  const deployArgs = [nel.address, tokenURIs, initialMarketplaceFee];

  log("Deploying RadioDAONFT contract ...");
  const rdioNFT = await deploy("RadioDAONFT", {
    from: deployer,
    args: deployArgs,
    log: true,
    waitConfirmations: waitConfirmations,
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
    await writeIPFSHashesToJSON(song.title + ".jpg", imageResponse.IpfsHash);
    console.log("\t\t... Done!");

    console.log("\t- pinning", audioPath, "...");
    const audioResponse = await pinFile(audioPath);
    await writeIPFSHashesToJSON(song.title + ".mp3", audioResponse.IpfsHash);
    console.log("\t\t... Done!");

    const metadata: RadioDAONFTMetadata = {
      title: song.title,
      artist: song.artist,
      image: `ipfs://${imageResponse.IpfsHash}`,
      audio: `ipfs://${audioResponse.IpfsHash}`,
    };

    console.log("\t- pinning NFT metadata ...");
    const metadataResponse = await pinMetadata(metadata);
    await writeIPFSHashesToJSON(
      song.title + " Metadata",
      metadataResponse.IpfsHash
    );
    console.log("\t\t... Done!");

    tokenURIs.push(`ipfs://${metadataResponse.IpfsHash}`);
  }

  return tokenURIs;
}

export default main;
