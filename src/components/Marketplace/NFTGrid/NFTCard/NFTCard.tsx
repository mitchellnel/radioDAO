import { useContractFunction, useNotifications } from "@usedapp/core";
import { Contract, utils } from "ethers";
import React, { useState } from "react";

import RadioDAONFTABI from "../../../../constants/RadioDAONFTABI.json";
import { useTokenURI } from "../../../../hooks/radioDAONFT";

interface NFTCardProps {
  rdioNFTAddress: string;
  tokenID: number;
  seller: string;
  price: number;
}

function NFTCard({ rdioNFTAddress, tokenID, seller, price }: NFTCardProps) {
  const [songTitle, setSongTitle] = useState<string>("");
  const [songArtist, setSongArtist] = useState<string>("");
  const [imageURI, setImageURI] = useState<string>("");
  const [audioURI, setAudioURI] = useState<string>("");

  const [showModal, setShowModalFlag] = useState<boolean>(false);
  const hideModal = () => setShowModalFlag(false);

  const { notifications } = useNotifications();

  const rdioNFTABI = RadioDAONFTABI["abi"];
  const rdioNFTInterface = new utils.Interface(rdioNFTABI);
  const rdioNFTContract = new Contract(rdioNFTAddress, rdioNFTInterface);

  const { state: buyNFTState, send: buyNFTSend } = useContractFunction(
    rdioNFTContract,
    "buyNFT",
    { transactionName: "Buy NFT" }
  );
  const buyNFT = (buyPrice: number) => {
    buyNFTSend({ value: buyPrice });
  };

  const tokenURI = useTokenURI(rdioNFTABI, rdioNFTAddress, tokenID);

  return <div>NFTCard</div>;
}

export default NFTCard;
