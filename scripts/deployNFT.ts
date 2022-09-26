import { network, ethers } from "hardhat";

import * as path from "path";

import { networkConfig, developmentChains } from "../helper-hardhat-config";
import { pinFile, pinMetadata } from "./utils/uploadNFTDataToPinata";

import songs from "../src/assets/songs";
import { RadioDAONFTMetadata } from "./types";

import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  let tokenURIs: string[] = [];
  if (process.env.PIN_TO_PINATA === "true") {
    tokenURIs = await handleTokenURIs();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

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
