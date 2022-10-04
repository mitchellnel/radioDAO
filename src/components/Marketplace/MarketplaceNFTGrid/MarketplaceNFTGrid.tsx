import React, { useEffect, useState } from "react";

import { useEthers, useNotifications } from "@usedapp/core";

import { useGetAllNFTsForSale } from "../../../hooks/radioDAONFT";
import MarketplaceNFTCard from "./MarketplaceNFTCard/MarketplaceNFTCard";
import RadioDAONFTABI from "../../../constants/RadioDAONFTABI.json";
import ContractAddresses from "../../../constants/ContractAddresses.json";
import NotificationModal from "./NotificationModal/NotificationModal";
import { SuccessNotification } from "../../../types";

function MarketplaceNFTGrid() {
  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  const nftABI = RadioDAONFTABI["abi"];
  const nftAddress = ContractAddresses[networkName]["radiodaonft"];

  const forSaleNFTs = useGetAllNFTsForSale(nftABI, nftAddress);

  const { notifications } = useNotifications();
  const [successNotification, setSuccessNotification] =
    useState<SuccessNotification>();
  const [showNotification, setShowNotificationFlag] = useState<boolean>(false);
  const hideNotification = () => setShowNotificationFlag(false);

  useEffect(() => {
    console.log("looking for notification");

    notifications.every((notification) => {
      if (
        notification.type === "transactionSucceed" &&
        (notification.transactionName === "Buy NFT" ||
          notification.transactionName === "Delist NFT")
      ) {
        setShowNotificationFlag(true);
        setSuccessNotification(notification);
        return false;
      }

      return true;
    });
  }, [notifications]);

  return (
    <>
      {showNotification ? (
        <NotificationModal
          isVisible={showNotification}
          onClose={hideNotification}
          successNotification={successNotification as SuccessNotification}
        />
      ) : (
        <></>
      )}
      <div className="flex flex-wrap">
        {forSaleNFTs !== undefined ? (
          forSaleNFTs.map((nft) => {
            if (nft === undefined) return <div></div>;

            return (
              <MarketplaceNFTCard
                key={nft.tokenID.toNumber()}
                rdioNFTAddress="0xB1Ea022C87f1125464460ba841e3bdD44F22109f"
                tokenID={nft.tokenID.toNumber()}
                seller="0xcDA1048cf97B65ED9fb852AE677F02a28bd09ad3"
                price={nft.price}
              />
            );
          })
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}

export default MarketplaceNFTGrid;
