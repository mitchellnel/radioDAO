import { useLogs, useCalls } from "@usedapp/core";
import { Contract, utils } from "ethers";

import { ProposalInformation } from "../../types/types";

function useGetAllProposalInformation(
  daoABI: any,
  daoAddress: string
): ProposalInformation[] {
  const daoInterface = new utils.Interface(daoABI);
  const daoContract = new Contract(daoAddress, daoInterface);

  const logs = useLogs(
    {
      contract: daoContract,
      event: "ProposalCreated",
      args: [],
    },
    {
      fromBlock: 7753207,
      toBlock: "latest",
    }
  );

  let proposals: ProposalInformation[] = [];

  // parse through event log and get all relevant information
  logs?.value?.forEach((log) => {
    // recover relevant values -- indexes are according to how ProposalCreated
    //  event is defined
    const id = log.data[0];
    const proposer = log.data[1];
    const description = log.data[8];

    const proposal: ProposalInformation = {
      id: id,
      state: 0, // default value until we call daoContract.state()
      proposer: proposer,
      description: description,
    };

    proposals.push(proposal);
  });

  // now get all proposal states
  const stateCalls =
    proposals.map((proposal) => ({
      contract: daoContract,
      method: "state",
      args: [proposal.id],
    })) ?? [];

  const stateResults = useCalls(stateCalls) ?? [];

  stateResults.forEach((result, idx) => {
    if (result && result.error) {
      console.error(
        `Error encountered calling method state on ${stateCalls[idx]?.contract.address} with argument ${stateCalls[idx]?.args[0]}: ${result.error.message}`
      );
    } else {
      proposals[idx].state = result?.value?.[0];
    }
  });

  return proposals;
}

export { useGetAllProposalInformation };
