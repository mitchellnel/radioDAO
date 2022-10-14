import React, { useState, useEffect } from "react";

import { Contract, utils } from "ethers";
import { CircularProgress, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEthers } from "@usedapp/core";

import { useApproveAndSellNFT } from "../../../../../hooks/radioDAOMarketplace";

import NelthereumABI from "../../../../../constants/NelthereumABI.json";
import ContractAddresses from "../../../../../constants/ContractAddresses.json";

interface SellNFTButtonProps {
  nftContract: Contract;
  marketplaceContract: Contract;
  marketplaceFee: string;
  tokenID: number;
}

function SellNFTButton({
  nftContract,
  marketplaceContract,
  marketplaceFee,
  tokenID,
}: SellNFTButtonProps) {
  const [sellBtnLoading, setSellBtnLoading] = useState<boolean>(false);
  const [sellPrice, setSellPrice] = useState<string>("");
  const [sellPriceFieldError, setSellPriceFieldError] =
    useState<boolean>(false);

  // get NEL contract
  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  const nelABI = NelthereumABI["abi"];
  const nelInterface = new utils.Interface(nelABI);
  const nelAddress = ContractAddresses[networkName]["Nelthereum"];
  const nelContract = new Contract(nelAddress, nelInterface);

  // get function to make sell transaction
  const { approveAndSellNFTState, approveAndSellNFT } = useApproveAndSellNFT(
    nelContract,
    nftContract,
    marketplaceContract,
    marketplaceFee
  );

  // handler for when the sell button is pressed
  const handleSellButtonClick = async (priceToSell: string) => {
    if (priceToSell === "") {
      setSellPriceFieldError(true);
      return;
    }

    approveAndSellNFT(tokenID, utils.parseUnits(sellPrice, 18));
  };

  // use transaction states to set loading button state
  useEffect(() => {
    if (
      approveAndSellNFTState.status === "PendingSignature" ||
      approveAndSellNFTState.status === "Mining"
    ) {
      setSellBtnLoading(true);
    } else {
      setSellBtnLoading(false);
    }
  }, [approveAndSellNFTState]);

  // sellPrice control
  const handleSellPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSellPrice(event.target.value);
  };

  // validation checks on sellPrice
  useEffect(() => {
    if (Number(sellPrice)) {
      const sellPrice_Number: Number = Number(sellPrice);

      if (sellPrice_Number <= 0) {
        setSellPriceFieldError(true);
      } else {
        setSellPriceFieldError(false);
      }
    } else if (sellPrice !== "") {
      setSellPriceFieldError(true);
    } else {
      setSellPriceFieldError(false);
    }
  }, [sellPrice]);

  return (
    <div className="flex justify-center mt-16 mb-8 gap-8">
      <TextField
        required
        value={sellPrice}
        onChange={handleSellPriceChange}
        label="Price to Sell (in NEL)"
        InputLabelProps={{
          shrink: true,
        }}
        variant="filled"
        sx={{ backgroundColor: "#e8bd30" }}
        error={sellPriceFieldError}
        helperText={
          sellPriceFieldError ? "Please input a valid sell price" : ""
        }
      />
      <LoadingButton
        loading={sellBtnLoading}
        loadingIndicator={<CircularProgress color="secondary" size={24} />}
        variant="contained"
        color="secondary"
        sx={{ fontFamily: "Outfit", fontSize: "1rem", fontWeight: "600" }}
        onClick={() => handleSellButtonClick(sellPrice)}
      >
        Sell NFT
      </LoadingButton>
    </div>
  );
}

export default SellNFTButton;
