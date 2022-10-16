import React from "react";

import { Box, Typography } from "@mui/material";
import VotingTabs from "./VotingTabs";

function VotingBox() {
  return (
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
  );
}

export default VotingBox;
