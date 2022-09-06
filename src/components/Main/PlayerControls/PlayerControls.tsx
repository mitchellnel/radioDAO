import React, { useState } from "react";
import theme from "../../../assets/RadioDAOTheme";

import { ThemeProvider } from "@mui/material";

import PlayButton from "./Buttons/PlayButton";
import PauseButton from "./Buttons/PauseButton";
import PrevButton from "./Buttons/PrevButton";
import NextButton from "./Buttons/NextButton";

interface PlayerControlsProps {
  handlePlayPauseClick: Function;
}

function PlayerControls({ handlePlayPauseClick }: PlayerControlsProps) {
  const [isPlaying, setPlayingFlag] = useState<boolean>(false);

  const clickPlayPause = () => {
    setPlayingFlag(!isPlaying);
    handlePlayPauseClick(!isPlaying);
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
        <PrevButton onClick={clickPrev} />

        {isPlaying ? (
          <PauseButton onClick={clickPlayPause} />
        ) : (
          <PlayButton onClick={clickPlayPause} />
        )}

        <NextButton onClick={clickNext} />
      </div>
    </ThemeProvider>
  );
}

export default PlayerControls;
