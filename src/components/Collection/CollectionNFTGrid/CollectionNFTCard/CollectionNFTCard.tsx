import React, { useEffect, useState } from "react";
import { useEthers } from "@usedapp/core";
import { BigNumber, Contract, ethers, utils } from "ethers";

import { Card } from "@web3uikit/core";

import RadioDAONFTABI from "../../../../constants/RadioDAONFTABI.json";
import { useTokenURI } from "../../../../hooks/radioDAONFT";
import { RadioDAONFTMetadata } from "../../../../../scripts/types";

interface CollectionNFTCardProps {
  rdioNFTAddress: string;
  tokenID: number;
}

function CollectionNFTCard({
  rdioNFTAddress,
  tokenID,
}: CollectionNFTCardProps) {
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

  // open modal (popup window) when card is clicked
  const handleCardClick = () => {
    setShowModalFlag(true);
  };

  return (
    <div className="m-4">
      <div>
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

                  <div className="italic text-sm">Owned by You</div>

                  <img
                    src={imageURI}
                    alt="nft song art"
                    height="200"
                    width="200"
                  />
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

export default CollectionNFTCard;
