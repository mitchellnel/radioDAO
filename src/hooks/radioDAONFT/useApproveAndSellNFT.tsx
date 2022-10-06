import { useEffect, useState } from "react";
import { TransactionStatus, useContractFunction } from "@usedapp/core";
import { BigNumber, Contract, utils } from "ethers";

function useApproveAndSellNFT(
  nelContract: Contract,
  nftContract: Contract,
  amountToApprove: string
) {
  // we will use this hook to make an approve transaction for NEL and then
  //  sell a NFT
  const [tokenIDToSell, setTokenIDToSell] = useState<number>();
  const [sellPrice, setSellPrice] = useState<BigNumber>();

  // make the approve transaction
  const { state: approveNELState, send: approveNELSend } = useContractFunction(
    nelContract,
    "approve",
    { transactionName: "Approve NEL Transfer" }
  );

  const approveAndSellNFT = (tokenID: number, priceToSell: BigNumber) => {
    setTokenIDToSell(tokenID);
    setSellPrice(priceToSell);

    return approveNELSend(
      nftContract.address,
      utils.parseUnits(amountToApprove, 18)
    );
  };

  // if approve transaction is successful, make the sellNFT transaction
  const { state: sellNFTState, send: sellNFTSend } = useContractFunction(
    nftContract,
    "sellNFT",
    { transactionName: "Sell NFT" }
  );

  useEffect(() => {
    if (approveNELState.status === "Success") {
      // make the sellNFT transaction
      sellNFTSend(tokenIDToSell, sellPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveNELState, tokenIDToSell, sellPrice]);

  // track overall state
  const [txnState, setTxnState] = useState<TransactionStatus>(approveNELState);

  useEffect(() => {
    if (approveNELState.status === "Success") {
      setTxnState(sellNFTState);
    } else {
      setTxnState(approveNELState);
    }
  }, [approveNELState, sellNFTState]);

  return { txnState, approveAndSellNFT };
}

export { useApproveAndSellNFT };
