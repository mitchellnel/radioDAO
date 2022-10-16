import React from "react";

import { Typography } from "@mui/material";

import { ProposalInformation } from "../../../../../types";

interface QueueExecuteTextProps {
  proposal: ProposalInformation;
}

function QueueExecuteText({ proposal }: QueueExecuteTextProps) {
  return (
    <>
      <Typography
        className="self-center"
        id={"queue-execute-text"}
        variant="h5"
        component="h5"
        color="primary"
        fontFamily="Outfit"
        fontSize="2rem"
        fontWeight="300"
        sx={{ width: "400px" }}
      >
        This proposal has passed. Click the button below to{" "}
        {proposal.state === 4 ? "Queue" : "Execute"} it.
      </Typography>
    </>
  );
}

export default QueueExecuteText;
