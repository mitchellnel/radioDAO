import React from "react";
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
  const {
    playing,
    duration,
    currentTime,
    clickedTime,
    setPlayingFlag,
    setClickedTime,
  } = useAudioPlayer();

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

      <Container className="player-container" fluid>
        <Row id="player-row">
          <Col className="player-art">
            <PlayerArt artSrc={songs[0].imgSrc} />
          </Col>
          <Col className="player-details-controls">
            <PlayerDetails />
            <PlayerControls handlePlayPauseClick={togglePlay} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Main;
