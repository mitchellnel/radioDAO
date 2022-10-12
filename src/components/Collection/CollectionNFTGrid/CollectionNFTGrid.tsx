import React, { useEffect, useState } from "react";

import { useEthers, useNotifications } from "@usedapp/core";

import { useGetMyNFTs } from "../../../hooks/radioDAONFT";

import CollectionNFTCard from "./CollectionNFTCard/CollectionNFTCard";
import NotificationModal from "../../shared/NotificationModal/NotificationModal";

import RadioDAONFTABI from "../../../constants/RadioDAONFTABI.json";
import ContractAddresses from "../../../constants/ContractAddresses.json";
import { SuccessNotification } from "../../../types";

function CollectionNFTGrid() {
  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  const nftABI = RadioDAONFTABI["abi"];
  const nftAddress = ContractAddresses[networkName]["RadioDAONFT"];

  const userOwnedNFTs = useGetMyNFTs(nftABI, nftAddress);

  const { notifications } = useNotifications();
  const [successNotification, setSuccessNotification] =
    useState<SuccessNotification>();
  const [showNotification, setShowNotificationFlag] = useState<boolean>(false);
  const hideNotification = () => setShowNotificationFlag(false);

  useEffect(() => {
    notifications.every((notification) => {
      if (
        notification.type === "transactionSucceed" &&
        notification.transactionName === "Sell NFT"
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
        {userOwnedNFTs !== undefined ? (
          userOwnedNFTs.map((tokenID) => {
            if (tokenID === undefined) return <div></div>;

            return (
              <CollectionNFTCard
                key={tokenID.toNumber()}
                rdioNFTAddress={nftAddress}
                tokenID={tokenID.toNumber()}
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

export default CollectionNFTGrid;
