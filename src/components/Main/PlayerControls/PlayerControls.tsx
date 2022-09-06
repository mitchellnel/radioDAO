import React, { useState } from "react";
import theme from "../../../assets/RadioDAOTheme";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";

import { Avatar, IconButton, ThemeProvider } from "@mui/material";

function PlayerControls() {
  const [isPlaying, setPlayingFlag] = useState<boolean>(false);

  const clickPlayPause = () => {
    setPlayingFlag(!isPlaying);
  };

  const clickPrev = () => {
    console.log("Previous clicked!");
  };

  const clickNext = () => {
    console.log("Next clicked!");
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        id="controls"
        style={{
          display: "table",
          margin: "480px auto",
        }}
      >
        <IconButton aria-label="previous" color="secondary" onClick={clickPrev}>
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

        <IconButton
          aria-label="play"
          color="secondary"
          onClick={clickPlayPause}
        >
          <Avatar
            sx={{
              bgcolor: "secondary.main",
              color: "primary.main",
              height: 80,
              width: 80,
            }}
          >
            {isPlaying ? (
              <PauseIcon sx={{ fontSize: "3rem" }} />
            ) : (
              <PlayArrowIcon sx={{ fontSize: "3rem" }} />
            )}
          </Avatar>
        </IconButton>

        <IconButton aria-label="next" color="secondary" onClick={clickNext}>
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
      </div>
    </ThemeProvider>
  );
}

export default PlayerControls;
