import React from "react";

import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

import { Avatar, IconButton } from "@mui/material";

interface PrevButtonProps {
  onClick: Function;
}

function PrevButton({ onClick }: PrevButtonProps) {
  return (
    <IconButton
      aria-label="previous"
      color="secondary"
      onClick={() => onClick()}
    >
      <Avatar
        sx={{
          bgcolor: "secondary.main",
          color: "primary.main",
          height: 60,
          width: 60,
        }}
      >
        <SkipPreviousIcon sx={{ fontSize: "2.25rem" }} />
      </Avatar>
    </IconButton>
  );
}

export default PrevButton;
