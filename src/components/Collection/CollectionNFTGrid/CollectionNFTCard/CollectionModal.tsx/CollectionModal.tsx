import React, { useEffect, useState } from "react";

import { BigNumber, Contract, utils } from "ethers";
import { useContractFunction } from "@usedapp/core";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ModalCloseButton from "../../../../shared/ModalFeatures/ModalCloseButton";
import ModalPlayer from "../../../../shared/ModalFeatures/ModalPlayer/ModalPlayer";

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
}: CollectionModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [sellPrice, setSellPrice] = useState<string>("");
  const [sellPriceFieldError, setSellPriceFieldError] =
    useState<boolean>(false);

  // create a sellNFT function that will call the sellNFT contract function
  const { state: sellNFTState, send: sellNFTSend } = useContractFunction(
    nftContract,
    "sellNFT",
    { transactionName: "Sell NFT" }
  );
  const sellNFT = (tokenID: number, priceToSell: string) => {
    const price = utils.parseUnits(priceToSell, 18);
    sellNFTSend(tokenID, price);
  };

  // handler for when the modal button is pressed
  const handleModalButtonClick = async (priceToSell: string) => {
    if (priceToSell === "") {
      setSellPriceFieldError(true);
      return;
    }

    setLoading(true);

    // TODO: need to approve NEL approval on front end
    sellNFT(tokenID, priceToSell);
  };

  // use transaction states to set loading button state
  useEffect(() => {
    if (
      sellNFTState.status === "PendingSignature" ||
      sellNFTState.status === "Mining"
    ) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [sellNFTState]);

  // sellPrice control
  const handleSellPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSellPrice(event.target.value);
  };

  // validation checks on sellPrice
  useEffect(() => {
    if (Number(sellPrice)) {
      const sellPrice_BigNumber: BigNumber = BigNumber.from(sellPrice);

      if (!sellPrice_BigNumber.gt(BigNumber.from(0))) {
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
        <div className="flex justify-center mt-16 gap-8">
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
