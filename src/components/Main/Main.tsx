import React, { useEffect, useState } from "react";
import "./Main.css";

import DynamicAudio from "./DynamicAudio/DynamicAudio";
import PlayerArt from "./PlayerArt/PlayerArt";
import PlayerDetails from "./PlayerDetails/PlayerDetails";
import PlayerControls from "./PlayerControls/PlayerControls";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { SwitchTransition, CSSTransition } from "react-transition-group";

import songs from "../../assets/songs";
import useAudioPlayer from "../../hooks/useAudioplayer";

function Main() {
  const [sliderPosition, setSliderPosition] = useState<number>(0);
  const [isSliding, setSlidingFlag] = useState<boolean>(false);

  const [songNumber, setSongNumber] = useState<number>(0);
  const [title, setTitle] = useState<string>(songs[0].title);
  const [artist, setArtist] = useState<string>(songs[0].artist);
  const [imgSrc, setImgSrc] = useState<string>(songs[0].imgSrc);
  const [songSrc, setSongSrc] = useState<string>(songs[0].src);

  const {
    playing,
    muted,
    duration,
    currentTime,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clickedTime,
    setPlayingFlag,
    setMutedFlag,
    setClickedTime,
  } = useAudioPlayer();

  useEffect(() => {
    console.log(currentTime);

    if (!isSliding) {
      setSliderPosition(Math.round(currentTime as number));
    }
  }, [currentTime, isSliding]);

  const togglePlay = (playSongFlag: boolean): void => {
    setPlayingFlag(playSongFlag);
  };

  const prevSong = (): void => {
    setSongNumber(Math.abs((songNumber - 1) % songs.length));
  };

  const nextSong = (): void => {
    setSongNumber(Math.abs((songNumber + 1) % songs.length));
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

  const toggleMute = (muteSongFlag: boolean): void => {
    setMutedFlag(muteSongFlag);
  };

  useEffect(() => {
    console.log("songNumber: ", songNumber);
    setTitle(songs[songNumber].title);
    setArtist(songs[songNumber].artist);
    setImgSrc(songs[songNumber].imgSrc);
    setSongSrc(songs[songNumber].src);
  }, [songNumber]);

  return (
    <div className="player-div">
      <DynamicAudio songSrc={songSrc} />

      <SwitchTransition>
        <CSSTransition
          key={title}
          addEndListener={(node, done) =>
            node.addEventListener("transitionend", done, false)
          }
          classNames="fade"
        >
          <Container fluid>
            <Row>
              <Col>
                <div
                  id="art"
                  style={{ display: "table", margin: "64px auto 0 120px" }}
                >
                  <PlayerArt artSrc={imgSrc} />
                </div>
              </Col>
              <Col>
                <div
                  id="player-details-controls"
                  style={{ marginRight: "80px" }}
                >
                  <div
                    id="details"
                    style={{ display: "table", margin: "264px auto 0" }}
                  >
                    <PlayerDetails songTitle={title} artist={artist} />
                  </div>
                  <div
                    id="controls"
                    style={{
                      display: "table",
                      margin: "80px auto 0",
                    }}
                  >
                    <PlayerControls
                      currentlyPlaying={playing as boolean}
                      songDuration={Math.round(duration as number)}
                      sliderPosition={sliderPosition}
                      handlePlayPauseClick={togglePlay}
                      handleTimeUpdate={updateTime}
                      prevSong={prevSong}
                      nextSong={nextSong}
                      handleMuteClick={toggleMute}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}

export default Main;
