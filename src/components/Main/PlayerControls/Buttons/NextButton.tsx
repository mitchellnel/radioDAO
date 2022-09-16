import React from "react";

import SkipNextIcon from "@mui/icons-material/SkipNext";

import { Avatar, IconButton } from "@mui/material";

interface NextButtonProps {
  onClick: Function;
}

function NextButton({ onClick }: NextButtonProps) {
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
          height: 60,
          width: 60,
        }}
      >
        <SkipNextIcon sx={{ fontSize: "2.25rem" }} />
      </Avatar>
    </IconButton>
  );
}

export default NextButton;
