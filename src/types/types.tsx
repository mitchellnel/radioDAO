import { TransactionReceipt } from "@ethersproject/providers";
import { BigNumber } from "ethers";

type SuccessNotification = {
  receipt: TransactionReceipt;
  transactionName?: string | undefined;
};

type ProposalInformation = {
  id: BigNumber;
  state: number;
  proposer: string;
  description: string;
};

type ProposalVotes = {
  againstVotes: BigNumber;
  forVotes: BigNumber;
  abstainVotes: BigNumber;
};

export type { SuccessNotification, ProposalInformation, ProposalVotes };
