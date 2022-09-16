import React from "react";
import "./PlayerDetails.css";

interface PlayerDetailsProps {
  songTitle: string;
  artist: string;
}

function PlayerDetails({ songTitle, artist }: PlayerDetailsProps) {
  return (
    <div>
      <h1 id="song-title">{songTitle}</h1>

      {/* TODO: get a lower weight Outfit font for h2 */}
      <h2 id="artist" style={{ marginTop: "24px" }}>
        {artist}
      </h2>
    </div>
  );
}

export default PlayerDetails;
