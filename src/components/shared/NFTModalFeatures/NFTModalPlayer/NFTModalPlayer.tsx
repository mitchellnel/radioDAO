import React, { useEffect, useState } from "react";

import NFTModalPlayerControls from "./NFTModalPlayerControls";
import useAudioPlayer from "../../../../hooks/useAudioplayer";
import DynamicAudio from "../../../Main/DynamicAudio/DynamicAudio";

interface NFTModalPlayerProps {
  audioURI: string;
}

function NFTModalPlayer({ audioURI }: NFTModalPlayerProps) {
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
      <NFTModalPlayerControls
        currentlyPlaying={playing as boolean}
        songDuration={Math.round(duration as number)}
        sliderPosition={sliderPosition}
        handlePlayPauseClick={togglePlay}
        handleTimeUpdate={updateTime}
      />
    </div>
  );
}

export default NFTModalPlayer;
