import React from "react";

import { IconButton, Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ModalCloseButtonProps {
  onClick: () => void;
}

function ModalCloseButton({ onClick }: ModalCloseButtonProps) {
  return (
    <IconButton
      aria-label="close-modal"
      color="secondary"
      onClick={onClick}
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
        <CloseIcon sx={{ fontSize: "1.5rem" }} />
      </Avatar>
    </IconButton>
  );
}

export default ModalCloseButton;
