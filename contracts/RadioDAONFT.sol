// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error AlreadyInitialised();
error RangeOutOfBounds();

contract RadioDAONFT is ERC721URIStorage, Ownable {
    // NFT Contract Variables
    bool private s_isInitialised;

    uint256 private s_tokenCounter;
    string[] internal s_tokenURIs;

    // Contract Events
    event NFTMinted(address minter);
    event NFTTokenURISet(uint256 indexed tokenID, string tokenURI);

    constructor(string[16] memory tokenURIs) ERC721("RadioDAONFT", "RDIONFT") {
        _initialiseContract(tokenURIs);
    }

    // Storage Variable Getters //
    function getInitialisedFlag() public view returns (bool) {
        return s_isInitialised;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getTokenURI(uint256 index) public view returns (string memory) {
        if (index < 0 || index > 15) {
            revert RangeOutOfBounds();
        }

        return s_tokenURIs[index];
    }

    //

    // Constructore Helper //
    function _initialiseContract(string[16] memory tokenURIs) private {
        if (s_isInitialised) {
            revert AlreadyInitialised();
        }

        s_tokenCounter = 0;
        s_tokenURIs = tokenURIs;
        s_isInitialised = true;
    }

    //

    // Minting //
    function mintNFT() public returns (uint256 tokenID) {
        address minter = msg.sender;
        uint256 newTokenID = s_tokenCounter;

        _safeMint(minter, newTokenID);
        s_tokenCounter += 1;
        emit NFTMinted(minter);

        string memory newTokenURI = s_tokenURIs[newTokenID];

        _setTokenURI(newTokenID, newTokenURI);
        emit NFTTokenURISet(newTokenID, newTokenURI);

        return newTokenID;
    }
    //
}
