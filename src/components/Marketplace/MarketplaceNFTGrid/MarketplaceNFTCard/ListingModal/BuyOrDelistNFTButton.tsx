import React, { useState, useEffect } from "react";

import { BigNumber, Contract, utils } from "ethers";
import { useEthers } from "@usedapp/core";
import { CircularProgress, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import {
  useApproveAndBuyNFT,
  useDelistNFT,
} from "../../../../../hooks/radioDAOMarketplace";

import NelthereumABI from "../../../../../constants/NelthereumABI.json";
import ContractAddresses from "../../../../../constants/ContractAddresses.json";

interface BuyOrDelistNFTButtonProps {
  marketplaceContract: Contract;
  tokenID: number;
  seller: string | undefined;
  price: BigNumber;
}

function BuyOrDelistNFTButton({
  marketplaceContract,
  tokenID,
  seller,
  price,
}: BuyOrDelistNFTButtonProps) {
  const { account, chainId } = useEthers();

  const [loading, setLoading] = useState<boolean>(false);

  // work out if user is seller
  const isOwnedByUser = seller === account || seller === undefined;

  // get NEL contract
  const networkName = chainId === 5 ? "goerli" : "localhost";

  const nelABI = NelthereumABI["abi"];
  const nelInterface = new utils.Interface(nelABI);
  const nelAddress = ContractAddresses[networkName]["Nelthereum"];
  const nelContract = new Contract(nelAddress, nelInterface);

  // get function to make buy transaction
  const { approveAndBuyNFTState, approveAndBuyNFT } = useApproveAndBuyNFT(
    nelContract,
    marketplaceContract,
    utils.formatUnits(price.toString(), 18)
  );

  // get function to make delist transaction
  const { delistNFTState, delistNFT } = useDelistNFT(marketplaceContract);

  // handler for when the modal button is pressed
  const handleModalButtonClick = async (isOwnedByUser: boolean) => {
    setLoading(true);

    if (isOwnedByUser) {
      delistNFT(tokenID);
    } else {
      approveAndBuyNFT(tokenID);
    }
  };

  // use transaction states to set loading button state
  useEffect(() => {
    if (
      approveAndBuyNFTState.status === "PendingSignature" ||
      approveAndBuyNFTState.status === "Mining" ||
      delistNFTState.status === "PendingSignature" ||
      delistNFTState.status === "Mining"
    ) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [approveAndBuyNFTState, delistNFTState]);
  return (
    <div className="flex justify-center mt-16 mb-8 gap-8">
      <Typography
        id="modal-listing-modal-price"
        variant="h4"
        component="h4"
        color="primary.contrastText"
        fontFamily="Outfit"
        fontWeight="600"
      >
        {utils.formatUnits(price, 18)} NEL
      </Typography>
      <LoadingButton
        loading={loading}
        loadingIndicator={<CircularProgress color="secondary" size={24} />}
        variant="contained"
        color="secondary"
        sx={{ fontFamily: "Outfit", fontSize: "1rem", fontWeight: "600" }}
        onClick={() => handleModalButtonClick(isOwnedByUser)}
      >
        {isOwnedByUser ? "Delist NFT" : "Buy NFT"}
      </LoadingButton>
    </div>
  );
}

export default BuyOrDelistNFTButton;
