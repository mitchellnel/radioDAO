import React from "react";
import "./Faucet.css";

import { Box, Container } from "@mui/material";
import { useEthers } from "@usedapp/core";

import ContractInfo from "../../constants/ContractAddresses.json";

import NELBalance from "./NELBalance/NELBalance";
import RequestFunds from "./RequestFunds/RequestFunds";

function Faucet() {
  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  const nelAddress = ContractInfo[networkName]["nelthereum"];

  return (
    <div>
      <Container maxWidth="lg" sx={{ marginTop: "48px", textAlign: "left" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "600" }}>
          Nelthereum Faucet
        </h1>
        <Box
          className="faucet-box"
          sx={{
            backgroundColor: "#ebe7dd",
            borderRadius: "25px",
            display: "flex",
            flexDirection: "column",
            height: "325px",
            marginTop: "16px",
            opacity: "90%",
            alignItems: "center",
            width: "100%",
            paddingTop: "56px",
          }}
        >
          <NELBalance nelAddress={nelAddress} />
          <RequestFunds nelAddress={nelAddress} />
        </Box>
      </Container>
    </div>
  );
}

export default Faucet;
