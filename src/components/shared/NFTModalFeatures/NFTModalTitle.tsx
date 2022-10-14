import React from "react";

import { Typography } from "@mui/material";

interface NFTModalTitleProps {
  songTitle: string | undefined;
  songArtist: string | undefined;
}

function NFTModalTitle({ songTitle, songArtist }: NFTModalTitleProps) {
  return (
    <div className="flex flex-row items-end">
      <Typography
        id="modal-listing-modal"
        variant="h2"
        component="h2"
        color="primary.contrastText"
        fontFamily="Outfit"
        fontWeight="600"
      >
        {songTitle}
      </Typography>
      <Typography
        id="modal-listing-modal-description"
        variant="h4"
        component="h4"
        color="primary.contrastText"
        fontFamily="Outfit"
        fontWeight="600"
        sx={{
          marginBottom: "5px",
        }}
      >
        <div className="flex flex-row ml-3">{"by " + songArtist}</div>
      </Typography>
    </div>
  );
}

export default NFTModalTitle;
