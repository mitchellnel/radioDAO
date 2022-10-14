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

export type { SuccessNotification, ProposalInformation };
