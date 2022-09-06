import React from "react";

import PauseIcon from "@mui/icons-material/Pause";

import { Avatar, IconButton } from "@mui/material";

interface PauseButtonProps {
  onClick: Function;
}

function PauseButton({ onClick }: PauseButtonProps) {
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
        <PauseIcon sx={{ fontSize: "3rem" }} />
      </Avatar>
    </IconButton>
  );
}

export default PauseButton;
