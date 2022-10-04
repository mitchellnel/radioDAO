import React from "react";

import { BigNumber } from "ethers";
import { useEthers } from "@usedapp/core";

import { useGetAllNFTsForSale } from "../../../hooks/radioDAONFT";
import NFTCard from "./NFTCard/NFTCard";
import RadioDAONFTABI from "../../../constants/RadioDAONFTABI.json";
import ContractAddresses from "../../../constants/ContractAddresses.json";

function NFTGrid() {
  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  const nftABI = RadioDAONFTABI["abi"];
  const nftAddress = ContractAddresses[networkName]["radiodaonft"];

  const forSaleNFTs = useGetAllNFTsForSale(nftABI, nftAddress);

  return (
    <div className="flex flex-wrap">
      {forSaleNFTs !== undefined ? (
        forSaleNFTs.map((nft) => {
          if (nft === undefined) return <div></div>;

          return (
            <NFTCard
              key={nft.tokenID.toNumber()}
              rdioNFTAddress="0xB1Ea022C87f1125464460ba841e3bdD44F22109f"
              tokenID={nft.tokenID.toNumber()}
              seller="0xcDA1048cf97B65ED9fb852AE677F02a28bd09ad3"
              price={BigNumber.from("10000000000000000000")}
            />
          );
        })
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default NFTGrid;
