import React, { useState } from "react";

import PlayButton from "./Buttons/PlayButton";
import PauseButton from "./Buttons/PauseButton";
import PrevButton from "./Buttons/PrevButton";
import NextButton from "./Buttons/NextButton";
import PlayerSlider from "./PlayerSlider/PlayerSlider";

interface PlayerControlsProps {
  currentlyPlaying: boolean;
  songDuration: number;
  sliderPosition: number;
  handlePlayPauseClick: Function;
  handleTimeUpdate: Function;
}

function PlayerControls({
  currentlyPlaying,
  songDuration,
  sliderPosition,
  handlePlayPauseClick,
  handleTimeUpdate,
}: PlayerControlsProps) {
  const [isPlaying, setPlayingFlag] = useState<boolean>(currentlyPlaying);

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
    <>
      <div id="slider" style={{ margin: "16px -56px" }}>
        <PlayerSlider
          duration={songDuration}
          currentTime={sliderPosition}
          onTimeUpdate={(time: number) => handleTimeUpdate(time)}
        />
      </div>

      <div id="buttons">
        {/* TODO: remove for actual radio app */}
        <PrevButton onClick={clickPrev} />

        {/* TODO: make this a mute button for radio app */}
        {isPlaying ? (
          <PauseButton onClick={clickPlayPause} />
        ) : (
          <PlayButton onClick={clickPlayPause} />
        )}

        {/* TODO: remove for actual radio app */}
        <NextButton onClick={clickNext} />
      </div>
    </>
  );
}

export default PlayerControls;
