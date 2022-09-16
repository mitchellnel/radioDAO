import React, { useEffect, useState } from "react";

interface DynamicAudioProps {
  songSrc: string;
}

function DynamicAudio({ songSrc }: DynamicAudioProps) {
  const [currentSong, setCurrentSong] = useState<string>("");

  useEffect(() => {
    const audio_optional = document.querySelector<HTMLAudioElement>("audio");

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const audio: HTMLAudioElement = audio_optional!;

    const source_optional = document.querySelector<HTMLSourceElement>("source");

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const source: HTMLSourceElement = source_optional!;

    if (currentSong !== songSrc) {
      setCurrentSong(songSrc);
      source.src = songSrc;
      audio.load();
    }
  }, [songSrc, currentSong]);
  return (
    <>
      <audio>
        <source src={""} />
        Your browser does not support the <code>audio</code> element.
      </audio>
    </>
  );
}

export default DynamicAudio;
