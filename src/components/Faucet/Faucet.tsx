import React from "react";
import "./Faucet.css";

import { Box, Container } from "@mui/material";
import { useEthers, useTokenBalance } from "@usedapp/core";

import ContractInfo from "../../constants/ContractAddress.json";
import { formatUnits } from "ethers/lib/utils";

function Faucet() {
  const { chainId, account } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  const NELAddr = ContractInfo[networkName]["nelthereum"];

  const NELBalance = useTokenBalance(NELAddr, account);
  const formattedNELBalance: number = NELBalance
    ? parseFloat(formatUnits(NELBalance, 18))
    : 0;

  return (
    <div>
      <Container maxWidth="lg" sx={{ marginTop: "48px", textAlign: "left" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "600" }}>
          Nelthereum Faucet
        </h1>
        <Box
          sx={{
            backgroundColor: "#ebe7dd",
            borderRadius: "25px",
            height: "325px",
            marginTop: "16px",
            opacity: "90%",
            textAlign: "center",
            width: "100%",
          }}
        >
          <h1>You currently have {formattedNELBalance} NEL</h1>
        </Box>
      </Container>
    </div>
  );
}

export default Faucet;
