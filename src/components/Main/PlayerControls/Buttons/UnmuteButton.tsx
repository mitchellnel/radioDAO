import React from "react";

import VolumeUpIcon from "@mui/icons-material/VolumeUp";

import { Avatar, IconButton } from "@mui/material";

interface UnmuteButtonProps {
  onClick: () => void;
}

function UnmuteButton({ onClick }: UnmuteButtonProps) {
  return (
    <IconButton
      aria-label="previous"
      color="secondary"
      onClick={() => onClick()}
      sx={{ "&:hover": { backgroundColor: "rgb(232, 189, 48, 0.4)" } }}
    >
      <Avatar
        sx={{
          bgcolor: "secondary.main",
          color: "primary.main",
          height: 40,
          width: 40,
        }}
      >
        <VolumeUpIcon sx={{ fontSize: "1.5rem" }} />
      </Avatar>
    </IconButton>
  );
}

export default UnmuteButton;
