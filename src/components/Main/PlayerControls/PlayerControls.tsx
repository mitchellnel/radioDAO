import React, { useState } from "react";

import PlayerSlider from "./PlayerSlider/PlayerSlider";
import PlayButton from "./Buttons/PlayButton";
import PauseButton from "./Buttons/PauseButton";
import PrevButton from "./Buttons/PrevButton";
import NextButton from "./Buttons/NextButton";
import MuteButton from "./Buttons/MuteButton";
import UnmuteButton from "./Buttons/UnmuteButton";

interface PlayerControlsProps {
  currentlyPlaying: boolean;
  songDuration: number;
  sliderPosition: number;
  handlePlayPauseClick: (isPlaying: boolean) => void;
  handleTimeUpdate: (commitChange: boolean, newTime: number) => void;
  prevSong: () => void;
  nextSong: () => void;
  handleMuteClick: (isMuted: boolean) => void;
}

function PlayerControls({
  currentlyPlaying,
  songDuration,
  sliderPosition,
  handlePlayPauseClick,
  handleTimeUpdate,
  prevSong,
  nextSong,
  handleMuteClick,
}: PlayerControlsProps) {
  const [isPlaying, setPlayingFlag] = useState<boolean>(currentlyPlaying);
  const [isMuted, setMutedFlag] = useState<boolean>(false);

  const clickPlayPause = () => {
    setPlayingFlag(!isPlaying);
    handlePlayPauseClick(!isPlaying);
  };

  const clickPrev = () => {
    prevSong();
  };

  const clickNext = () => {
    nextSong();
  };

  const clickMute = () => {
    setMutedFlag(!isMuted);
    handleMuteClick(!isMuted);
  };

  return (
    <>
      <div id="slider" style={{ margin: "16px -56px" }}>
        <PlayerSlider
          duration={songDuration}
          currentTime={sliderPosition}
          onTimeUpdate={(commitChange: boolean, time: number) =>
            handleTimeUpdate(commitChange, time)
          }
        />
      </div>

      <div id="control-buttons">
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

      <div id="mute-button" className="mt-3">
        {isMuted ? (
          <UnmuteButton onClick={clickMute} />
        ) : (
          <MuteButton onClick={clickMute} />
        )}
      </div>
    </>
  );
}

export default PlayerControls;
