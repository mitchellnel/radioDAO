import React, { useState } from "react";

import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

function VotingBox() {
  const [tabValue, setTabValue] = useState<string>("1");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Box
        className="proposals-box"
        sx={{
          backgroundColor: "#ebe7dd",
          borderRadius: "25px",
          display: "flex",
          flexDirection: "column",
          height: "700px",
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

        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", width: "90%" }}>
            <TabList
              onChange={handleTabChange}
              aria-label="lab API tabs example"
              centered
            >
              <Tab label="Campfire" value="1" />
              <Tab label="Sandcastle" value="2" />
              <Tab label="Summer Nights" value="3" />
            </TabList>
          </Box>
        </TabContext>
      </Box>
    </div>
  );
}

export default VotingBox;
