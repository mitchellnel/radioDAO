import * as fs from "fs";
import * as path from "path";

const DEPLOYMENTS_PATH = path.resolve("deployments/localhost/");
const FRONTEND_CONSTANTS_PATH = path.resolve("src/constants/");

const CONTRACTS = [
  "Nelthereum",
  "RadioDAONFT",
  "RadioDAOMarketplace",
  "RadioDAO",
  "RadioTimelock",
  "Radio",
];

async function writeNewContractABIs() {
  let deployedContractFilepaths: string[] = [];
  let abiFilepaths: string[] = [];
  CONTRACTS.forEach((contract) => {
    const deployedContractFilename = contract + ".json";

    deployedContractFilepaths.push(
      path.join(DEPLOYMENTS_PATH, deployedContractFilename)
    );

    const abiFilename = contract + "ABI.json";

    abiFilepaths.push(path.join(FRONTEND_CONSTANTS_PATH, abiFilename));
  });

  for (let i = 0; i < CONTRACTS.length; i++) {
    let abiObj = {
      abi: [] as {}[],
    };

    const deployedFile = deployedContractFilepaths[i];
    const abiFile = abiFilepaths[i];

    let deploymentData;
    try {
      deploymentData = JSON.parse(
        fs.readFileSync(deployedFile, { encoding: "utf-8" })
      );
    } catch {
      console.log(
        "Deploy contracts to localhost before updating frontend ABI constants"
      );
      return;
    }

    abiObj["abi"].push(deploymentData["abi"]);

    const abiJSON = JSON.stringify(abiObj);

    fs.writeFileSync(abiFile, abiJSON, "utf-8");
  }
}

export { writeNewContractABIs };
