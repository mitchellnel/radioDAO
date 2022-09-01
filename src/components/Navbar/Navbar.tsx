import React, { useState } from "react";
import "./Navbar.css";
import theme from "../../assets/RadioDAOTheme";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import RadioIcon from "@mui/icons-material/Radio";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";

function Navbar() {
  const [connectedFlag, setConnected] = useState(false);

  const connectWallet_TEMP = () => {
    setConnected(!connectedFlag);
  };

  return (
    <header className={`navbar-header`}>
      <Container fluid className="navbar-container">
        <Row>
          <Col className="left">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <RadioIcon
                fontSize="inherit"
                style={{ paddingBottom: "7px", paddingRight: "10px" }}
              />
              <h1>RadioDAO</h1>
            </div>
          </Col>
          <Col className="middle">
            <div
              style={{
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <li>Voting</li>
              <li>Collection</li>
              <li>Marketplace</li>
            </div>
          </Col>
          <Col className="right">
            <div
              style={{
                height: "100%",
                width: "100%",
                alignItems: "center",
              }}
            >
              <ThemeProvider theme={theme}>
                <Button
                  className="connect-btn"
                  variant="contained"
                  color="secondary"
                  onClick={() => connectWallet_TEMP()}
                >
                  {connectedFlag ? "Disconnect" : "Connect"}
                </Button>
              </ThemeProvider>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}

export default Navbar;
