import { network } from "hardhat";

async function moveBlocks(amount: number) {
  console.log("\nMoving blocks...");
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
  console.log(`Moved ${amount} blocks\n`);
}

export { moveBlocks };
