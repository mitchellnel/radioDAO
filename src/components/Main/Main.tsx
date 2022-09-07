import React, { useEffect, useState } from "react";
import "./Main.css";
import theme from "../../assets/RadioDAOTheme";

import PlayerArt from "./PlayerArt/PlayerArt";
import PlayerDetails from "./PlayerDetails/PlayerDetails";
import PlayerControls from "./PlayerControls/PlayerControls";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import songs from "../../assets/songs";
import useAudioPlayer from "../../hooks/useAudioplayer";

function Main() {
  const [sliderPosition, setSliderPosition] = useState<number>(0);

  const {
    playing,
    duration,
    currentTime,
    clickedTime,
    setPlayingFlag,
    setClickedTime,
  } = useAudioPlayer();

  useEffect(() => setSliderPosition(currentTime as number), [currentTime]);

  const title = songs[0].title;
  const artist = songs[0].artist;
  const imgSrc = songs[0].imgSrc;
  const songSrc = songs[0].src;

  const togglePlay = (playSongFlag: boolean) => {
    setPlayingFlag(playSongFlag);
  };

  return (
    <div className="player-div">
      <audio>
        <source src={songSrc} />
        Your browser does not support the <code>audio</code> element.
      </audio>

      <Container id="player-container" fluid>
        <Row id="player-row">
          <Col id="player-art">
            <PlayerArt artSrc={imgSrc} />
          </Col>
          <Col id="player-details-controls">
            <div
              id="details"
              style={{ display: "table", margin: "160px auto 0" }}
            >
              <PlayerDetails songTitle={title} artist={artist} />
            </div>
            <div
              id="controls"
              style={{
                display: "table",
                margin: "200px auto 0",
              }}
            >
              <PlayerControls
                sliderPosition={sliderPosition}
                handlePlayPauseClick={togglePlay}
                handleTimeUpdate={(time: number) => setClickedTime(time)}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Main;
