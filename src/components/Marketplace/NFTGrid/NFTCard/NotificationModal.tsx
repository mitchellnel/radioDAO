import React, { useEffect, useState } from "react";

import { Modal, Box, Typography, IconButton, Avatar } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { SuccessNotification } from "../../../../types";

const modalBoxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "primary.light",
  border: "2px solid #e8bd30",
  boxShadow: 24,
  p: 2,
  outline: "none",
};

interface NotificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  successNotification: SuccessNotification;
}

function ListingModal({
  isVisible,
  onClose,
  successNotification,
}: NotificationModalProps) {
  const [txnHash, setTxnHash] = useState<string>("");
  const [txnName, setTxnName] = useState<string>("");
  useEffect(() => {
    if (successNotification !== undefined) {
      setTxnHash(successNotification.receipt.transactionHash);
      setTxnName(successNotification.transactionName as string);
    }
  }, [successNotification]);
  return (
    <Modal
      open={isVisible}
      onClose={onClose}
      aria-labelledby="modal-listing-modal"
      aria-describedby="modal-listing-modal-description"
    >
      <Box sx={modalBoxStyle}>
        <div
          className="flex flex-row items-center"
          style={{ justifyContent: "space-between" }}
        >
          <div className="flex flex-col">
            <Typography
              id="modal-listing-modal"
              variant="h2"
              component="h2"
              color="primary.contrastText"
              fontFamily="Outfit"
              fontWeight="600"
            >
              Success!
            </Typography>
            <p>{txnHash}</p>
            <p>{txnName}</p>
          </div>
          <IconButton
            aria-label="close-modal"
            color="secondary"
            onClick={onClose}
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
        </div>
      </Box>
    </Modal>
  );
}

export default ListingModal;
