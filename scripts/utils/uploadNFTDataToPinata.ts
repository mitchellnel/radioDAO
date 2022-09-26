import pinataSDK, { PinataPinOptions, PinataPinResponse } from "@pinata/sdk";

import * as fs from "fs";
import * as path from "path";

import { RadioDAONFTMetadata } from "../types";

import * as dotenv from "dotenv";
dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
const PINATA_API_SECRET = process.env.PINATA_API_SECRET || "";

const pinata = pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

async function pinFile(filePath: string): Promise<PinataPinResponse> {
  const absoluteFilePath = path.resolve(filePath);

  const readableStreamForFile = fs.createReadStream(absoluteFilePath);

  try {
    const response = await pinata.pinFileToIPFS(readableStreamForFile);
    return response;
  } catch (err) {
    console.log(err);
  }

  return null as unknown as PinataPinResponse;
}

async function pinMetadata(
  metadata: RadioDAONFTMetadata
): Promise<PinataPinResponse> {
  const options: PinataPinOptions = {
    pinataMetadata: {
      name: metadata.title,
    },
  };

  try {
    const response = await pinata.pinJSONToIPFS(metadata, options);
    return response;
  } catch (err) {
    console.log(err);
  }

  return null as unknown as PinataPinResponse;
}

export { pinFile, pinMetadata };
