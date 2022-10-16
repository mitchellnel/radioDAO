import React from "react";

import QueueExecuteButton from "./QueueExecuteButton";

import { ProposalInformation } from "../../../../../types";
import QueueExecuteText from "./QueueExecuteText";

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
        <QueueExecuteButton proposal={proposal} />
      </div>
    </>
  );
}

export default QueueExecuteForm;
