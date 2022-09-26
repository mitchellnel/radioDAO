export interface NetworkConfigItem {
  name: string;
  gasLane?: string;
  callbackGasLimit?: string;
  mintFee?: string;
  ethUsdPriceFeed?: string;
  blockConfirmations?: number;
}

export interface NetworkConfigInfo {
  [key: string]: NetworkConfigItem;
}

export const networkConfig: NetworkConfigInfo = {
  localhost: {
    name: "localhost",
    ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
    mintFee: "10000000000000000", // 0.01 ETH
    callbackGasLimit: "500000", // 500,000 gas
  },
  mainnet: {
    name: "mainnet",
  },
  goerli: {
    name: "goerli",
  },
};

export const developmentChains = ["hardhat", "localhost"];
export const ETH_DECIMALS = "18";
