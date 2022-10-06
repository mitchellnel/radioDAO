import { BigNumber } from "ethers";

type RadioDAONFTMetadata = {
  title: string;
  artist: string;
  image: string;
  audio: string;
};

type MarketItem = {
  tokenID: BigNumber;
  seller: string;
  price: BigNumber;
  forSale: boolean;
};

export type { RadioDAONFTMetadata, MarketItem };
