import { useState, useEffect } from "react";

function useAudioPlayer() {
  const [playing, setPlayingFlag] = useState<boolean>();
  const [muted, setMutedFlag] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>();
  const [currentTime, setCurrentTime] = useState<number>();
  const [clickedTime, setClickedTime] = useState<number>();

  useEffect(() => {
    const audio_optional = document.querySelector<HTMLAudioElement>("audio");

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const audio: HTMLAudioElement = audio_optional!;

    // state setter wrappers
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    // DOM listeners -- update React state on DOM events
    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);

    // React state listeners -- update DOM on React state changes
    playing ? audio.play() : audio.pause();

    muted ? (audio.muted = true) : (audio.muted = false);

    if (clickedTime && clickedTime !== currentTime) {
      audio.currentTime = clickedTime;
      setClickedTime(0);
    }

    // effect cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, [playing, muted, clickedTime, currentTime]);

  return {
    playing,
    muted,
    duration,
    currentTime,
    clickedTime,
    setPlayingFlag,
    setMutedFlag,
    setClickedTime,
  };
}

export default useAudioPlayer;
