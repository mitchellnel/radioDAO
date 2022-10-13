import React, { useState, useEffect } from "react";

import { Contract } from "ethers";
import { Modal, Box, Typography, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useSelfDelegate } from "../../hooks/radioDAONFT";

const modalBoxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: 600,
  width: 1500,
  bgcolor: "primary.light",
  border: "2px solid #e8bd30",
  boxShadow: 24,
  p: 2,
  outline: "none",
};

interface NotRegisteredModalProps {
  isVisible: boolean;
  nftContract: Contract;
}

function NotRegisteredModal({
  isVisible,
  nftContract,
}: NotRegisteredModalProps) {
  const [registerBtnLoading, setRegisterBtnLoading] = useState<boolean>(false);

  // get function to self delegate voting power
  const { selfDelegateState, selfDelegate } = useSelfDelegate(nftContract);

  const handleRegisterButtonClick = () => {
    selfDelegate();
  };

  // use transaction state to set loading button state
  useEffect(() => {
    if (
      selfDelegateState.status === "PendingSignature" ||
      selfDelegateState.status === "Mining"
    ) {
      setRegisterBtnLoading(true);
    } else {
      setRegisterBtnLoading(false);
    }
  }, [selfDelegateState]);

  return (
    <Modal open={isVisible}>
      <Box sx={modalBoxStyle}>
        <div className="flex flex-col gap-y-4 text-center">
          <Typography
            id="modal-notification-modal-success"
            variant="h2"
            component="h2"
            color="primary.contrastText"
            fontFamily="Outfit"
            fontWeight="600"
          >
            You are not registered to vote in the RadioDAO!
          </Typography>
          <Typography
            id="modal-notification-modal-display-txn-hash"
            variant="h3"
            component="h3"
            color="primary.contrastText"
            fontFamily="Outfit"
            fontWeight="600"
          >
            Click the button below to register to vote.
          </Typography>
          <div className="mt-20 h-20">
            <LoadingButton
              loading={registerBtnLoading}
              loadingIndicator={
                <CircularProgress color="secondary" size={88} />
              }
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                fontFamily: "Outfit",
                fontSize: "4rem",
                fontWeight: "600",
              }}
              onClick={() => handleRegisterButtonClick()}
            >
              Register to Vote
            </LoadingButton>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default NotRegisteredModal;
