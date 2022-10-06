// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Radio is Ownable {
    // Radio Variables
    string[3] private s_queuedSongURIs;

    enum NextSong {
        Song0,
        Song1,
        Song2
    }
    NextSong private nextSong;

    // Radio Events
    event SongQueued(string indexed nextSongURI);

    // Getters //
    function getPrevSong() external view returns (string memory) {
        uint256 songIdx;
        if (uint(nextSong) == 0) {
            songIdx = 1;
        } else if (uint(nextSong) == 1) {
            songIdx = 2;
        } else {
            songIdx = 0;
        }

        return s_queuedSongURIs[songIdx];
    }

    function getActiveSong() external view returns (string memory) {
        uint256 songIdx;
        if (uint(nextSong) == 0) {
            songIdx = 2;
        } else {
            songIdx = uint(nextSong) - 1;
        }

        return s_queuedSongURIs[songIdx];
    }

    function getNextSong() external view returns (string memory) {
        return s_queuedSongURIs[uint(nextSong)];
    }

    //

    // Radio Functions //
    function queueSong(string memory songURI) external onlyOwner {
        uint256 nextSongIdx;
        if (uint(nextSong) == 2) {
            nextSongIdx = 0;
        } else {
            nextSongIdx = uint(nextSong) + 1;
        }

        s_queuedSongURIs[nextSongIdx] = songURI;
        nextSong = NextSong(nextSongIdx);
        emit SongQueued(songURI);
    }

    //
}
