import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";

import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.min.css";
import { Config, DAppProvider, Goerli, Localhost } from "@usedapp/core";
import { AlchemyProvider } from "@ethersproject/providers";

const GOERLI_PROVIDER = new AlchemyProvider(
  "goerli",
  process.env.REACT_APP_GOERLI_API_KEY
);

const config: Config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: GOERLI_PROVIDER,
    // [Localhost.chainId]: "http://127.0.0.1:8545",
  },
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
