import React, { useState } from "react";

import PlayerSlider from "../../../../../Main/PlayerControls/PlayerSlider/PlayerSlider";
import PlayButton from "../../../../../Main/PlayerControls/Buttons/PlayButton";
import PauseButton from "../../../../../Main/PlayerControls/Buttons/PauseButton";

interface ModalPlayerControlsProps {
  currentlyPlaying: boolean;
  songDuration: number;
  sliderPosition: number;
  handlePlayPauseClick: (isPlaying: boolean) => void;
  handleTimeUpdate: (commitChange: boolean, newTime: number) => void;
}

function ModalPlayerControls({
  currentlyPlaying,
  songDuration,
  sliderPosition,
  handlePlayPauseClick,
  handleTimeUpdate,
}: ModalPlayerControlsProps) {
  const [isPlaying, setPlayingFlag] = useState<boolean>(currentlyPlaying);

  const clickPlayPause = () => {
    setPlayingFlag(!isPlaying);
    handlePlayPauseClick(!isPlaying);
  };

  return (
    <>
      <div className="">
        <PlayerSlider
          duration={songDuration}
          currentTime={sliderPosition}
          onTimeUpdate={(commitChange: boolean, time: number) =>
            handleTimeUpdate(commitChange, time)
          }
        />
      </div>

      <div className="flex justify-center mt-6">
        {isPlaying ? (
          <PauseButton onClick={clickPlayPause} />
        ) : (
          <PlayButton onClick={clickPlayPause} />
        )}
      </div>
    </>
  );
}

export default ModalPlayerControls;
