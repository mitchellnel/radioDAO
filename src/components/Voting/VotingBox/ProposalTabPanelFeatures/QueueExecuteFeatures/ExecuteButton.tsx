import React, { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { ProposalInformation } from "../../../../../types";
import { useExecuteProposal } from "../../../../../hooks/radioDAO";

interface ExecuteButtonProps {
  proposal: ProposalInformation;
}

function ExecuteButton({ proposal }: ExecuteButtonProps) {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  // get function to queue and execute
  const { executeProposalState, executeProposal } = useExecuteProposal(
    proposal,
    proposal.description.split("$")[1]
  );

  // handler for when the button is pressed
  const handleButtonClick = () => {
    executeProposal();
  };

  // use transaction states to set loading button state
  useEffect(() => {
    if (
      executeProposalState.status === "PendingSignature" ||
      executeProposalState.status === "Mining"
    ) {
      setBtnLoading(true);
    } else {
      setBtnLoading(false);
    }
  }, [executeProposalState]);

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
        Execute Proposal
      </LoadingButton>
    </>
  );
}

export default ExecuteButton;
