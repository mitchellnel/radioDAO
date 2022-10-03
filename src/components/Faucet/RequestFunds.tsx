import React from "react";

import LoadingButton from "@mui/lab/LoadingButton";

import NelthereumABI from "../../constants/NelthereumABI.json";
import { Contract, utils } from "ethers";
import { useContractFunction } from "@usedapp/core";

interface RequestFundsProps {
  nelAddress: string;
}

function RequestFunds({ nelAddress }: RequestFundsProps) {
  const nelABI = NelthereumABI["abi"];
  const nelInterface = new utils.Interface(nelABI);
  const nelContract = new Contract(nelAddress, nelInterface);

  const { state, send } = useContractFunction(nelContract, "requestTokens", {
    transactionName: "NEL Faucet Request",
  });
  const { status } = state;
  const requestFaucetTokens = () => {
    send();
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <LoadingButton
        loading={status === "PendingSignature" || status === "Mining"}
        size="large"
        variant="contained"
        onClick={requestFaucetTokens}
        sx={{ fontSize: "1.2rem", fontFamily: "Outfit", fontWeight: "600" }}
      >
        Request NEL
      </LoadingButton>
    </div>
  );
}

export default RequestFunds;
