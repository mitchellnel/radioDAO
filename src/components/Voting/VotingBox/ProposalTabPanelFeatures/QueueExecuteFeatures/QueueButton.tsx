import React, { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { ProposalInformation } from "../../../../../types";
import { useQueueProposal } from "../../../../../hooks/radioDAO";

interface QueueButtonProps {
  proposal: ProposalInformation;
}

function QueueButton({ proposal }: QueueButtonProps) {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  // get function to queue and execute
  const { queueProposalState, queueProposal } = useQueueProposal(
    proposal,
    proposal.description.split("$")[1]
  );

  // handler for when the button is pressed
  const handleButtonClick = () => {
    queueProposal();
  };

  // use transaction states to set loading button state
  useEffect(() => {
    if (
      queueProposalState.status === "PendingSignature" ||
      queueProposalState.status === "Mining"
    ) {
      setBtnLoading(true);
    } else {
      setBtnLoading(false);
    }
  }, [queueProposalState]);

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
        Queue Proposal
      </LoadingButton>
    </>
  );
}

export default QueueButton;
