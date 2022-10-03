import React from "react";
import "./Faucet.css";

import { useEthers, useTokenBalance } from "@usedapp/core";

import { formatUnits } from "ethers/lib/utils";

interface NELBalanceProps {
  nelAddress: string;
}

function NELBalance({ nelAddress }: NELBalanceProps) {
  const { account } = useEthers();

  const NELBalance = useTokenBalance(nelAddress, account);
  const formattedNELBalance: number = NELBalance
    ? parseFloat(formatUnits(NELBalance, 18))
    : 0;

  return (
    <div style={{ fontFamily: "Outfit", fontSize: "2rem", fontWeight: "600" }}>
      You have {formattedNELBalance} NEL
    </div>
  );
}

export default NELBalance;
