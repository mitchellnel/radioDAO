import { useEffect, useState } from "react";

import { ethers, Contract, BigNumber } from "ethers";
import { useEthers } from "@usedapp/core";

function useGetMyNFTs(nftABI: any, nftAddress: string): number[] | undefined {
  const { account } = useEthers();
  const [contract, setContract] = useState<Contract>();
  const [myNFTs, setMyNFTs] = useState<number[]>();

  useEffect(() => {
    const loadContract = async (signer: ethers.providers.JsonRpcSigner) => {
      // Get deployed copy of music nft marketplace contract
      const contract = new ethers.Contract(nftAddress, nftABI, signer);
      setContract(contract);
    };

    const web3Handler = async () => {
      if (window.ethereum) {
        // Get provider from Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Get signer
        const signer = provider.getSigner();
        loadContract(signer);
      }
    };

    web3Handler();
  }, [nftABI, nftAddress]);

  const getMyNFTs = async () => {
    if (contract) {
      setMyNFTs(
        (await contract.getMyNFTs()).map((tokenID_BigNumber: BigNumber) => {
          return tokenID_BigNumber.toNumber();
        })
      );
    }
  };

  useEffect(() => {
    getMyNFTs();
  }, [account, contract]);

  return myNFTs;
}

export { useGetMyNFTs };
