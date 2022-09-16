import React from "react";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { Avatar, IconButton } from "@mui/material";

interface PlayButtonProps {
  onClick: () => void;
}

function PlayButton({ onClick }: PlayButtonProps) {
  return (
    <IconButton
      aria-label="play"
      color="secondary"
      onClick={() => onClick()}
      sx={{ "&:hover": { backgroundColor: "rgb(232, 189, 48, 0.4)" } }}
    >
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
