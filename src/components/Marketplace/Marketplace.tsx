import React from "react";

import NFTGrid from "./NFTGrid/NFTGrid";

function Marketplace() {
  return (
    <div className="container mx-auto">
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "600",
          marginTop: "32px",
          textAlign: "left",
        }}
      >
        RadioDAONFT Marketplace
      </h1>
      <NFTGrid />
    </div>
  );
}

export default Marketplace;
