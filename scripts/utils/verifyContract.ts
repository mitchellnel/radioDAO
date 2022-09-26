import { run } from "hardhat";

async function verifyContract(contractAddress: string, args: any[]) {
  console.log("Verifying contract at address", contractAddress);

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (err) {
    if (err.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(err);
    }
  }
}

export { verifyContract };
