import React from "react";

interface PlayerArtProps {
  artSrc: string;
}

function PlayerArt({ artSrc }: PlayerArtProps) {
  return (
    <>
      {/* relative paths don't appear to work for images in create-react-app*/}
      <img
        src="songs/imgs/Campfire.jpg"
        alt="song art"
        height="750"
        width="750"
      />
    </>
  );
}

export default PlayerArt;
