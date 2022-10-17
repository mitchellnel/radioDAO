import React, { useEffect, useState } from "react";
import "./Main.css";

import { useEthers } from "@usedapp/core";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import useAudioPlayer from "../../hooks/useAudioplayer";
import {
  useGetActiveSong,
  useGetNextSong,
  useGetPrevSong,
} from "../../hooks/radio";

import DynamicAudio from "./DynamicAudio/DynamicAudio";
import PlayerArt from "./PlayerArt/PlayerArt";
import PlayerDetails from "./PlayerDetails/PlayerDetails";
import PlayerControls from "./PlayerControls/PlayerControls";

import songs from "../../assets/songs";
import { Song } from "../../assets/songs";
import RadioABI from "../../constants/RadioABI.json";
import ContractAddresses from "../../constants/ContractAddresses.json";
import { RadioDAONFTMetadata } from "../../../scripts/types";

function Main() {
  const [sliderPosition, setSliderPosition] = useState<number>(0);
  const [isSliding, setSlidingFlag] = useState<boolean>(false);

  const [songNumber, setSongNumber] = useState<number>(0);
  const [song, setSong] = useState<Song>(songs[0]);

  const {
    playing,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    if (!isSliding) {
      setSliderPosition(Math.round(currentTime as number));
    }
  }, [currentTime, isSliding]);

  const togglePlay = (playSongFlag: boolean): void => {
    setPlayingFlag(playSongFlag);
  };

  const handlePrevClick = (): void => {
    if (songNumber === 0) {
      setSongNumber(15);
    } else {
      setSongNumber((songNumber - 1) % songs.length);
    }
  };

  const handleNextClick = (): void => {
    setSongNumber((songNumber + 1) % songs.length);
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
    const nextSong: Song = {
      title: songs[songNumber].title,
      artist: songs[songNumber].artist,
      imgSrc: songs[songNumber].imgSrc,
      src: songs[songNumber].src,
    };

    setSong(nextSong);
  }, [songNumber]);

  // state variables for NFT metadata URI
  const [activeSongURI, setActiveSongURI] = useState<string>("");
  const [nextSongURI, setNextSongURI] = useState<string>("");
  const [prevSongURI, setPrevSongURI] = useState<string>("");

  // get radio ABI and address
  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  const radioABI = RadioABI["abi"];
  const radioAddress = ContractAddresses[networkName]["Radio"];

  // get NFT metadata URIs from the radio contract
  const activeSong = useGetActiveSong(radioABI, radioAddress);
  const nextSong = useGetNextSong(radioABI, radioAddress);
  const prevSong = useGetPrevSong(radioABI, radioAddress);

  useEffect(() => {
    if (activeSong !== undefined) {
      setActiveSongURI(activeSong);
    }

    if (nextSong !== undefined) {
      setNextSongURI(nextSong);
    }

    if (prevSong !== undefined) {
      setPrevSongURI(prevSong);
    }
  }, [activeSong, nextSong, prevSong]);

  // state variables for active song data
  const [activeSongData, setActiveSongData] = useState<Song>();

  // set song data whenever we get a new active song
  useEffect(() => {
    if (activeSongURI !== undefined) {
      const updateActiveSong = async () => {
        const requestURL = activeSongURI
          .toString()
          .replace("ipfs://", "https://ipfs.io/ipfs/");
        const tokenURIResponse: RadioDAONFTMetadata = await (
          await fetch(requestURL)
        ).json();

        const song: Song = {
          title: tokenURIResponse.title,
          artist: tokenURIResponse.artist,
          imgSrc: tokenURIResponse.image.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
          ),
          src: tokenURIResponse.audio.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
          ),
        };

        setActiveSongData(song);
      };

      updateActiveSong();
    }
  }, [activeSongURI]);

  // set song to play whenever we get a new active song
  useEffect(() => {
    if (activeSongData !== undefined) {
      setPlayingFlag(true);
    }
  }, [activeSongData]);

  return (
    <div className="player-div">
      <DynamicAudio songSrc={activeSongData ? activeSongData.src : ""} />

      <SwitchTransition>
        <CSSTransition
          key={
            activeSongData
              ? activeSongData.title + " -- " + activeSongData.artist
              : "ttt--aaa"
          }
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
                  <PlayerArt
                    artSrc={activeSongData ? activeSongData.imgSrc : ""}
                  />
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
                    <PlayerDetails
                      songTitle={activeSongData ? activeSongData.title : ""}
                      artist={activeSongData ? activeSongData.artist : ""}
                    />
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
                      prevSong={handlePrevClick}
                      nextSong={handleNextClick}
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
