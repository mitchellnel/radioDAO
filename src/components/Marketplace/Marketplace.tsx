import React from "react";

import MarketplaceNFTGrid from "./MarketplaceNFTGrid/MarketplaceNFTGrid";

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
      <MarketplaceNFTGrid />
    </div>
  );
}

export default Marketplace;
