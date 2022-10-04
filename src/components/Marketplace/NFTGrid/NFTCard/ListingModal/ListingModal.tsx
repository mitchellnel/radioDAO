import React, { useState } from "react";

import { BigNumber, Contract } from "ethers";
import { useEthers } from "@usedapp/core";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import CloseIcon from "@mui/icons-material/Close";

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

interface ListingModalProps {
  isVisible: boolean;
  onClose: () => void;
  nftContract: Contract;
  tokenID: number;
  seller: string | undefined;
  songTitle: string | undefined;
  songArtist: string | undefined;
  imageURI: string | undefined;
  audioURI: string | undefined;
  price: BigNumber | undefined;
}

function ListingModal({
  isVisible,
  onClose,
  nftContract,
  tokenID,
  seller,
  songTitle,
  songArtist,
  imageURI,
  audioURI,
  price,
}: ListingModalProps) {
  const { account } = useEthers();

  const [loading, setLoading] = useState<boolean>(false);

  // work out if user is seller
  const isOwnedByUser = seller === account || seller === undefined;

  // handler for when the modal button is pressed
  const handleModalButtonClick = async (isOwnedByUser: boolean) => {
    setLoading(true);
    isOwnedByUser
      ? console.log("Button clicked as owner")
      : console.log("Button clicked as buyer");
  };

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
          <div className="flex flex-col">
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
            >
              {"by " + songArtist}
            </Typography>
          </div>
          <IconButton
            aria-label="close-modal"
            color="secondary"
            onClick={onClose}
            sx={{ "&:hover": { backgroundColor: "rgb(232, 189, 48, 0.4)" } }}
          >
            <Avatar
              sx={{
                bgcolor: "secondary.main",
                color: "primary.main",
                height: 40,
                width: 40,
              }}
            >
              <CloseIcon sx={{ fontSize: "1.5rem" }} />
            </Avatar>
          </IconButton>
        </div>
        <div>Song art and player</div>
        <div className="flex justify-center mt-16">
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
      </Box>
    </Modal>
  );
}

export default ListingModal;
