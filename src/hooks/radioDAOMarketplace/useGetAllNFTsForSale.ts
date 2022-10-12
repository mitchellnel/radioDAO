import { useCall } from "@usedapp/core";
import { Contract, utils } from "ethers";
import { MarketItem } from "../../../scripts/types";

function useGetAllNFTsForSale(
  marketplaceABI: any,
  marketplaceAddress: string
): MarketItem[] | undefined {
  const marketplaceInterface = new utils.Interface(marketplaceABI);
  const marketplaceContract = new Contract(
    marketplaceAddress,
    marketplaceInterface
  );

  const { value, error } =
    useCall({
      contract: marketplaceContract,
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
