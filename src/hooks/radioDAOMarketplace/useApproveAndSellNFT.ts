import { useEffect, useState } from "react";
import { TransactionStatus, useContractFunction } from "@usedapp/core";
import { BigNumber, Contract, utils } from "ethers";

function useApproveAndSellNFT(
  nelContract: Contract,
  nftContract: Contract,
  marketplaceContract: Contract,
  amountToApprove: string
) {
  // we will use this hook to make an approve transaction for NEL and then
  //  sell a NFT
  const [tokenIDToSell, setTokenIDToSell] = useState<number>();
  const [sellPrice, setSellPrice] = useState<BigNumber>();

  // make the approve NEL transaction
  const { state: approveNELState, send: approveNELSend } = useContractFunction(
    nelContract,
    "approve",
    { transactionName: "Approve NEL Transfer" }
  );

  const approveAndSellNFT = (tokenID: number, priceToSell: BigNumber) => {
    setTokenIDToSell(tokenID);
    setSellPrice(priceToSell);

    return approveNELSend(
      marketplaceContract.address,
      utils.parseUnits(amountToApprove, 18)
    );
  };

  // if approve NEL transaction is successful, make the approve RDIO transaction
  const { state: approveRDIOState, send: approveRDIOSend } =
    useContractFunction(nftContract, "approve", {
      transactionName: "Approve RDIO Transfer",
    });

  useEffect(() => {
    if (approveNELState.status === "Success") {
      // make the approve RDIO transaction
      approveRDIOSend(marketplaceContract.address, tokenIDToSell);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveNELState, marketplaceContract.address, tokenIDToSell]);

  // if approve RDIO transaction is successful, make the sellNFT transaction
  const { state: sellNFTState, send: sellNFTSend } = useContractFunction(
    marketplaceContract,
    "sellNFT",
    { transactionName: "Sell NFT" }
  );

  useEffect(() => {
    if (approveRDIOState.status === "Success") {
      // make the sellNFT transaction
      sellNFTSend(tokenIDToSell, sellPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveRDIOState, tokenIDToSell, sellPrice]);

  // track overall state
  const [txnState, setTxnState] = useState<TransactionStatus>(approveNELState);

  useEffect(() => {
    if (approveNELState.status === "Success") {
      setTxnState(approveRDIOState);
    } else if (approveRDIOState.status === "Success") {
      setTxnState(sellNFTState);
    } else {
      setTxnState(approveNELState);
    }
  }, [approveNELState, approveRDIOState, sellNFTState]);

  return { approveAndSellNFTState: txnState, approveAndSellNFT };
}

export { useApproveAndSellNFT };
