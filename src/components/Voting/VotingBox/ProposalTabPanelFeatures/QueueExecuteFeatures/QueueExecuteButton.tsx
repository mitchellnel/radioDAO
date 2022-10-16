import React, { useState } from "react";

import { CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { ProposalInformation } from "../../../../../types";

interface QueueExecuteButtonProps {
  proposal: ProposalInformation;
}

function QueueExecuteButton({ proposal }: QueueExecuteButtonProps) {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  // get function to queue and execute
  // TODO: create hook

  // handler for when the button is pressed
  const handleButtonClick = () => {
    console.log("Queue and Execute button clicked!");
  };

  // use transaction states to set loading button state

  return (
    <>
      <LoadingButton
        loading={btnLoading}
        loadingIndicator={<CircularProgress color="secondary" size={24} />}
        variant="contained"
        color="primary"
        sx={{ fontFamily: "Outfit", fontSize: "1.25rem", fontWeight: "600" }}
        onClick={handleButtonClick}
      >
        Queue and Execute
      </LoadingButton>
    </>
  );
}

export default QueueExecuteButton;
