import { useCall } from "@usedapp/core";
import { BigNumber, Contract, utils } from "ethers";

function useGetMarketplaceFee(
  marketplaceABI: any,
  marketplaceAddress: string
): BigNumber | undefined {
  const marketplaceInterface = new utils.Interface(marketplaceABI);
  const marketplaceContract = new Contract(
    marketplaceAddress,
    marketplaceInterface
  );

  const { value, error } =
    useCall({
      contract: marketplaceContract,
      method: "getMarketplaceFee",
      args: [],
    }) ?? {};

  if (error) {
    return undefined;
  }

  return value;
}

export { useGetMarketplaceFee };
