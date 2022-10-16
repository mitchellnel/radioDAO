import React from "react";

interface NFTModalArtProps {
  imageURI: string | undefined;
}

function NFTModalArt({ imageURI }: NFTModalArtProps) {
  return (
    <div className="basis-1/2 pl-6">
      <img
        className=""
        src={imageURI}
        alt="nft song art"
        height="400"
        width="400"
        style={{ marginRight: "200px" }}
      />
    </div>
  );
}

export default NFTModalArt;
