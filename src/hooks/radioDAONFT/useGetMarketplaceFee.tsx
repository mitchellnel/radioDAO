import { useCall } from "@usedapp/core";
import { BigNumber, Contract, utils } from "ethers";

function useGetMarketplaceFee(
  nftABI: any,
  nftAddress: string
): BigNumber | undefined {
  const nftInterface = new utils.Interface(nftABI);
  const nftContract = new Contract(nftAddress, nftInterface);

  const { value, error } =
    useCall({
      contract: nftContract,
      method: "getMarketplaceFee",
      args: [],
    }) ?? {};

  if (error) {
    return undefined;
  }

  return value;
}

export { useGetMarketplaceFee };
