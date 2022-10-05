import React from "react";
import CollectionNFTGrid from "./CollectionNFTGrid/CollectionNFTGrid";

function Collection() {
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
        Your Collection
      </h1>
      <CollectionNFTGrid />
    </div>
  );
}

export default Collection;
