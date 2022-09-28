// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error AlreadyInitialised();

contract RadioDAONFT is ERC721Enumerable, ERC721URIStorage, Ownable {
    // NFT Variables
    bool private s_isInitialised;

    uint256 public constant MAX_TOKENS = 16;
    uint256 private s_tokenCounter;
    string[] internal s_tokenURIs;

    // Marketplace Variables
    struct MarketItem {
        uint256 tokenID;
        address payable seller;
        uint256 price;
        bool forSale;
    }

    MarketItem[] public s_marketItems;
    uint256 public s_marketplaceFee;

    // NFT Events
    event NFTMinted(address minter, uint256 indexed tokenID);
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
    event MarketItemDelisted(uint256 indexed tokenID, address indexed seller);

    constructor(string[MAX_TOKENS] memory tokenURIs, uint256 marketplaceFee)
        ERC721("RadioDAONFT", "RDIONFT")
    {
        _initialiseContract(tokenURIs, marketplaceFee);
    }

    // Constructor Helpers //
    function _initialiseContract(
        string[MAX_TOKENS] memory tokenURIs,
        uint256 marketplaceFee
    ) private {
        if (s_isInitialised) {
            revert AlreadyInitialised();
        }

        s_tokenCounter = 0;
        s_tokenURIs = tokenURIs;
        s_isInitialised = true;

        s_marketplaceFee = marketplaceFee;

        _mintAllNFTs();
    }

    function _mintAllNFTs() private {
        for (uint256 i = 0; i < MAX_TOKENS; i++) {
            address minter = msg.sender;
            uint256 newTokenID = s_tokenCounter;

            // mint process
            _safeMint(address(this), newTokenID);
            s_tokenCounter += 1;
            emit NFTMinted(minter, newTokenID);

            // tokenURI setting process
            string memory newTokenURI = s_tokenURIs[newTokenID];
            _setTokenURI(newTokenID, newTokenURI);
            emit NFTTokenURISet(newTokenID, newTokenURI);

            // after an NFT is minted, list it for sale
            MarketItem memory newItem;
            newItem.tokenID = newTokenID;
            newItem.seller = payable(minter);
            newItem.price = 100_000_000_000_000_000; // 0.1 eth = 10^17 wei
            newItem.forSale = true;

            s_marketItems.push(newItem);
        }
    }

    //

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

    // Marketplace Variable Getters
    function getMarketplaceFee() public view returns (uint256) {
        return s_marketplaceFee;
    }

    //

    // Minting //
    // only allower owner of the contract to mint -- we'll pre-mint all the
    //  NFTs and then list for sale on the marketplace

    //

    // User Collection Functions //
    function getMyNFTs() external view returns (uint256[] memory) {
        uint256 myNFTCount = balanceOf(msg.sender);
        uint256[] memory ownedNFTs = new uint256[](myNFTCount);

        for (uint256 i = 0; i < myNFTCount; i++) {
            ownedNFTs[i] = tokenOfOwnerByIndex(msg.sender, i);
        }

        return ownedNFTs;
    }

    //

    // Marketplace Functions //
    function updateMarketplaceFee(uint256 newMarketplaceFee)
        external
        onlyOwner
    {
        s_marketplaceFee = newMarketplaceFee;
    }

    function buyNFT(uint256 tokenID) external payable {
        uint256 buyPrice = s_marketItems[tokenID].price;
        address seller = s_marketItems[tokenID].seller;

        // validation checks
        require(
            msg.sender != seller,
            "You cannot purchase the NFT that you already owned and have listed. Instead, delist the NFT from the marketplace."
        );
        require(
            msg.value == buyPrice,
            "You either sent too little or too much ETH. Please send the asking price to complete the transaction."
        );
        require(
            s_marketItems[tokenID].forSale,
            "This item is not for sale. How did you manage to try and purchase it?"
        );

        // use the bool in the MarketItem to effectively delist the item from sale
        s_marketItems[tokenID].forSale = false;

        // complete the purchase transaction
        _transfer(address(this), msg.sender, tokenID);
        payable(seller).transfer(msg.value);
        emit MarketItemBought(tokenID, seller, msg.sender, buyPrice);
    }

    function sellNFT(uint256 tokenID, uint256 salePrice) external payable {
        require(
            msg.value == s_marketplaceFee,
            "A fee must be paid to the marketplace to list your NFT."
        );
        require(
            salePrice > 0,
            "You cannot list your NFT for a price less than zero. Please set a price greater than zero."
        );

        // list the item for sale, with updated sale parameters
        s_marketItems[tokenID].price = salePrice;
        s_marketItems[tokenID].seller = payable(msg.sender);
        s_marketItems[tokenID].forSale = true;

        // complete the listing transaction
        _transfer(msg.sender, address(this), tokenID);
        emit MarketItemListed(tokenID, msg.sender, salePrice);
    }

    function delistNFT(uint256 tokenID) external {
        // use the bool in the MarketItem to effectively delist the item from sale
        s_marketItems[tokenID].forSale = false;

        // seller forfeits marketplace fee

        // complete delisting transaction
        _transfer(address(this), msg.sender, tokenID);
        emit MarketItemDelisted(tokenID, msg.sender);
    }

    function getAllNFTsForSale() external view returns (MarketItem[] memory) {
        uint256 numNFTsForSale = balanceOf(address(this));
        MarketItem[] memory NFTsForSale = new MarketItem[](numNFTsForSale);

        // look through s_marketItems and find those MarketItems for which forSale == true
        uint256 currentIndex;
        for (uint256 i = 0; i < s_marketItems.length; i++) {
            if (s_marketItems[i].forSale) {
                NFTsForSale[currentIndex] = s_marketItems[i];
                currentIndex++;
            }
        }

        return NFTsForSale;
    }
    //
}
