// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error AlreadyInitialised();

contract RadioDAONFT is ERC721Enumerable, ERC721URIStorage, Ownable {
    // NFT Variables
    bool private s_isInitialised;

    uint256 private s_tokenCounter;
    string[] internal s_tokenURIs;

    // Marketplace Variables
    struct MarketItem {
        uint256 tokenID;
        address payable seller;
        uint256 price;
    }

    MarketItem[] public s_marketItems;

    // NFT Events
    event NFTMinted(address minter);
    event NFTTokenURISet(uint256 indexed tokenID, string tokenURI);

    // Marketplace Events
    event MarketItemBought(
        uint256 indexed tokenID,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );
    event MarketItemListed(
        uint256 indexed tokenID,
        address indexed seller,
        uint256 price
    );

    constructor(string[16] memory tokenURIs) ERC721("RadioDAONFT", "RDIONFT") {
        _initialiseContract(tokenURIs);
    }

    // Overrided functions to support both ERC721Enumerable & ERC721URIStorage extensions
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

    // Constructor Helper //
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
    // only allower owner of the contract to mint -- we'll pre-mint all the
    //  NFTs and then list for sale on the marketplace
    function mintNFT() public onlyOwner returns (uint256 tokenID) {
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
