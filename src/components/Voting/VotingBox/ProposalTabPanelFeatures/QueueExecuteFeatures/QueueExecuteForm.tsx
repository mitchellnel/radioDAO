import React from "react";

import QueueExecuteText from "./QueueExecuteText";
import QueueButton from "./QueueButton";

import { ProposalInformation } from "../../../../../types";
import ExecuteButton from "./ExecuteButton";

interface QueueExecuteFormProps {
  proposal: ProposalInformation;
}

function QueueExecuteForm({ proposal }: QueueExecuteFormProps) {
  return (
    <>
      <div className="flex flex-col">
        <QueueExecuteText />
      </div>
      <div className="flex flex-row justify-center">
        {proposal.state === 5 ? (
          <ExecuteButton proposal={proposal} />
        ) : (
          <QueueButton proposal={proposal} />
        )}
      </div>
    </>
  );
}

export default QueueExecuteForm;
