import React, { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useCastVote } from "../../../../../hooks/radioDAO";

import { ProposalInformation } from "../../../../../types";

interface VoteWayButtonProps {
  proposal: ProposalInformation;
  voteWay: string;
}

function VoteWayButton({ proposal, voteWay }: VoteWayButtonProps) {
  const [buttonColor, setButtonColor] = useState<
    "inherit" | "voteFor" | "voteAgainst" | "voteAbstain"
  >("inherit");
  const [buttonText, setButtonText] = useState<string>("");

  useEffect(() => {
    if (voteWay === "FOR") {
      setButtonColor("voteFor");
      setButtonText("Vote For");
    } else if (voteWay === "AGAINST") {
      setButtonColor("voteAgainst");
      setButtonText("Vote Against");
    } else if (voteWay === "ABSTAIN") {
      setButtonColor("voteAbstain");
      setButtonText("Abstain");
    } else {
      setButtonColor("inherit");
      setButtonText("this shouldn't happen");
    }
  }, [voteWay]);

  const [voteBtnLoading, setVoteBtnLoading] = useState<boolean>(false);

  // get function to cast vote
  const { castVoteState, castVote } = useCastVote(proposal.id);

  // handler for when the vote button is pressed
  const handleVoteButtonClick = async () => {
    castVote(voteWay);
  };

  // use transaction states to set loading button state
  useEffect(() => {
    if (
      castVoteState.status === "PendingSignature" ||
      castVoteState.status === "Mining"
    ) {
      setVoteBtnLoading(true);
    } else {
      setVoteBtnLoading(false);
    }
  }, [castVoteState]);

  return (
    <>
      <LoadingButton
        loading={voteBtnLoading}
        loadingIndicator={<CircularProgress color="secondary" size={24} />}
        variant="contained"
        color={buttonColor}
        sx={{ fontFamily: "Outfit", fontSize: "1.25rem", fontWeight: "600" }}
        onClick={handleVoteButtonClick}
      >
        {buttonText}
      </LoadingButton>
    </>
  );
}

export default VoteWayButton;
