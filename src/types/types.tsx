import { TransactionReceipt } from "@ethersproject/providers";

type SuccessNotification = {
  receipt: TransactionReceipt;
  transactionName?: string | undefined;
};

export type { SuccessNotification };
