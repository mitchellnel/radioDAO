import React, { useEffect, useState } from "react";

import ModalPlayerControls from "./ModalPlayerControls";
import useAudioPlayer from "../../../../hooks/useAudioplayer";
import DynamicAudio from "../../../Main/DynamicAudio/DynamicAudio";

interface ModalPlayerProps {
  audioURI: string;
}

function ModalPlayer({ audioURI }: ModalPlayerProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(0);
  const [isSliding, setSlidingFlag] = useState<boolean>(false);

  const {
    playing,
    duration,
    currentTime,
    setPlayingFlag,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setMutedFlag,
    setClickedTime,
  } = useAudioPlayer();

  useEffect(() => {
    if (!isSliding) {
      setSliderPosition(Math.round(currentTime as number));
    }
  }, [isSliding, currentTime]);

  const togglePlay = (playSongFlag: boolean): void => {
    setPlayingFlag(playSongFlag);
  };

  const updateTime = (commitChange: boolean, newTime: number): void => {
    if (commitChange) {
      setClickedTime(newTime);
      setSlidingFlag(false);
    } else {
      setSlidingFlag(true);
      setSliderPosition(Math.round(newTime));
    }
  };

  return (
    <div className="">
      <DynamicAudio songSrc={audioURI} />
      <ModalPlayerControls
        currentlyPlaying={playing as boolean}
        songDuration={Math.round(duration as number)}
        sliderPosition={sliderPosition}
        handlePlayPauseClick={togglePlay}
        handleTimeUpdate={updateTime}
      />
    </div>
  );
}

export default ModalPlayer;
