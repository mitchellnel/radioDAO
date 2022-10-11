import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, BigNumberish } from "ethers";
import { deployments, ethers, network } from "hardhat";

import {
  Nelthereum,
  RadioDAONFT,
  RadioDAOMarketplace,
} from "../typechain-types";

import { developmentChains } from "../helper-hardhat-config";
import { MarketItem } from "../scripts/types";

const toWei = (num: Number) => ethers.utils.parseEther(num.toString());
const fromWei = (num: BigNumberish) => ethers.utils.formatEther(num);

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("RadioDAOMarketplace Unit Tests", () => {
      const marketplaceFee = toWei(0.5);
      const initialNFTBuyPrice = toWei(1);
      const MAX_TOKENS = 16;

      let owner: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress;
      let nel: Nelthereum;
      let rdioNFT: RadioDAONFT;
      let rdioMarketplace: RadioDAOMarketplace;

      beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();

        await deployments.fixture(["marketplace"]);

        nel = await ethers.getContract("Nelthereum");
        rdioNFT = await ethers.getContract("RadioDAONFT");
        rdioMarketplace = await ethers.getContract("RadioDAOMarketplace");

        for (let i = 0; i < 10; i++) {
          await nel.connect(user1).requestTokens();
          await nel.connect(user2).requestTokens();
        }

        expect(await nel.balanceOf(user1.address)).to.equal(toWei(100));
        expect(await nel.balanceOf(user2.address)).to.equal(toWei(100));
      });

      describe("Deployment, Construction, Initialisation and All Minting", () => {
        it("Should set the NEL_CONTRACT variable correctly", async () => {
          expect(await rdioMarketplace.NEL_CONTRACT()).to.equal(nel.address);
        });

        it("Should set the RDIO_CONTRACT variable correctly", async () => {
          expect(await rdioMarketplace.RDIO_CONTRACT()).to.equal(
            rdioNFT.address
          );
        });

        it("Should set the right owner", async () => {
          expect(await rdioMarketplace.owner()).to.equal(owner.address);
        });

        it("Should set the s_marketplaceFee storage variable correctly", async () => {
          expect(await rdioMarketplace.getMarketplaceFee()).to.equal(
            marketplaceFee
          );
        });

        it("Should mint and then list all MAX_TOKENS NFTs", async () => {
          expect(await rdioNFT.balanceOf(rdioMarketplace.address)).to.equal(
            MAX_TOKENS
          );

          // get each item from the s_marketItems array and check their fields
          for (let i = 0; i < MAX_TOKENS; i++) {
            const item = await rdioMarketplace.s_marketItems(i);
            expect(item.tokenID).to.equal(i);
            expect(item.seller).to.equal(owner.address);
            expect(item.price).to.equal(initialNFTBuyPrice);
            expect(item.forSale).to.be.true;
          }
        });
      });

      describe("Marketplace Functionality", () => {
        describe("Setters", () => {
          it("Marketplace owner should be able to change the marketplace fee", async () => {
            await rdioMarketplace.updateMarketplaceFee(toWei(0.2));
            expect(await rdioMarketplace.getMarketplaceFee()).to.equal(
              toWei(0.2)
            );
          });
        });

        describe("Delisting NFTs", () => {
          describe("Validation", () => {
            it("Should revert a transaction where the message sender is not the seller of the NFT", async () => {
              await expect(
                rdioMarketplace.connect(user1).delistNFT(3)
              ).to.be.revertedWith(
                "You cannot delist an NFT that you are not the seller of."
              );
            });
          });

          describe("Correct update of MarketItem object in s_marketItems", () => {
            beforeEach(async () => {
              await rdioMarketplace.connect(owner).delistNFT(3);
            });

            it("Should set the forSale field to true", async () => {
              expect((await rdioMarketplace.s_marketItems(3)).forSale).to.be
                .false;
            });
          });
          describe("Correct transfer of NFT", () => {
            let originalOwnerNFTBalance;
            beforeEach(async () => {
              originalOwnerNFTBalance = await rdioNFT.balanceOf(owner.address);

              await rdioMarketplace.connect(owner).delistNFT(3);
            });

            it("Seller (delister) should receive the NFT", async () => {
              const newOwnerNFTBalance = await rdioNFT.balanceOf(owner.address);

              expect(await rdioNFT.ownerOf(3)).to.equal(owner.address);

              expect(newOwnerNFTBalance).to.equal(
                originalOwnerNFTBalance.add(1)
              );
            });
          });

          describe("Event Emittance", () => {
            it("Should emit a MarketItemDelisted event", async () => {
              await expect(rdioMarketplace.connect(owner).delistNFT(3))
                .to.emit(rdioMarketplace, "MarketItemDelisted")
                .withArgs(3, owner.address);
            });
          });
        });

        describe("Selling NFTs", () => {
          beforeEach(async () => {
            // delist 3 NFTs to return them to owner
            await rdioMarketplace.delistNFT(0);
            await rdioMarketplace.delistNFT(3);
            await rdioMarketplace.delistNFT(5);

            expect(await rdioNFT.balanceOf(rdioMarketplace.address)).to.equal(
              MAX_TOKENS - 3
            );
            expect(await rdioNFT.balanceOf(owner.address)).to.equal(3);

            await nel
              .connect(owner)
              .approve(rdioMarketplace.address, marketplaceFee);

            await rdioNFT.connect(owner).approve(rdioMarketplace.address, 3);
          });

          describe("Correct update of MarketItem object in s_marketItems", () => {
            beforeEach(async () => {
              await rdioMarketplace
                .connect(owner)
                .sellNFT(3, initialNFTBuyPrice);
            });

            it("Should set the seller to the correct address", async () => {
              expect((await rdioMarketplace.s_marketItems(3)).seller).to.equal(
                owner.address
              );
            });

            it("Should set the price to the new sale price", async () => {
              expect((await rdioMarketplace.s_marketItems(3)).price).to.equal(
                initialNFTBuyPrice
              );
            });

            it("Should set the forSale field to true", async () => {
              expect((await rdioMarketplace.s_marketItems(3)).forSale).to.be
                .true;
            });
          });

          describe("Correct transfer of NEL and NFT", () => {
            let originalOwnerNELBalance: BigNumber,
              originalUser1NFTBalance: BigNumber;
            beforeEach(async () => {
              await rdioNFT
                .connect(owner)
                .transferFrom(owner.address, user1.address, 3);

              originalOwnerNELBalance = await nel.balanceOf(owner.address);
              originalUser1NFTBalance = await rdioNFT.balanceOf(user1.address);

              await nel
                .connect(user1)
                .approve(rdioMarketplace.address, marketplaceFee);
              await rdioNFT.connect(user1).approve(rdioMarketplace.address, 3);
              await rdioMarketplace
                .connect(user1)
                .sellNFT(3, initialNFTBuyPrice);
            });

            it("Contract owner should receive payment of the marketplace fee", async () => {
              const newOwnerNELBalance: BigNumber = await nel.balanceOf(
                owner.address
              );

              expect(+fromWei(newOwnerNELBalance)).to.equal(
                +fromWei(originalOwnerNELBalance.add(marketplaceFee))
              );
            });

            it("Contract should receive the NFT", async () => {
              const newUser1NFTBalance: BigNumber = await rdioNFT.balanceOf(
                user1.address
              );

              expect(await rdioNFT.ownerOf(3)).to.equal(
                rdioMarketplace.address
              );

              expect(newUser1NFTBalance).to.equal(
                originalUser1NFTBalance.sub(1)
              );
            });
          });

          describe("Event Emittance", () => {
            it("Should emit a MarketItemListed event", async () => {
              await rdioNFT
                .connect(owner)
                .transferFrom(owner.address, user1.address, 3);

              await nel
                .connect(user1)
                .approve(rdioMarketplace.address, marketplaceFee);
              await rdioNFT.connect(user1).approve(rdioMarketplace.address, 3);

              await expect(
                rdioMarketplace.connect(user1).sellNFT(3, initialNFTBuyPrice)
              )
                .to.emit(rdioMarketplace, "MarketItemListed")
                .withArgs(3, user1.address, initialNFTBuyPrice);
            });
          });
        });

        describe("Buying NFTs", () => {
          beforeEach(async () => {
            await nel
              .connect(user1)
              .approve(rdioMarketplace.address, initialNFTBuyPrice);
          });

          describe("Validation", () => {
            it("Should revert a transaction where the seller attempts to buy their own NFT", async () => {
              // owner tries to purchase an NFT for which they are the seller from the marketplace
              await nel
                .connect(owner)
                .approve(rdioMarketplace.address, initialNFTBuyPrice);

              await expect(
                rdioMarketplace.connect(owner).buyNFT(3)
              ).to.be.revertedWith(
                "You cannot purchase the NFT that you already owned and have listed. Instead, delist the NFT from the marketplace."
              );
            });

            it("Should revert a transaction where the NFT has already been sold", async () => {
              await nel
                .connect(user2)
                .approve(rdioMarketplace.address, initialNFTBuyPrice);

              await rdioMarketplace.connect(user2).buyNFT(3);

              await expect(
                rdioMarketplace.connect(user1).buyNFT(3)
              ).to.be.revertedWith(
                "This item is not for sale. How did you manage to try and purchase it?"
              );
            });
          });

          describe("Correct update of MarketItem object in s_marketItems", () => {
            beforeEach(async () => {
              await rdioMarketplace.connect(user1).buyNFT(3);
            });

            it("Should set the forSale field to false", async () => {
              expect((await rdioMarketplace.s_marketItems(3)).forSale).to.be
                .false;
            });
          });

          describe("Correct transfer of NFT and ETH", () => {
            let originalOwnerNELBalance: BigNumber,
              originalUser1NELBalance: BigNumber;
            let originalUser1NFTBalance: BigNumber;
            beforeEach(async () => {
              originalOwnerNELBalance = await nel.balanceOf(owner.address);
              originalUser1NELBalance = await nel.balanceOf(user1.address);

              originalUser1NFTBalance = await rdioNFT.balanceOf(user1.address);

              await rdioMarketplace.connect(user1).buyNFT(3);
            });

            it("Seller should receive payment of the listed NFT price", async () => {
              const newOwnerNELBalance: BigNumber = await nel.balanceOf(
                owner.address
              );

              const newUser1NELBalance: BigNumber = await nel.balanceOf(
                user1.address
              );

              expect(+fromWei(newOwnerNELBalance)).to.equal(
                +fromWei(originalOwnerNELBalance.add(initialNFTBuyPrice))
              );

              expect(+fromWei(newUser1NELBalance)).to.equal(
                +fromWei(originalUser1NELBalance.sub(initialNFTBuyPrice))
              );
            });

            it("Buyer should receive the NFT", async () => {
              const newUser1NFTBalance: BigNumber = await rdioNFT.balanceOf(
                user1.address
              );
              expect(await rdioNFT.ownerOf(3)).to.equal(user1.address);

              expect(newUser1NFTBalance).to.equal(
                originalUser1NFTBalance.add(1)
              );
            });
          });

          describe("Event Emittance", () => {
            it("Should emit a MarketItemBought event", async () => {
              await expect(rdioMarketplace.connect(user1).buyNFT(3))
                .to.emit(rdioMarketplace, "MarketItemBought")
                .withArgs(3, owner.address, user1.address, initialNFTBuyPrice);
            });
          });
        });

        describe("Getters", () => {
          beforeEach(async () => {
            await nel
              .connect(user1)
              .approve(
                rdioMarketplace.address,
                BigNumber.from(initialNFTBuyPrice).mul(3)
              );

            await rdioMarketplace.connect(user1).buyNFT(0);
            await rdioMarketplace.connect(user1).buyNFT(3);
            await rdioMarketplace.connect(user1).buyNFT(5);
          });

          it("getAllNFTsForSale should return an array of all the NFTs that are currently for sale", async () => {
            const itemsForSale: MarketItem[] =
              await rdioMarketplace.getAllNFTsForSale();

            const soldItems = [0, 3, 5];

            expect(itemsForSale.length).to.equal(MAX_TOKENS - soldItems.length);

            // check that the IDs of the NFTs for sale are correct
            expect(
              itemsForSale.every(
                (i) => !soldItems.some((j) => j === i.tokenID.toNumber())
              )
            );
          });
        });
      });
    });
