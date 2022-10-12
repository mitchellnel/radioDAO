import { useContractFunction } from "@usedapp/core";
import { Contract } from "ethers";

function useDelistNFT(marketplaceContract: Contract) {
  // we use this hook as a wrapper for a useContractCall to delistNFT
  const { state: delistNFTState, send: delistNFTSend } = useContractFunction(
    marketplaceContract,
    "delistNFT",
    { transactionName: "Delist NFT" }
  );

  const delistNFT = (tokenID: number) => {
    delistNFTSend(tokenID);
  };

  return { delistNFTState, delistNFT };
}

export { useDelistNFT };
