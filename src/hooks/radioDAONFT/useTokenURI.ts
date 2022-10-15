import { useCall } from "@usedapp/core";
import { Contract, utils } from "ethers";

function useTokenURI(
  nftABI: any,
  nftAddress: string,
  tokenID: number
): string | undefined {
  const nftInterface = new utils.Interface(nftABI);
  const nftContract = new Contract(nftAddress, nftInterface);

  const { value, error } =
    useCall({
      contract: nftContract,
      method: "tokenURI",
      args: [tokenID],
    }) ?? {};

  if (error) {
    return undefined;
  }

  if (error) {
    return undefined;
  }

  if (value !== undefined) return value[0];
  else return value;
}

export { useTokenURI };
