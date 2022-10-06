// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract RadioDAOMarketplace is IERC721Receiver, Ownable {
    // NEL Variables
    IERC20 public NEL_CONTRACT;

    // RDIO Variables
    IERC721Enumerable public RDIO_CONTRACT;

    // Marketplace Variables
    struct MarketItem {
        uint256 tokenID;
        address payable seller;
        uint256 price;
        bool forSale;
    }

    MarketItem[] public s_marketItems;
    uint256 public s_marketplaceFee; // in NEL

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

    constructor(
        address nelContract,
        address rdioContract,
        uint256 marketplaceFee
    ) {
        NEL_CONTRACT = IERC20(nelContract);
        RDIO_CONTRACT = IERC721Enumerable(rdioContract);

        s_marketplaceFee = marketplaceFee;
    }

    //

    // IERC721Receiver Functionality //
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    //

    // NEL Contract Address Updater //
    function _updateNELContractAddress(address newAddress) external onlyOwner {
        NEL_CONTRACT = IERC20(newAddress);
    }

    //

    // Marketplace Variable Getters //
    function getMarketplaceFee() public view returns (uint256) {
        return s_marketplaceFee;
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
            s_marketItems[tokenID].forSale,
            "This item is not for sale. How did you manage to try and purchase it?"
        );

        // use the bool in the MarketItem to effectively delist the item from sale
        s_marketItems[tokenID].forSale = false;

        // transfer NEL from buyer to seller
        // front-end will approve spending of buyPrice NEL
        NEL_CONTRACT.transferFrom(msg.sender, seller, buyPrice);

        // transfer RDIO from marketplace to buyer
        // front-end will aprove transfer of the NFT
        RDIO_CONTRACT.transferFrom(address(this), msg.sender, tokenID);

        emit MarketItemBought(tokenID, seller, msg.sender, buyPrice);
    }

    function sellNFT(uint256 tokenID, uint256 salePrice) external payable {
        require(
            salePrice > 0,
            "You cannot list your NFT for a price less than zero. Please set a price greater than zero."
        );

        // list the item for sale, with updated sale parameters
        s_marketItems[tokenID].price = salePrice;
        s_marketItems[tokenID].seller = payable(msg.sender);
        s_marketItems[tokenID].forSale = true;

        // transfer NEL from seller to marketplace owner
        // front-end will approve spending of s_marketplaceFee NEL
        NEL_CONTRACT.transferFrom(msg.sender, owner(), s_marketplaceFee);

        // transfer RDIO from seller to marketplace
        // front-end will approve transfer of the NFT
        RDIO_CONTRACT.safeTransferFrom(msg.sender, address(this), tokenID);

        emit MarketItemListed(tokenID, msg.sender, salePrice);
    }

    function delistNFT(uint256 tokenID) external {
        require(
            msg.sender == s_marketItems[tokenID].seller,
            "You cannot delist an NFT that you are not the seller of."
        );
        // use the bool in the MarketItem to effectively delist the item from sale
        s_marketItems[tokenID].forSale = false;

        // seller forfeits marketplace fee

        // transfer RDIO from marketplace to seller
        // front-end will aprove transfer of the NFT
        RDIO_CONTRACT.transferFrom(address(this), msg.sender, tokenID);

        emit MarketItemDelisted(tokenID, msg.sender);
    }

    function getAllNFTsForSale() external view returns (MarketItem[] memory) {
        uint256 numNFTsForSale = RDIO_CONTRACT.balanceOf(address(this));
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
