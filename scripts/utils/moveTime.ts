import { network } from "hardhat";

async function moveTime(amount: number) {
  console.log("\nMoving time...");
  await network.provider.send("evm_increaseTime", [amount]);

  console.log(`Moved forward in time ${amount} seconds\n`);
}

export { moveTime };
