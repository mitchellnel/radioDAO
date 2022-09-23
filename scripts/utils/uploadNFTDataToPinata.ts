import pinataSDK, { PinataPinResponse } from "@pinata/sdk";

import * as fs from "fs";
import * as path from "path";

import * as dotenv from "dotenv";
dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || "";

const pinata = pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

async function storeFiles(filePath) {
  const absolutePath = path.resolve(filePath);
  const files = fs.readdirSync(absolutePath);

  let responses: PinataPinResponse[] = [];
  for (let file of files) {
    const readableStreamForFile = fs.createReadStream(
      `${absolutePath}/${file}`
    );

    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile);
      responses.push(response);
    } catch (err) {
      console.log(err);
    }
  }
}

async function storeMetadata(metadata): Promise<PinataPinResponse> {
  try {
    const response = await pinata.pinJSONToIPFS(metadata);
    return response;
  } catch (err) {
    console.log(err);
  }

  return null as unknown as PinataPinResponse;
}

module.exports = { storeFiles, storeMetadata };
