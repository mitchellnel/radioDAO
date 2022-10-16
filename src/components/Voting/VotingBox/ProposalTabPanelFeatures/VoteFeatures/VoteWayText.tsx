import React, { useEffect, useState } from "react";

import { Typography } from "@mui/material";

interface VoteWayTextProps {
  voteWay: string;
  votes: string;
}

function VoteWayText({ voteWay, votes }: VoteWayTextProps) {
  const [textColor, setTextColor] = useState<string>("");

  useEffect(() => {
    if (voteWay === "FOR") {
      setTextColor("#3f7a32");
    } else if (voteWay === "AGAINST") {
      setTextColor("#df3633");
    } else if (voteWay === "ABSTAINING") {
      setTextColor("#9867c5");
    } else {
      setTextColor("black");
    }
  }, [voteWay]);

  return (
    <>
      <Typography
        id={"votes-text-" + voteWay.toLowerCase()}
        variant="h5"
        component="h5"
        color={textColor}
        fontFamily="Outfit"
        fontSize="2rem"
        fontWeight="300"
      >
        {votes} votes {voteWay}
      </Typography>
    </>
  );
}

export default VoteWayText;
