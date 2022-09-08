import { useState, useEffect } from "react";

function useAudioPlayer() {
  const [playing, setPlayingFlag] = useState<boolean>();
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

    if (clickedTime && clickedTime !== currentTime) {
      audio.currentTime = clickedTime;
      setClickedTime(0);
    }

    // effect cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, [playing, clickedTime, currentTime]);

  return {
    playing,
    duration,
    currentTime,
    clickedTime,
    setPlayingFlag,
    setClickedTime,
  };
}

export default useAudioPlayer;

//     // React state listeners: update DOM on React state changes
//     playing ? audio.play() : audio.pause();

//     if (clickedTime && clickedTime !== curTime) {
//       audio.currentTime = clickedTime;
//       setClickedTime(null);
//     }

//     // effect cleanup
//     return () => {
//       audio.removeEventListener("loadeddata", setAudioData);
//       audio.removeEventListener("timeupdate", setAudioTime);
//     };
//   });

//   return {
//     curTime,
//     duration,
//     playing,
//     setPlaying,
//     setClickedTime,
//   };
// }

// export default useAudioPlayer;
