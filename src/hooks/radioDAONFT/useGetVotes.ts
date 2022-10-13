import { useCall } from "@usedapp/core";
import { BigNumber, Contract, utils } from "ethers";

function useGetVotes(
  nftABI: any,
  nftAddress: string,
  userAddress: string
): BigNumber | undefined {
  const nftInterface = new utils.Interface(nftABI);
  const nftContract = new Contract(nftAddress, nftInterface);

  const { value, error } =
    useCall({
      contract: nftContract,
      method: "getVotes",
      args: [userAddress],
    }) ?? {};

  if (error) {
    return undefined;
  }

  return value;
}

export { useGetVotes };
