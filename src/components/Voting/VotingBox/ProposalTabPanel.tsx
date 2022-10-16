import React, { useEffect, useState } from "react";

import { useEthers, useNotifications } from "@usedapp/core";
import { Typography } from "@mui/material";
import { TabPanel } from "@mui/lab";

import { useProposalVotes } from "../../../hooks/radioDAO";

import NFTModalArt from "../../shared/NFTModalFeatures/NFTModalArt";
import VoteWayText from "./ProposalTabPanelFeatures/VoteWayText";
import VoteWayButton from "./ProposalTabPanelFeatures/VoteWayButton";
import NotificationModal from "../../shared/NotificationModal/NotificationModal";

import ContractAddresses from "../../../constants/ContractAddresses.json";
import RadioDAOABI from "../../../constants/RadioDAOABI.json";
import { ProposalInformation, SuccessNotification } from "../../../types/types";
import { RadioDAONFTMetadata } from "../../../../scripts/types";

interface ProposalTabPanelProps {
  proposal: ProposalInformation;
}

function ProposalTabPanel({ proposal }: ProposalTabPanelProps) {
  const [songTitle, setSongTitle] = useState<string>("");
  const [songArtist, setSongArtist] = useState<string>("");
  const [imageURI, setImageURI] = useState<string>("");

  const tokenURI = proposal.description.split("$")[1];
  const panelValue = String(proposal.id);

  // update the UI when we get the token URI
  useEffect(() => {
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
      }
    };
    updateUI();
  }, [tokenURI]);

  // get RadioDAO contract
  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  const daoABI = RadioDAOABI["abi"];
  const daoAddress = ContractAddresses[networkName]["RadioDAO"];

  const proposalVotes = useProposalVotes(daoABI, daoAddress, proposal.id);

  // display a success notification if the user votes successfully
  const { notifications } = useNotifications();
  const [successNotification, setSuccessNotification] =
    useState<SuccessNotification>();
  const [showNotification, setShowNotificationFlag] = useState<boolean>(false);
  const hideNotification = () => setShowNotificationFlag(false);

  useEffect(() => {
    notifications.every((notification) => {
      if (
        notification.type === "transactionSucceed" &&
        notification.transactionName === "Cast a vote on a proposal"
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
      <div>
        <TabPanel value={panelValue}>
          <div className="flex flex-col gap-4">
            <Typography
              id="tab-panel-title"
              variant="h2"
              component="h2"
              color="primary.main"
              fontFamily="Outfit"
              fontSize="3.5rem"
              fontWeight="600"
            >
              Next song: {songTitle} by {songArtist}
            </Typography>
            <div className="flex flex-row">
              <div className="basis-1/2">
                <NFTModalArt imageURI={imageURI} />
              </div>
              <div className="flex flex-col basis-1/2 mt-10 gap-y-20">
                <div className="flex flex-col justify-center">
                  <VoteWayText
                    voteWay="FOR"
                    votes={
                      proposalVotes ? proposalVotes["forVotes"].toString() : "0"
                    }
                  />

                  <VoteWayText
                    voteWay="AGAINST"
                    votes={
                      proposalVotes
                        ? proposalVotes["againstVotes"].toString()
                        : "0"
                    }
                  />

                  <VoteWayText
                    voteWay="ABSTAINING"
                    votes={
                      proposalVotes
                        ? proposalVotes["abstainVotes"].toString()
                        : "0"
                    }
                  />
                </div>
                <div className="flex flex-row justify-center gap-4">
                  <VoteWayButton proposal={proposal} voteWay="FOR" />
                  <VoteWayButton proposal={proposal} voteWay="AGAINST" />
                  <VoteWayButton proposal={proposal} voteWay="ABSTAIN" />
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </div>
    </>
  );
}

export default ProposalTabPanel;
