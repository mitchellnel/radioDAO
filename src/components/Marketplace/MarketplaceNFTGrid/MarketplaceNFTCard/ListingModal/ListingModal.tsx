import React, { useEffect, useState } from "react";

import { BigNumber, Contract, utils } from "ethers";
import { useEthers } from "@usedapp/core";
import { Modal, Box, Typography, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import {
  useApproveAndBuyNFT,
  useDelistNFT,
} from "../../../../../hooks/radioDAOMarketplace";

import ModalCloseButton from "../../../../shared/NFTModalFeatures/ModalCloseButton";
import NFTModalPlayer from "../../../../shared/NFTModalFeatures/NFTModalPlayer/NFTModalPlayer";

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

interface ListingModalProps {
  isVisible: boolean;
  onClose: () => void;
  nftContract: Contract;
  marketplaceContract: Contract;
  tokenID: number;
  seller: string | undefined;
  songTitle: string | undefined;
  songArtist: string | undefined;
  imageURI: string | undefined;
  audioURI: string | undefined;
  price: BigNumber;
}

function ListingModal({
  isVisible,
  onClose,
  nftContract,
  marketplaceContract,
  tokenID,
  seller,
  songTitle,
  songArtist,
  imageURI,
  audioURI,
  price,
}: ListingModalProps) {
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
            <NFTModalPlayer audioURI={audioURI as string} />
          </div>
        </div>
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
      </Box>
    </Modal>
  );
}

export default ListingModal;
