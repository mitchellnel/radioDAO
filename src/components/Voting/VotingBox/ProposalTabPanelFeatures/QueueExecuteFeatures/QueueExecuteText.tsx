import React from "react";

import { Typography } from "@mui/material";

function QueueExecuteText() {
  return (
    <>
      <Typography
        className="self-center"
        id={"queue-execute-text"}
        variant="h5"
        component="h5"
        color="primary"
        fontFamily="Outfit"
        fontSize="2rem"
        fontWeight="300"
        sx={{ width: "400px" }}
      >
        This proposal has passed. Click the button below to Queue and Execute
        it.
      </Typography>
    </>
  );
}

export default QueueExecuteText;
