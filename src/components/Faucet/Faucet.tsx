import React from "react";
import "./Faucet.css";

import { Box, Container } from "@mui/material";

function Faucet() {
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
            width: "100%",
          }}
        >
          <h1>The facuet will be here</h1>
        </Box>
      </Container>
    </div>
  );
}

export default Faucet;
