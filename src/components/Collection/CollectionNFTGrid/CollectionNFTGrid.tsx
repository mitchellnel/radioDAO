import React, { useEffect } from "react";

import { useEthers } from "@usedapp/core";

import RadioDAONFTABI from "../../../constants/RadioDAONFTABI.json";
import ContractAddresses from "../../../constants/ContractAddresses.json";
import { useGetMyNFTs } from "../../../hooks/radioDAONFT";
import CollectionNFTCard from "./CollectionNFTCard/CollectionNFTCard";

function CollectionNFTGrid() {
  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  const nftABI = RadioDAONFTABI["abi"];
  const nftAddress = ContractAddresses[networkName]["radiodaonft"];

  const userOwnedNFTs = useGetMyNFTs(nftABI, nftAddress);

  // put notification stuff here

  useEffect(() => {
    console.log(userOwnedNFTs);
  }, [userOwnedNFTs]);

  return (
    <div className="flex flex-wrap">
      {userOwnedNFTs !== undefined ? (
        userOwnedNFTs.map((tokenID) => {
          if (tokenID === undefined) return <div></div>;

          return (
            <CollectionNFTCard
              key={tokenID}
              rdioNFTAddress={nftAddress}
              tokenID={tokenID}
            />
          );
        })
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default CollectionNFTGrid;
