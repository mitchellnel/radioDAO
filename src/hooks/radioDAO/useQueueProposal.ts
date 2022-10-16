import { useContractFunction, useEthers } from "@usedapp/core";
import { Contract, utils } from "ethers";

import ContractAddresses from "../../constants/ContractAddresses.json";
import RadioDAOABI from "../../constants/RadioDAOABI.json";
import RadioABI from "../../constants/RadioABI.json";
import { ProposalInformation } from "../../types";

function useQueueProposal(
  proposal: ProposalInformation,
  voteTokenURI: string | undefined
) {
  // we use this hook as a wrapper to make a queue transaction adn an execute
  //  transaction to the RadioDAO contract

  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  // get RadioDAO contract
  const daoABI = RadioDAOABI["abi"];
  const daoInterface = new utils.Interface(daoABI);
  const daoAddress = ContractAddresses[networkName]["RadioDAO"];
  const daoContract = new Contract(daoAddress, daoInterface);

  // get Radio contract interface and address
  const radioABI = RadioABI["abi"];
  const radioInterface = new utils.Interface(radioABI);
  const radioAddress = ContractAddresses[networkName]["Radio"];

  // assemble arguments
  const targets: string[] = [radioAddress];
  const values: number[] = [0];
  const encodedFunctionCall: string = radioInterface.encodeFunctionData(
    "queueSong",
    [voteTokenURI]
  );
  const descriptionHash = utils.keccak256(
    utils.toUtf8Bytes(proposal.description)
  );

  // make the queue transaction
  const { state: queueProposalState, send: queueProposalSend } =
    useContractFunction(daoContract, "queue", {
      transactionName: "Queue proposal to RadioDAO",
    });

  const queueProposal = () => {
    if (voteTokenURI !== undefined) {
      queueProposalSend(
        targets,
        values,
        [encodedFunctionCall],
        descriptionHash
      );
    }
  };

  return { queueProposalState, queueProposal };
}

export { useQueueProposal };
