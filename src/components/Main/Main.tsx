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

function Main() {
  console.log(songs[0].imgSrc);
  return (
    <div className="player-div">
      <Container className="player-container" fluid>
        <Row id="player-row">
          <Col className="player-art">
            <PlayerArt artSrc={songs[0].imgSrc} />
          </Col>
          <Col className="player-details-contols">
            <PlayerDetails />
            <PlayerControls />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Main;
