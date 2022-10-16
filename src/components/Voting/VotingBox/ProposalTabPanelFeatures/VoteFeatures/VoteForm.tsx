import React from "react";

import VoteWayButton from "./VoteWayButton";
import VoteWayText from "./VoteWayText";

import { ProposalInformation, ProposalVotes } from "../../../../../types";

interface VoteFormProps {
  proposal: ProposalInformation;
  proposalVotes: ProposalVotes | undefined;
}

function VoteForm({ proposal, proposalVotes }: VoteFormProps) {
  return (
    <>
      <div className="flex flex-col justify-center">
        <VoteWayText
          voteWay="FOR"
          votes={proposalVotes ? proposalVotes["forVotes"].toString() : "0"}
        />

        <VoteWayText
          voteWay="AGAINST"
          votes={proposalVotes ? proposalVotes["againstVotes"].toString() : "0"}
        />

        <VoteWayText
          voteWay="ABSTAINING"
          votes={proposalVotes ? proposalVotes["abstainVotes"].toString() : "0"}
        />
      </div>
      <div className="flex flex-row justify-center gap-4">
        <VoteWayButton proposal={proposal} voteWay="FOR" />
        <VoteWayButton proposal={proposal} voteWay="AGAINST" />
        <VoteWayButton proposal={proposal} voteWay="ABSTAIN" />
      </div>
    </>
  );
}

export default VoteForm;
