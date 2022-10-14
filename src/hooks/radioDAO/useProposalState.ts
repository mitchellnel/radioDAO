import { useCall } from "@usedapp/core";
import { BigNumber, Contract, utils } from "ethers";

function useProposalState(
  daoABI: any,
  daoAddress: string,
  proposalID: BigNumber
): BigNumber | undefined {
  const daoInterface = new utils.Interface(daoABI);
  const daoContract = new Contract(daoAddress, daoInterface);

  const { value, error } =
    useCall({
      contract: daoContract,
      method: "state",
      args: [proposalID],
    }) ?? {};

  if (error) {
    return undefined;
  }

  if (value !== undefined) return value[0];
  else return value;
}

export { useProposalState };
