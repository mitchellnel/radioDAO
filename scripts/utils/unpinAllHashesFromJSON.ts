import pinataSDK from "@pinata/sdk";

import { setTimeout } from "timers/promises";
import * as fs from "fs";
import * as path from "path";

import * as dotenv from "dotenv";
dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
const PINATA_API_SECRET = process.env.PINATA_API_SECRET || "";

const pinata = pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

const HASHES_PATH = "ipfs/";

async function unpinAllHashesFromJSON(JSONfilename: string) {
  console.log("*** Unpinning ALL HASHES FROM", JSONfilename, "***");
  console.log(
    "\tWaiting 10 seconds in case running this script was a mistake ..."
  );
  await setTimeout(10_000);
  console.log("... UNPINNING !!!");

  const JSONfilepath = path.resolve(path.join(HASHES_PATH, JSONfilename));
  fs.readFile(JSONfilepath, "utf8", async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let hashes = JSON.parse(data).hashes;
      await hashes.forEach(async (pin) => {
        console.log("Unpinning", pin.name);
        await pinata.unpin(pin.hash);
        console.log(
          "... Done! Waiting 3 seconds, and then moving to next unpin."
        );
        await setTimeout(3_000);
      });
    }
  });

  console.log("... Done! All hashes unpinned.");
  console.log("*** REMEMBER TO DELETE HASHES JSON ***");
  console.log("\t*** REMEMBER TO DELETE HASHES JSON ***");
  console.log("*** REMEMBER TO DELETE HASHES JSON ***");
}

// CHANGE LINE BELOW TO UNPIN HASHES
unpinAllHashesFromJSON("EDIT THIS");
