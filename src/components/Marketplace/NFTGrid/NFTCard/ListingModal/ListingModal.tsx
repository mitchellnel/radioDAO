import React from "react";

import { BigNumber, Contract, utils } from "ethers";
import { useEthers } from "@usedapp/core";
import { Modal, Box } from "@mui/material";

const modalBoxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "primary.light",
  border: "2px solid #e8bd30",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

interface ListingModalProps {
  isVisible: boolean;
  onClose: () => void;
  nftContract: Contract;
  nftInterface: utils.Interface;
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
  nftInterface,
  tokenID,
  seller,
  songTitle,
  songArtist,
  imageURI,
  audioURI,
  price,
}: ListingModalProps) {
  const { account } = useEthers();

  // work out if user is seller
  const isOwnedByUser = seller === account || seller === undefined;

  // handler for when "Ok" (green) modal button is pressed
  const handleOk = (isOwnedByUser: boolean) => {
    isOwnedByUser ? console.log("owned") : console.log("not owned");
  };

  // handler for when "Cancel" (clear) modal button is pressed
  const handleCancel = (isOwnedByUser: boolean) => {
    isOwnedByUser ? console.log("owned") : console.log("not owned");
  };

  return (
    <Modal
      open={isVisible}
      onClose={onClose}
      aria-labelledby="modal-listing-modal"
      aria-describedby="modal-listing-modal-description"
    >
      <Box sx={modalBoxStyle}>
        {seller === account ? <div>hi mr seller</div> : <div>hi pleb</div>}
      </Box>
    </Modal>
  );
}

export default ListingModal;

// <Modal
//   isVisible={isVisible}
//   id="regular"
//   title={songTitle + " by " + songArtist}
//   okText="Cancel"
//   onOk={() => handleOk(isOwnedByUser)}
//   okButtonColor="yellow"
//   cancelText={isOwnedByUser ? "Delist NFT" : "Cancel"}
//   onCancel={() => handleCancel(isOwnedByUser)}
//   onCloseButtonPressed={onClose}
// >
//   {seller === account ? <div>hi mr seller</div> : <div>hi pleb</div>}
// </Modal>
