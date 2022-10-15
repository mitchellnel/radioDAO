import { useCall } from "@usedapp/core";
import { BigNumber, Contract, utils } from "ethers";

import { ProposalVotes } from "../../types";

function useProposalVotes(
  daoABI: any,
  daoAddress: string,
  proposalID: BigNumber
): ProposalVotes | undefined {
  const daoInterface = new utils.Interface(daoABI);
  const daoContract = new Contract(daoAddress, daoInterface);

  const { value, error } =
    useCall({
      contract: daoContract,
      method: "proposalVotes",
      args: [proposalID],
    }) ?? {};

  if (error) {
    return undefined;
  }

  if (value !== undefined) return value;
  else return value;
}

export { useProposalVotes };
