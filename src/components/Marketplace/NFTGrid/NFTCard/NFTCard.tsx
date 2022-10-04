import React, { useEffect, useState } from "react";
import { useContractFunction, useEthers } from "@usedapp/core";
import { BigNumber, Contract, ethers, utils } from "ethers";

import { Card } from "@web3uikit/core";

import RadioDAONFTABI from "../../../../constants/RadioDAONFTABI.json";
import { useTokenURI } from "../../../../hooks/radioDAONFT";
import { RadioDAONFTMetadata } from "../../../../../scripts/types";
import ListingModal from "./ListingModal/ListingModal";

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

  // create RadioDAONFT contract object
  const rdioNFTABI = RadioDAONFTABI["abi"];
  const rdioNFTInterface = new utils.Interface(rdioNFTABI);
  const rdioNFTContract = new Contract(rdioNFTAddress, rdioNFTInterface);

  // get the token URI using useTokenURI hook
  const tokenURI = useTokenURI(rdioNFTABI, rdioNFTAddress, tokenID);

  // update the UI when we get the token URI
  useEffect(() => {
    if (active !== undefined) {
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
      updateUI();
    }
  }, [active, tokenURI]);

  // work out how to display NFT seller on marketplace
  const isOwnedByUser = seller === account || seller === undefined;
  const formattedSellerAddress = isOwnedByUser
    ? "You"
    : truncateString(seller, 15);

  // open modal (popup window) when card is clicked
  const handleCardClick = () => {
    setShowModalFlag(true);
  };

  return (
    <div className="m-4">
      <div>
        <ListingModal
          isVisible={showModal}
          onClose={hideModal}
          nftContract={rdioNFTContract}
          tokenID={tokenID}
          seller={seller}
          songTitle={songTitle}
          songArtist={songArtist}
          imageURI={imageURI}
          audioURI={audioURI}
          price={price}
        />
        <Card
          title={songTitle}
          description={songArtist}
          onClick={handleCardClick}
        >
          <div className="p-2">
            <div className="flex flex-col items-center gap-2">
              {imageURI ? (
                <>
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
                </>
              ) : (
                <div className="mx-16 my-40">Loading ...</div>
              )}
            </div>
          </div>
        </Card>
      </div>
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
