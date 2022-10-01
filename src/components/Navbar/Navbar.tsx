import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import RadioIcon from "@mui/icons-material/Radio";
import Button from "@mui/material/Button";
import { useEthers } from "@usedapp/core";

function Navbar() {
  const { account, activateBrowserWallet, deactivate } = useEthers();

  const connectedFlag: Boolean = account !== undefined;

  return (
    <header>
      <Container fluid className="navbar-container">
        <Row>
          <Col className="left">
            <Link to="/">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {/* TODO: this doesn't seem to be centered perfectly in the Navbar */}
                <RadioIcon
                  fontSize="inherit"
                  style={{ paddingBottom: "10px", paddingRight: "10px" }}
                />
                <h1>RadioDAO</h1>
              </div>
            </Link>
          </Col>
          <Col className="middle">
            <div
              style={{
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Link to="/voting">
                <li className="li-link">Voting</li>
              </Link>

              <li>|</li>

              <Link to="/collection">
                <li className="li-link">Collection</li>
              </Link>

              <li>|</li>

              <Link to="/marketplace">
                <li className="li-link">Marketplace</li>
              </Link>
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
              {connectedFlag ? (
                <Button
                  className="connect-btn"
                  variant="contained"
                  color="secondary"
                  onClick={deactivate}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  className="connect-btn"
                  variant="contained"
                  color="secondary"
                  onClick={() => activateBrowserWallet()}
                >
                  Connect
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}

export default Navbar;
