import React from "react";

import VolumeOffIcon from "@mui/icons-material/VolumeOff";

import { Avatar, IconButton } from "@mui/material";

interface MuteButtonProps {
  onClick: () => void;
}

function MuteButton({ onClick }: MuteButtonProps) {
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
        <VolumeOffIcon sx={{ fontSize: "1.5rem" }} />
      </Avatar>
    </IconButton>
  );
}

export default MuteButton;
