import { useContractFunction, useEthers } from "@usedapp/core";
import { BigNumber, Contract, utils } from "ethers";

import ContractAddresses from "../../constants/ContractAddresses.json";
import RadioDAOABI from "../../constants/RadioDAOABI.json";

function useCastVote(proposalId: BigNumber) {
  // we use this hook as a wrapper to make a castVote transaction to the
  //  RadioDAO contract

  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  // get RadioDAO contract
  const daoABI = RadioDAOABI["abi"];
  const daoInterface = new utils.Interface(daoABI);
  const daoAddress = ContractAddresses[networkName]["RadioDAO"];
  const daoContract = new Contract(daoAddress, daoInterface);

  // get state and send function for propose
  const { state: castVoteState, send: castVoteSend } = useContractFunction(
    daoContract,
    "castVote",
    { transactionName: "Cast a vote on a proposal" }
  );

  const castVote = (voteWay: string) => {
    let voteSupport = 2;
    if (voteWay === "FOR") {
      voteSupport = 1;
    } else if (voteWay === "AGAINST") {
      voteSupport = 0;
    }

    castVoteSend(proposalId, voteSupport);
  };

  return { castVoteState, castVote };
}

export { useCastVote };
