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

  const [songNumber, setSongNumber] = useState<number>(0);
  const [title, setTitle] = useState<string>(songs[0].title);
  const [artist, setArtist] = useState<string>(songs[0].artist);
  const [imgSrc, setImgSrc] = useState<string>(songs[0].imgSrc);
  const [songSrc, setSongSrc] = useState<string>(songs[0].src);

  const {
    playing,
    duration,
    currentTime,
    clickedTime,
    setPlayingFlag,
    setClickedTime,
  } = useAudioPlayer();

  useEffect(() => {
    console.log(currentTime);
    setSliderPosition(Math.round(currentTime as number));
  }, [currentTime]);

  const togglePlay = (playSongFlag: boolean) => {
    setPlayingFlag(playSongFlag);
  };

  return (
    <div className="player-div">
      <DynamicAudio songSrc={songSrc} />

      <button
        onClick={() =>
          setTitle(title === "Campfire" ? "Summer Nights" : "Campfire")
        }
      />

      <SwitchTransition>
        <CSSTransition
          key={title}
          onExiting={() => {
            if (songNumber === 0) {
              setSongNumber(1);
              setTitle(songs[1].title);
              setArtist(songs[1].artist);
              setImgSrc(songs[1].imgSrc);
              setSongSrc(songs[1].src);
            } else {
              setSongNumber(0);
              setTitle(songs[0].title);
              setArtist(songs[0].artist);
              setImgSrc(songs[0].imgSrc);
              setSongSrc(songs[0].src);
            }
          }}
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
                      handleTimeUpdate={(time: number) => setClickedTime(time)}
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
