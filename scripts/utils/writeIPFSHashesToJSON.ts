import * as fs from "fs";
import * as path from "path";

const HASHES_PATH = "ipfs/";

async function writeIPFSHashesToJSON(filename: string, ipfsHash: string) {
  const date = new Date();

  const hashesFilename =
    "hashes_" +
    String(date.getDate()) +
    "0" +
    String(date.getMonth() + 1) +
    String(date.getFullYear()) +
    ".json";

  const hashesFilepath = path.resolve(path.join(HASHES_PATH, hashesFilename));

  if (!fs.existsSync(hashesFilepath)) {
    let hashesObj = {
      hashes: [] as Object[],
    };

    hashesObj.hashes.push({
      name: filename,
      hash: ipfsHash,
      link: `ipfs://${ipfsHash}`,
    });

    const hashesJSON = JSON.stringify(hashesObj);
    fs.writeFileSync(hashesFilepath, hashesJSON, "utf8");
  } else {
    fs.readFile(hashesFilepath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        let obj = JSON.parse(data);
        obj.hashes.push({
          name: filename,
          hash: ipfsHash,
          link: `ipfs://${ipfsHash}`,
        });
        const json = JSON.stringify(obj);
        fs.writeFileSync(hashesFilepath, json, "utf8");
      }
    });
  }
}

export { writeIPFSHashesToJSON };
