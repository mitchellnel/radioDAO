import React, { useEffect, useState } from "react";

import { useNotifications } from "@usedapp/core";
import { Box, Typography } from "@mui/material";

import VotingTabs from "./VotingTabs";
import NotificationModal from "../../shared/NotificationModal/NotificationModal";

import { SuccessNotification } from "../../../types";

function VotingBox() {
  // display a success notification if the user executes a proposal successfully
  const { notifications } = useNotifications();
  const [successNotification, setSuccessNotification] =
    useState<SuccessNotification>();
  const [showNotification, setShowNotificationFlag] = useState<boolean>(false);
  const hideNotification = () => setShowNotificationFlag(false);

  useEffect(() => {
    notifications.every((notification) => {
      if (
        notification.type === "transactionSucceed" &&
        notification.transactionName === "Execute proposal on Radio"
      ) {
        setShowNotificationFlag(true);
        setSuccessNotification(notification);
        return false;
      }

      return true;
    });
  }, [notifications]);

  return (
    <>
      {showNotification ? (
        <NotificationModal
          isVisible={showNotification}
          onClose={hideNotification}
          successNotification={successNotification as SuccessNotification}
        />
      ) : (
        <></>
      )}
      <div>
        <Box
          className="proposals-box"
          sx={{
            backgroundColor: "#ebe7dd",
            borderRadius: "25px",
            display: "flex",
            flexDirection: "column",
            height: "750px",
            marginTop: "16px",
            opacity: "90%",
            alignItems: "center",
            width: "100%",
            paddingTop: "30px",
          }}
        >
          <Typography
            id="proposals-box-title"
            variant="h2"
            component="h2"
            color="primary.main"
            fontFamily="Outfit"
            fontWeight="600"
            fontSize="3rem"
            sx={{ marginBottom: "20px" }}
          >
            Song Proposals
          </Typography>

          <VotingTabs />
        </Box>
      </div>
    </>
  );
}

export default VotingBox;
