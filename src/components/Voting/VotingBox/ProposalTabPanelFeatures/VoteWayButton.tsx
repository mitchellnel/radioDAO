import React, { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface VoteWayButtonProps {
  voteWay: string;
}

function VoteWayButton({ voteWay }: VoteWayButtonProps) {
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
  // TODO

  // handler for when the vote button is pressed
  const handleVoteButtonClick = async () => {
    console.log("Casting a", voteWay, "vote!");
  };

  // use transaction states to set vote button states

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
