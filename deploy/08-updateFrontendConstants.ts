import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  writeNewContractABIs,
  writeNewContractAddresses,
} from "../scripts/frontendHelpers";

const updateFrontendConstants: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  //   @ts-ignore
  const { deployments } = hre;
  const { log } = deployments;

  log("--------------------------------------------------");
  log("\nUpdating the frontend constants for our deployed contracts ...");

  log("\n\tUpdating ABI JSONs...");
  writeNewContractABIs();
  log("\t... Done!");

  log("\n\tUpdating localhost constants ...");
  writeNewContractAddresses("localhost");
  log("\t... Done!");

  log("\n\tUpdating Goerli constants ...");
  writeNewContractAddresses("goerli");
  log("\t... Done!");

  log("--------------------------------------------------");
};

export default updateFrontendConstants;
updateFrontendConstants.tags = ["all", "frontend"];
