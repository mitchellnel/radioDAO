import React, { useState, useEffect } from "react";

import { Contract } from "ethers";
import { CircularProgress, Tooltip } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useGetVotes } from "../../../../../hooks/radioDAONFT";

import RadioDAONFTABI from "../../../../../constants/RadioDAONFTABI.json";

interface ProposeVoteButtonProps {
  nftContract: Contract;
}

function ProposeVoteButton({ nftContract }: ProposeVoteButtonProps) {
  const [registeredToVote, setRegisteredToVote] = useState<boolean>(false);
  const [proposeBtnLoading, setProposeBtnLoading] = useState<boolean>(false);

  // get RadioDAONFT ABI
  const nftABI = RadioDAONFTABI["abi"];

  const userVotes = useGetVotes(nftABI, nftContract.address);

  useEffect(() => {
    if (userVotes !== undefined) {
      if (Number(userVotes) > 0) {
        setRegisteredToVote(true);
      } else {
        setRegisteredToVote(false);
      }
    } else {
      setRegisteredToVote(false);
    }
  }, [userVotes]);

  // get function to make propose transaction
  // TODO: implement this hook

  // handler for when the propose button is clicked
  const handleProposeButtonClicked = async () => {
    console.log("Propose clicked!");
  };

  return (
    <>
      <Tooltip
        arrow
        title={
          registeredToVote
            ? ""
            : "You need to register to vote! Head to the Voting page."
        }
      >
        <div className="flex mb-20 justify-center">
          <LoadingButton
            disabled={!registeredToVote}
            loading={proposeBtnLoading}
            loadingIndicator={<CircularProgress color="secondary" size={24} />}
            variant="contained"
            color="secondary"
            sx={{
              fontFamily: "Outfit",
              fontSize: "1rem",
              fontWeight: "600",
            }}
            onClick={handleProposeButtonClicked}
          >
            Propose Song
          </LoadingButton>
        </div>
      </Tooltip>
    </>
  );
}

export default ProposeVoteButton;
