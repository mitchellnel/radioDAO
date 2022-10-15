import React from "react";

import { BigNumber, Contract } from "ethers";
import { Modal, Box } from "@mui/material";

import ModalCloseButton from "../../../../shared/NFTModalFeatures/ModalCloseButton";
import NFTModalPlayer from "../../../../shared/NFTModalFeatures/NFTModalPlayer/NFTModalPlayer";
import NFTModalTitle from "../../../../shared/NFTModalFeatures/NFTModalTitle";
import NFTModalArt from "../../../../shared/NFTModalFeatures/NFTModalArt";
import BuyOrDelistNFTButton from "./BuyOrDelistNFTButton";

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
          <NFTModalTitle songTitle={songTitle} songArtist={songArtist} />
          <ModalCloseButton onClick={onClose} />
        </div>
        <div className="flex flex-row mt-4 justify-center items-center">
          <NFTModalArt imageURI={imageURI} />

          <div className="basis-1/2 pt-20 px-10">
            <NFTModalPlayer audioURI={audioURI as string} />
          </div>
        </div>
        <BuyOrDelistNFTButton
          marketplaceContract={marketplaceContract}
          tokenID={tokenID}
          seller={seller}
          price={price}
        />
      </Box>
    </Modal>
  );
}

export default ListingModal;
