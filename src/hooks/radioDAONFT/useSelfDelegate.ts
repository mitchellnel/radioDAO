import { useCall, useEthers } from "@usedapp/core";
import { Contract, utils, constants } from "ethers";

function useSelfDelegate(nftABI: any, nftAddress: string): string | undefined {
  const { account } = useEthers();
  const nftInterface = new utils.Interface(nftABI);
  const nftContract = new Contract(nftAddress, nftInterface);

  const { value, error } =
    useCall({
      contract: nftContract,
      method: "delegate",
      args: [account ? account : constants.AddressZero],
    }) ?? {};

  if (error) {
    return undefined;
  }

  if (value !== undefined) return value[0];
  else return value;
}

export { useSelfDelegate };
