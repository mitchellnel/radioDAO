import { useCall } from "@usedapp/core";
import { Contract, utils } from "ethers";
import { MarketItem } from "../../../scripts/types";

function useGetAllNFTsForSale(
  nftABI: any,
  nftAddress: string
): MarketItem[] | undefined {
  const nftInterface = new utils.Interface(nftABI);
  const nftContract = new Contract(nftAddress, nftInterface);

  const { value, error } =
    useCall({
      contract: nftContract,
      method: "getAllNFTsForSale",
      args: [],
    }) ?? {};

  if (error) {
    return undefined;
  }

  if (value !== undefined) return value[0];
  else return value;
}

export { useGetAllNFTsForSale };
