import React, { useEffect, useState } from "react";

import { Contract, utils } from "ethers";
import { useEthers } from "@usedapp/core";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useApproveAndSellNFT } from "../../../../../hooks/radioDAONFT";

import ModalCloseButton from "../../../../shared/ModalFeatures/ModalCloseButton";
import ModalPlayer from "../../../../shared/ModalFeatures/ModalPlayer/ModalPlayer";

import NelthereumABI from "../../../../../constants/NelthereumABI.json";
import ContractAddresses from "../../../../../constants/ContractAddresses.json";

const modalBoxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "primary.light",
  border: "2px solid #e8bd30",
  boxShadow: 24,
  p: 2,
  outline: "none",
};

interface CollectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  nftContract: Contract;
  tokenID: number;
  songTitle: string | undefined;
  songArtist: string | undefined;
  imageURI: string | undefined;
  audioURI: string | undefined;
  marketplaceFee: string;
}

function CollectionModal({
  isVisible,
  onClose,
  nftContract,
  tokenID,
  songTitle,
  songArtist,
  imageURI,
  audioURI,
  marketplaceFee,
}: CollectionModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [sellPrice, setSellPrice] = useState<string>("");
  const [sellPriceFieldError, setSellPriceFieldError] =
    useState<boolean>(false);

  // get NEL contract
  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  const nelABI = NelthereumABI["abi"];
  const nelInterface = new utils.Interface(nelABI);
  const nelAddress = ContractAddresses[networkName]["nelthereum"];
  const nelContract = new Contract(nelAddress, nelInterface);

  // get function to make sell transaction
  const { txnState: approveAndSellNFTState, approveAndSellNFT } =
    useApproveAndSellNFT(nelContract, nftContract, marketplaceFee);

  // handler for when the modal button is pressed
  const handleModalButtonClick = async (priceToSell: string) => {
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
      setLoading(true);
    } else {
      setLoading(false);
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

      console.log("sp", sellPrice);
      console.log("sp_N", sellPrice_Number);

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
    <Modal
      open={isVisible}
      onClose={onClose}
      aria-labelledby="modal-listing-modal"
      aria-describedby="modal-listing-modal-description"
    >
      <Box sx={modalBoxStyle}>
        <div
          className="flex flex-row items-center"
          style={{ justifyContent: "space-between" }}
        >
          <div className="flex flex-row items-end">
            <Typography
              id="modal-listing-modal"
              variant="h2"
              component="h2"
              color="primary.contrastText"
              fontFamily="Outfit"
              fontWeight="600"
            >
              {songTitle}
            </Typography>
            <Typography
              id="modal-listing-modal-description"
              variant="h4"
              component="h4"
              color="primary.contrastText"
              fontFamily="Outfit"
              fontWeight="600"
              sx={{
                marginBottom: "5px",
              }}
            >
              <div className="flex flex-row ml-3">{"by " + songArtist}</div>
            </Typography>
          </div>
          <ModalCloseButton onClick={onClose} />
        </div>
        <div className="flex flex-row mt-4 justify-center items-center">
          <div className="basis-1/2 pl-6">
            <img
              className=""
              src={imageURI}
              alt="nft song art"
              height="400"
              width="400"
              style={{ marginRight: "200px" }}
            />
          </div>

          <div className="basis-1/2 pt-20 px-10">
            <ModalPlayer audioURI={audioURI as string} />
          </div>
        </div>
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
            loading={loading}
            loadingIndicator={<CircularProgress color="secondary" size={24} />}
            variant="contained"
            color="secondary"
            sx={{ fontFamily: "Outfit", fontSize: "1rem", fontWeight: "600" }}
            onClick={() => handleModalButtonClick(sellPrice)}
          >
            Sell NFT
          </LoadingButton>
        </div>
      </Box>
    </Modal>
  );
}

export default CollectionModal;
