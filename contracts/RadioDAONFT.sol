// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";

error AlreadyInitialised();

contract RadioDAONFT is ERC721Enumerable, ERC721URIStorage, ERC721Votes {
    // NFT Variables
    bool private s_isInitialised;

    uint256 public constant MAX_TOKENS = 16;
    uint256 private s_tokenCounter;
    string[] internal s_tokenURIs;

    // NFT Events
    event NFTMinted(address minter, uint256 indexed tokenID);
    event NFTTokenURISet(uint256 indexed tokenID, string tokenURI);

    constructor(string[MAX_TOKENS] memory tokenURIs)
        ERC721("RadioDAONFT", "RDIO")
        EIP712("RadioDAONFT", "1")
    {
        _initialiseContract(tokenURIs);
    }

    // Constructor Helpers //
    function _initialiseContract(string[MAX_TOKENS] memory tokenURIs) private {
        if (s_isInitialised) {
            revert AlreadyInitialised();
        }

        s_tokenCounter = 0;
        s_tokenURIs = tokenURIs;
        s_isInitialised = true;

        _mintAllNFTs();
    }

    function _mintAllNFTs() private {
        for (uint256 i = 0; i < MAX_TOKENS; i++) {
            address minter = msg.sender;
            uint256 newTokenID = s_tokenCounter;

            // mint process
            _safeMint(minter, newTokenID);
            s_tokenCounter += 1;
            emit NFTMinted(minter, newTokenID);

            // tokenURI setting process
            string memory newTokenURI = s_tokenURIs[newTokenID];
            _setTokenURI(newTokenID, newTokenURI);
            emit NFTTokenURISet(newTokenID, newTokenURI);
        }

        // have deployer self-delegate their voting power
        delegate(msg.sender);
    }

    //

    // Overrided functions to support ERC721Enumerable, ERC721URIStorage, and ERC721Votes extensions (as required by Solidity) //
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _beforeConsecutiveTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint96 size
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeConsecutiveTokenTransfer(from, to, tokenId, size);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Votes) {
        super._afterTokenTransfer(from, to, tokenId);
    }

    function _afterConsecutiveTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint96 size
    ) internal virtual override(ERC721, ERC721Votes) {
        super._afterConsecutiveTokenTransfer(from, to, tokenId, size);
    }

    //

    // ERC721 Variable Getters //
    function getInitialisedFlag() public view returns (bool) {
        return s_isInitialised;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getTokenURI(uint256 index) public view returns (string memory) {
        require(
            index >= 0 && index <= 15,
            "Requested token URI index not within bounds."
        );

        return s_tokenURIs[index];
    }

    //

    // User Collection Functions //
    function getUserNFTs(address user)
        external
        view
        returns (uint256[] memory)
    {
        uint256 myNFTCount = balanceOf(user);
        uint256[] memory ownedNFTs = new uint256[](myNFTCount);

        for (uint256 i = 0; i < myNFTCount; i++) {
            ownedNFTs[i] = tokenOfOwnerByIndex(user, i);
        }

        return ownedNFTs;
    }

    //
}
