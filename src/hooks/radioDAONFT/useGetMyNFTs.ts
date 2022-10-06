import { useCall, useEthers } from "@usedapp/core";
import { Contract, utils, BigNumber, constants } from "ethers";

function useGetMyNFTs(
  nftABI: any,
  nftAddress: string
): BigNumber[] | undefined {
  const { account } = useEthers();
  const nftInterface = new utils.Interface(nftABI);
  const nftContract = new Contract(nftAddress, nftInterface);

  const { value, error } =
    useCall({
      contract: nftContract,
      method: "getUserNFTs",
      args: [account ? account : constants.AddressZero],
    }) ?? {};

  if (error) {
    return undefined;
  }

  if (value !== undefined) return value[0];
  else return value;
}

export { useGetMyNFTs };
