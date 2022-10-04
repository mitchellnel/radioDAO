import React, { useEffect, useState } from "react";
import {
  useContractFunction,
  useEthers,
  useNotifications,
} from "@usedapp/core";
import { BigNumber, Contract, ethers, utils } from "ethers";

import { Card } from "@web3uikit/core";

import RadioDAONFTABI from "../../../../constants/RadioDAONFTABI.json";
import { useTokenURI } from "../../../../hooks/radioDAONFT";
import { RadioDAONFTMetadata } from "../../../../../scripts/types";

interface NFTCardProps {
  rdioNFTAddress: string;
  tokenID: number;
  seller: string;
  price: BigNumber;
  key: number;
}

function NFTCard({ rdioNFTAddress, tokenID, seller, price }: NFTCardProps) {
  const { active, account } = useEthers();

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

  const updateUI = async () => {
    if (tokenURI) {
      const requestURL = tokenURI
        .toString()
        .replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenURIResponse: RadioDAONFTMetadata = await (
        await fetch(requestURL)
      ).json();

      setSongTitle(tokenURIResponse.title);
      setSongArtist(tokenURIResponse.artist);
      setImageURI(
        tokenURIResponse.image.replace("ipfs://", "https://ipfs.io/ipfs/")
      );
      setAudioURI(
        tokenURIResponse.audio.replace("ipfs://", "https://ipfs.io/ipfs/")
      );
    }
  };

  useEffect(() => {
    if (active !== undefined) {
      updateUI();
    }
  }, [active, tokenURI]);

  const isOwnedByUser = seller === account || seller === undefined;
  const formattedSellerAddress = isOwnedByUser
    ? "You"
    : truncateString(seller, 15);

  return (
    <div className="m-4">
      {imageURI ? (
        <div style={{ width: "256px" }}>
          <Card title={songTitle} description={songArtist}>
            <div className="p-2">
              <div className="flex flex-col items-center gap-2">
                <div>#{tokenID}</div>

                <div className="italic text-sm">
                  Owned by {formattedSellerAddress}
                </div>

                <img
                  src={imageURI}
                  alt="nft song art"
                  height="200"
                  width="200"
                />

                <div className="font-bold">
                  {ethers.utils.formatUnits(price, "ether")} NEL
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div>Loading ...</div>
      )}
    </div>
  );
}

export default NFTCard;

function truncateString(str: string, strLen: number): string {
  if (str.length <= strLen) return str;

  const separator = "...";

  const nCharsToShow = strLen - separator.length;

  const frontChars = Math.ceil(nCharsToShow / 2);
  const backChars = Math.floor(nCharsToShow / 2);

  return (
    str.substring(0, frontChars) +
    separator +
    str.substring(str.length - backChars)
  );
}
