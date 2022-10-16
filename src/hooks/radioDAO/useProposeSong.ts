import { useContractFunction, useEthers } from "@usedapp/core";
import { Contract, utils } from "ethers";
import { v4 as uuidv4 } from "uuid";

import ContractAddresses from "../../constants/ContractAddresses.json";
import RadioDAOABI from "../../constants/RadioDAOABI.json";
import RadioABI from "../../constants/RadioABI.json";

function useProposeSong(voteTokenURI: string | undefined) {
  // we use this hook as a wrapper to make a propose transaction to the
  //  RadioDAO contract

  // the proposal description will be the metadata URI of the song the user is
  //  proposing to be queued

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

  // assemble propose arguments
  const targets: string[] = [radioAddress];
  const values: number[] = [0];
  const encodedFunctionCall: string = radioInterface.encodeFunctionData(
    "queueSong",
    [voteTokenURI]
  );

  // get state and send function for propose
  const { state: proposeSongState, send: proposeSend } = useContractFunction(
    daoContract,
    "propose",
    { transactionName: "Propose to Queue Song" }
  );

  const proposeSong = async () => {
    if (voteTokenURI !== undefined) {
      // we prepend the description with a random string to make this a
      //  "new unique" proposal
      // we will split on "$" in later code to retrieve the metadata URI
      const description = uuidv4() + "$" + voteTokenURI;
      console.log(
        await proposeSend(targets, values, [encodedFunctionCall], description)
      );
    }
  };

  return { proposeSongState, proposeSong };
}

export { useProposeSong };
