import React, { useEffect, useState } from "react";

import { useEthers, useNotifications } from "@usedapp/core";
import { Contract, utils } from "ethers";

import { useGetDelegate, useGetVotes } from "../../hooks/radioDAONFT";

import NotRegisteredModal from "./NotRegisteredModal";
import NotificationModal from "../shared/NotificationModal/NotificationModal";

import RadioDAONFTABI from "../../constants/RadioDAONFTABI.json";
import ContractAddresses from "../../constants/ContractAddresses.json";
import { SuccessNotification } from "../../types";

function Voting() {
  const [registeredToVote, setRegisteredToVote] = useState<boolean>(false);
  const [votingPower, setVotingPower] = useState<number>(0);

  const { account, chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  // get RadioDAONFT contract
  const nftABI = RadioDAONFTABI["abi"];
  const nftInterface = new utils.Interface(nftABI);
  const nftAddress = ContractAddresses[networkName]["RadioDAONFT"];
  const nftContract = new Contract(nftAddress, nftInterface);

  // get the delegate of the user
  const delegate = useGetDelegate(nftABI, nftAddress);

  // set registeredToVote as true if the user has self-delegated
  useEffect(() => {
    if (account !== undefined && delegate !== undefined) {
      if (delegate === account) {
        setRegisteredToVote(true);
      } else {
        setRegisteredToVote(false);
      }
    } else {
      setRegisteredToVote(false);
    }
  }, [account, delegate]);

  // display notification if self-delegation is a success
  const { notifications } = useNotifications();
  const [successNotification, setSuccessNotification] =
    useState<SuccessNotification>();
  const [showNotification, setShowNotificationFlag] = useState<boolean>(false);
  const hideNotification = () => setShowNotificationFlag(false);

  useEffect(() => {
    notifications.every((notification) => {
      if (
        notification.type === "transactionSucceed" &&
        notification.transactionName === "Self Delegate"
      ) {
        setShowNotificationFlag(true);
        setSuccessNotification(notification);
        return false;
      }

      return true;
    });
  }, [notifications]);

  // get the number of votes that the user has
  const numVotes = useGetVotes(nftABI, nftAddress);

  // set state based on numVotes
  useEffect(() => {
    if (numVotes !== undefined) {
      setVotingPower(Number(numVotes));
    } else {
      setVotingPower(0);
    }
  }, [numVotes]);

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
      <NotRegisteredModal
        isVisible={!registeredToVote}
        nftContract={nftContract}
      />
      <div className="container mx-auto">
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "600",
            marginTop: "32px",
            textAlign: "left",
          }}
        >
          Voting
        </h1>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "300",
            marginTop: "20px",
            textAlign: "left",
          }}
        >
          Your Voting Power is: {votingPower}
        </h1>
      </div>
    </>
  );
}

export default Voting;
