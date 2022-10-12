import React, { useEffect, useState } from "react";
import { useEthers } from "@usedapp/core";
import { Contract, utils } from "ethers";
import { Card } from "@web3uikit/core";
import { RadioDAONFTMetadata } from "../../../../../scripts/types";

import { useTokenURI } from "../../../../hooks/radioDAONFT";
import { useGetMarketplaceFee } from "../../../../hooks/radioDAOMarketplace";

import CollectionModal from "./CollectionModal/CollectionModal";

import RadioDAONFTABI from "../../../../constants/RadioDAONFTABI.json";
import RadioDAOMarketplaceABI from "../../../../constants/RadioDAOMarketplaceABI.json";
import ContractAddresses from "../../../../constants/ContractAddresses.json";

interface CollectionNFTCardProps {
  rdioNFTAddress: string;
  tokenID: number;
}

function CollectionNFTCard({
  rdioNFTAddress,
  tokenID,
}: CollectionNFTCardProps) {
  const { active, chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

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

  // create RadioDAOMarketplace contract object
  const marketplaceAddress =
    ContractAddresses[networkName]["RadioDAOMarketplace"];
  const marketplaceABI = RadioDAOMarketplaceABI["abi"];
  const marketplaceInterface = new utils.Interface(marketplaceABI);
  const marketplaceContract = new Contract(
    marketplaceAddress,
    marketplaceInterface
  );

  // get the marketplace fee using the useGetMarketplaceFee hook
  const marketplaceFee = useGetMarketplaceFee(
    marketplaceABI,
    marketplaceAddress
  );

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
        <CollectionModal
          isVisible={showModal}
          onClose={hideModal}
          nftContract={rdioNFTContract}
          marketplaceContract={marketplaceContract}
          tokenID={tokenID}
          songTitle={songTitle}
          songArtist={songArtist}
          imageURI={imageURI}
          audioURI={audioURI}
          marketplaceFee={marketplaceFee ? marketplaceFee.toString() : "0"}
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

                  <div className="italic text-sm">Owned by You</div>

                  <img
                    src={imageURI}
                    alt="nft song art"
                    height="200"
                    width="200"
                  />
                </>
              ) : (
                <div className="mx-16 my-36">Loading ...</div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CollectionNFTCard;
