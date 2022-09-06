import React from "react";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { Avatar, IconButton } from "@mui/material";

interface PlayButtonProps {
  onClick: Function;
}

function PlayButton({ onClick }: PlayButtonProps) {
  return (
    <IconButton aria-label="play" color="secondary" onClick={() => onClick()}>
      <Avatar
        sx={{
          bgcolor: "secondary.main",
          color: "primary.main",
          height: 80,
          width: 80,
        }}
      >
        <PlayArrowIcon sx={{ fontSize: "3rem" }} />
      </Avatar>
    </IconButton>
  );
}

export default PlayButton;
