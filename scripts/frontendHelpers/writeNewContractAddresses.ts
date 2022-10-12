import * as fs from "fs";
import * as path from "path";

const DEPLOYMENTS_PATH = "deployments/";
const FRONTEND_CONTRACT_ADDRESSES_PATH = "src/constants/ContractAddresses.json";

const CONTRACTS = [
  "Nelthereum",
  "RadioDAONFT",
  "RadioDAOMarketplace",
  "RadioDAO",
  "RadioTimelock",
  "Radio",
];

async function writeNewContractAddresses(network: string) {
  const networkDeploymentsPath = path.resolve(
    path.join(DEPLOYMENTS_PATH, network)
  );

  let deployedContractFilepaths: string[] = [];
  CONTRACTS.forEach((contract) => {
    const filename = contract + ".json";

    deployedContractFilepaths.push(path.join(networkDeploymentsPath, filename));
  });

  const contractAddressesPath = path.resolve(FRONTEND_CONTRACT_ADDRESSES_PATH);

  if (!fs.existsSync(contractAddressesPath)) {
    let addresses = {
      [network]: {},
    };

    CONTRACTS.forEach((contract) => {
      addresses[network][contract] = "";
    });

    for (let i = 0; i < CONTRACTS.length; i++) {
      const contract = CONTRACTS[i];
      const deployedFile = deployedContractFilepaths[i];

      if (!fs.existsSync(deployedFile)) {
        console.log(`You need to deploy ${contract} to ${network}!`);
      } else {
        const deploymentData = JSON.parse(
          fs.readFileSync(deployedFile, { encoding: "utf-8" })
        );
        addresses[network][contract] = deploymentData["address"];
      }
    }

    const addressesJSON = JSON.stringify(addresses);

    fs.writeFileSync(contractAddressesPath, addressesJSON, "utf-8");
  } else {
    const addresses = JSON.parse(
      fs.readFileSync(contractAddressesPath, { encoding: "utf-8" })
    );

    addresses[network] = {};

    CONTRACTS.forEach((contract) => {
      addresses[network][contract] = "";
    });

    for (let i = 0; i < CONTRACTS.length; i++) {
      const contract = CONTRACTS[i];
      const file = deployedContractFilepaths[i];

      if (!fs.existsSync(file)) {
        console.log(`You need to deploy ${contract} to ${network}!`);
      } else {
        const deploymentData = JSON.parse(
          fs.readFileSync(file, { encoding: "utf-8" })
        );
        addresses[network][contract] = deploymentData["address"];
      }
    }

    const addressesJSON = JSON.stringify(addresses);

    fs.writeFileSync(contractAddressesPath, addressesJSON, "utf-8");
  }
}

export { writeNewContractAddresses };
