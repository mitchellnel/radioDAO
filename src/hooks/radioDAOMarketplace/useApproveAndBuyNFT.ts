import { useEffect, useState } from "react";
import { TransactionStatus, useContractFunction } from "@usedapp/core";
import { Contract, utils } from "ethers";

function useApproveAndBuyNFT(
  nelContract: Contract,
  marketplaceContract: Contract,
  amountToApprove: string
) {
  // we will use this hook to make an approve transaction for NEL and then
  //  buy a NFT
  const [tokenIDToSell, setTokenIDToSell] = useState<number>();

  // make the approve transaction
  const { state: approveNELState, send: approveNELSend } = useContractFunction(
    nelContract,
    "approve",
    { transactionName: "Approve NEL Transfer" }
  );

  const approveAndBuyNFT = (tokenID: number) => {
    setTokenIDToSell(tokenID);

    return approveNELSend(
      marketplaceContract.address,
      utils.parseUnits(amountToApprove, 18)
    );
  };

  // if approve transaction is successful, make the buyNFT transaction
  const { state: buyNFTState, send: buyNFTSend } = useContractFunction(
    marketplaceContract,
    "buyNFT",
    { transactionName: "Buy NFT" }
  );

  useEffect(() => {
    if (approveNELState.status === "Success") {
      // make the buyNFT transaction
      buyNFTSend(tokenIDToSell);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveNELState, tokenIDToSell]);

  // track overall state
  const [txnState, setTxnState] = useState<TransactionStatus>(approveNELState);

  useEffect(() => {
    if (approveNELState.status === "Success") {
      setTxnState(buyNFTState);
    } else {
      setTxnState(approveNELState);
    }
  }, [approveNELState, buyNFTState]);

  return { approveAndBuyNFTState: txnState, approveAndBuyNFT };
}

export { useApproveAndBuyNFT };
