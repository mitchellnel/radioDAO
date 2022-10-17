import React, { useState } from "react";

import RadioSlider from "./PlayerSlider/RadioSlider";
import MuteButton from "./Buttons/MuteButton";
import UnmuteButton from "./Buttons/UnmuteButton";

interface PlayerControlsProps {
  currentlyPlaying: boolean;
  songDuration: number;
  sliderPosition: number;
  handleMuteClick: (isMuted: boolean) => void;
}

function PlayerControls({
  songDuration,
  sliderPosition,
  handleMuteClick,
}: PlayerControlsProps) {
  const [isMuted, setMutedFlag] = useState<boolean>(false);

  const clickMute = () => {
    setMutedFlag(!isMuted);
    handleMuteClick(!isMuted);
  };

  return (
    <>
      <div id="slider" style={{ margin: "16px -150px" }}>
        <RadioSlider duration={songDuration} currentTime={sliderPosition} />
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
