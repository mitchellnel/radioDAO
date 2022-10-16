import { useContractFunction, useEthers } from "@usedapp/core";
import { Contract } from "ethers";

function useSelfDelegate(nftContract: Contract) {
  // we use this hook as a wrapper for a useContractCall to delegate
  const { account } = useEthers();

  const { state: selfDelegateState, send: selfDelegateSend } =
    useContractFunction(nftContract, "delegate", {
      transactionName: "Self Delegate",
    });

  const selfDelegate = () => {
    selfDelegateSend(account);
  };

  return { selfDelegateState, selfDelegate };
}

export { useSelfDelegate };
