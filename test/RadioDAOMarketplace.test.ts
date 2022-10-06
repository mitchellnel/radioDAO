import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, BigNumberish, Contract, ContractFactory } from "ethers";
import { network, ethers } from "hardhat";
import { developmentChains } from "../helper-hardhat-config";
import { MarketItem } from "../scripts/types";

const toWei = (num: Number) => ethers.utils.parseEther(num.toString());
const fromWei = (num: BigNumberish) => ethers.utils.formatEther(num);

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("RadioDAOMarketplace Unit Tests", () => {
      const testURIs = [
        "uri_1",
        "uri_2",
        "uri_3",
        "uri_4",
        "uri_5",
        "uri_6",
        "uri_7",
        "uri_8",
        "uri_9",
        "uri_10",
        "uri_11",
        "uri_12",
        "uri_13",
        "uri_14",
        "uri_15",
        "uri_16",
      ];
      const marketplaceFee = toWei(0.5);
      const initialNFTBuyPrice = toWei(1);
      const MAX_TOKENS = 16;

      let owner: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress;
      let NELFactory: ContractFactory,
        RadioDAONFTFactory: ContractFactory,
        RadioDAOMarketplaceFactory: ContractFactory;
      let nel: Contract, rdioNFT: Contract, rdioMarketplace: Contract;

      beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();

        NELFactory = await ethers.getContractFactory("Nelthereum");
        RadioDAONFTFactory = await ethers.getContractFactory("RadioDAONFT");
        RadioDAOMarketplaceFactory = await ethers.getContractFactory(
          "RadioDAOMarketplace"
        );

        nel = await NELFactory.deploy();

        for (let i = 0; i < 10; i++) {
          await nel.connect(user1).requestTokens();
          await nel.connect(user2).requestTokens();
        }
        expect(await nel.balanceOf(user1.address)).to.equal(toWei(100));
        expect(await nel.balanceOf(user2.address)).to.equal(toWei(100));

        rdioNFT = await RadioDAONFTFactory.deploy(testURIs);

        rdioMarketplace = await RadioDAOMarketplaceFactory.deploy(
          nel.address,
          rdioNFT.address,
          marketplaceFee
        );
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

        it("Should set up the s_marketItems array correctly", async () => {
          for (let i = 0; i < MAX_TOKENS; i++) {
            const marketItem = await rdioMarketplace.s_marketItems(i);

            expect(marketItem.tokenID).to.equal(i);
            expect(marketItem.forSale).to.be.false;
          }
        });
      });

      describe("Marketplace Functionality", () => {
        // describe("Getters", () => {
        //   it("getAllNFTsForSale should return an array of MAX_TOKENS items that are currently up for sale, since none have bene bought yet", async () => {
        //     const itemsForSale = await rdioNFT.getAllNFTsForSale();
        //     expect(itemsForSale.length).to.equal(16);
        //   });

        //   it("getAllNFTsForSale should return all MarketItems that have forSale set to true", async () => {
        //     const soldItems = [3, 6, 9];
        //     await nel
        //       .connect(user1)
        //       .approve(rdioNFT.address, initialNFTBuyPrice.mul(3));
        //     await rdioNFT
        //       .connect(user1)
        //       .buyNFT(3, { value: initialNFTBuyPrice });
        //     await rdioNFT
        //       .connect(user1)
        //       .buyNFT(6, { value: initialNFTBuyPrice });
        //     await rdioNFT
        //       .connect(user1)
        //       .buyNFT(9, { value: initialNFTBuyPrice });

        //     const unsoldNFTs = await rdioNFT.connect(user1).getAllNFTsForSale();

        //     expect(unsoldNFTs.length).to.equal(13);

        //     // check that the IDs of the unsold NFTs are correct
        //     expect(
        //       unsoldNFTs.every(
        //         (i) => !soldItems.some((j) => j === i.tokenID.toNumber())
        //       )
        //     ).to.be.true;
        //   });
        // });

        describe("Setters", () => {
          it("Marketplace owner should be able to change the marketplace fee", async () => {
            await rdioMarketplace.updateMarketplaceFee(toWei(0.2));
            expect(await rdioMarketplace.getMarketplaceFee()).to.equal(
              toWei(0.2)
            );
          });
        });

        describe("Selling NFTs", () => {
          beforeEach(async () => {
            // transfer 3 NFTs from owner to user1
            await rdioNFT.transferFrom(owner.address, user1.address, 0);
            await rdioNFT.transferFrom(owner.address, user1.address, 3);
            await rdioNFT.transferFrom(owner.address, user1.address, 5);

            expect(await rdioNFT.balanceOf(owner.address)).to.equal(
              MAX_TOKENS - 3
            );
            expect(await rdioNFT.balanceOf(user1.address)).to.equal(3);

            await nel
              .connect(user1)
              .approve(rdioMarketplace.address, marketplaceFee);

            await rdioNFT.connect(user1).approve(rdioMarketplace.address, 3);
          });

          describe("Correct update of MarketItem object in s_marketItems", () => {
            beforeEach(async () => {
              await rdioMarketplace
                .connect(user1)
                .sellNFT(3, initialNFTBuyPrice);
            });

            it("Should set the seller to the correct address", async () => {
              expect((await rdioMarketplace.s_marketItems(3)).seller).to.equal(
                user1.address
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

          describe("Correct transfer of NFT and ETH", () => {
            let originalOwnerNELBalance: BigNumber,
              originalUser1NFTBalance: BigNumber;
            beforeEach(async () => {
              originalOwnerNELBalance = await nel.balanceOf(owner.address);
              originalUser1NFTBalance = await rdioNFT.balanceOf(user1.address);

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
            // transfer 3 NFTs from owner to user1
            await rdioNFT.transferFrom(owner.address, user1.address, 0);
            await rdioNFT.transferFrom(owner.address, user1.address, 3);
            await rdioNFT.transferFrom(owner.address, user1.address, 5);

            expect(await rdioNFT.balanceOf(owner.address)).to.equal(
              MAX_TOKENS - 3
            );
            expect(await rdioNFT.balanceOf(user1.address)).to.equal(3);

            await nel
              .connect(user1)
              .approve(
                rdioMarketplace.address,
                BigNumber.from(marketplaceFee).mul(2)
              );

            await rdioNFT.connect(user1).approve(rdioMarketplace.address, 3);
            await rdioNFT.connect(user1).approve(rdioMarketplace.address, 5);

            await rdioMarketplace.connect(user1).sellNFT(3, initialNFTBuyPrice);
            await rdioMarketplace.connect(user1).sellNFT(5, initialNFTBuyPrice);

            await nel
              .connect(user2)
              .approve(rdioMarketplace.address, initialNFTBuyPrice);
          });

          describe("Validation", () => {
            it("Should revert a transaction where the seller attempts to buy their own NFT", async () => {
              // owner tries to purchase an NFT for which they are the seller from the marketplace
              await nel
                .connect(user1)
                .approve(rdioMarketplace.address, initialNFTBuyPrice);

              await expect(
                rdioMarketplace.connect(user1).buyNFT(3)
              ).to.be.revertedWith(
                "You cannot purchase the NFT that you already owned and have listed. Instead, delist the NFT from the marketplace."
              );
            });

            it("Should revert a transaction where the NFT has already been sold", async () => {
              await nel
                .connect(user1)
                .approve(rdioMarketplace.address, initialNFTBuyPrice);

              await rdioMarketplace.connect(user2).buyNFT(3);

              await nel
                .connect(user1)
                .approve(rdioMarketplace.address, initialNFTBuyPrice);

              await expect(
                rdioMarketplace.connect(user2).buyNFT(3)
              ).to.be.revertedWith(
                "This item is not for sale. How did you manage to try and purchase it?"
              );
            });
          });

          describe("Correct update of MarketItem object in s_marketItems", () => {
            beforeEach(async () => {
              await rdioMarketplace.connect(user2).buyNFT(3);
            });

            it("Should set the forSale field to false", async () => {
              expect((await rdioMarketplace.s_marketItems(3)).forSale).to.be
                .false;
            });
          });

          describe("Correct transfer of NFT and ETH", () => {
            let originalUser1NELBalance: BigNumber,
              originalUser2NELBalance: BigNumber;
            let originalUser2NFTBalance: BigNumber;
            beforeEach(async () => {
              originalUser1NELBalance = await nel.balanceOf(user1.address);
              originalUser2NELBalance = await nel.balanceOf(user2.address);

              originalUser2NFTBalance = await rdioNFT.balanceOf(user2.address);

              await rdioMarketplace.connect(user2).buyNFT(3);
            });

            it("Seller should receive payment of the listed NFT price", async () => {
              const newUser1NELBalance: BigNumber = await nel.balanceOf(
                user1.address
              );

              const newUser2NELBalance: BigNumber = await nel.balanceOf(
                user2.address
              );

              expect(+fromWei(newUser1NELBalance)).to.equal(
                +fromWei(originalUser1NELBalance.add(initialNFTBuyPrice))
              );

              expect(+fromWei(newUser2NELBalance)).to.equal(
                +fromWei(originalUser2NELBalance.sub(initialNFTBuyPrice))
              );
            });

            it("Buyer should receive the NFT", async () => {
              const newUser2NFTBalance: BigNumber = await rdioNFT.balanceOf(
                user2.address
              );
              expect(await rdioNFT.ownerOf(3)).to.equal(user2.address);

              expect(newUser2NFTBalance).to.equal(
                originalUser2NFTBalance.add(1)
              );
            });
          });

          describe("Event Emittance", () => {
            it("Should emit a MarketItemBought event", async () => {
              await expect(rdioMarketplace.connect(user2).buyNFT(3))
                .to.emit(rdioMarketplace, "MarketItemBought")
                .withArgs(3, user1.address, user2.address, initialNFTBuyPrice);
            });
          });
        });

        describe("Delisting NFTs", () => {
          beforeEach(async () => {
            // transfer 3 NFTs from owner to user1
            await rdioNFT.transferFrom(owner.address, user1.address, 0);
            await rdioNFT.transferFrom(owner.address, user1.address, 3);
            await rdioNFT.transferFrom(owner.address, user1.address, 5);

            expect(await rdioNFT.balanceOf(owner.address)).to.equal(
              MAX_TOKENS - 3
            );
            expect(await rdioNFT.balanceOf(user1.address)).to.equal(3);

            await nel
              .connect(user1)
              .approve(
                rdioMarketplace.address,
                BigNumber.from(marketplaceFee).mul(2)
              );

            await rdioNFT.connect(user1).approve(rdioMarketplace.address, 3);
            await rdioNFT.connect(user1).approve(rdioMarketplace.address, 5);

            await rdioMarketplace.connect(user1).sellNFT(3, initialNFTBuyPrice);
            await rdioMarketplace.connect(user1).sellNFT(5, initialNFTBuyPrice);

            await nel
              .connect(user2)
              .approve(rdioMarketplace.address, initialNFTBuyPrice);
          });

          describe("Validation", () => {
            it("Should revert a transaction where the message sender is not the seller of the NFT", async () => {
              await expect(
                rdioMarketplace.connect(user2).delistNFT(3)
              ).to.be.revertedWith(
                "You cannot delist an NFT that you are not the seller of."
              );
            });
          });

          describe("Correct update of MarketItem object in s_marketItems", () => {
            beforeEach(async () => {
              await rdioMarketplace.connect(user1).delistNFT(3);
            });

            it("Should set the forSale field to true", async () => {
              expect((await rdioMarketplace.s_marketItems(3)).forSale).to.be
                .false;
            });
          });
          describe("Correct transfer of NFT", () => {
            let originalUser1NFTBalance;
            beforeEach(async () => {
              originalUser1NFTBalance = await rdioNFT.balanceOf(user1.address);

              await rdioMarketplace.connect(user1).delistNFT(3);
            });

            it("Seller (delister) should receive the NFT", async () => {
              const newUser1NFTBalance = await rdioNFT.balanceOf(user1.address);

              expect(await rdioNFT.ownerOf(3)).to.equal(user1.address);

              expect(newUser1NFTBalance).to.equal(
                originalUser1NFTBalance.add(1)
              );
            });
          });

          describe("Event Emittance", () => {
            it("Should emit a MarketItemDelisted event", async () => {
              await expect(rdioMarketplace.connect(user1).delistNFT(3))
                .to.emit(rdioMarketplace, "MarketItemDelisted")
                .withArgs(3, user1.address);
            });
          });
        });
        describe("Getters", () => {
          beforeEach(async () => {
            // transfer 3 NFTs from owner to user1
            await rdioNFT.transferFrom(owner.address, user1.address, 0);
            await rdioNFT.transferFrom(owner.address, user1.address, 3);
            await rdioNFT.transferFrom(owner.address, user1.address, 5);

            expect(await rdioNFT.balanceOf(owner.address)).to.equal(
              MAX_TOKENS - 3
            );
            expect(await rdioNFT.balanceOf(user1.address)).to.equal(3);

            await nel
              .connect(user1)
              .approve(
                rdioMarketplace.address,
                BigNumber.from(marketplaceFee).mul(3)
              );

            await rdioNFT.connect(user1).approve(rdioMarketplace.address, 0);
            console.log("approve 1");
            await rdioNFT.connect(user1).approve(rdioMarketplace.address, 3);
            console.log("approve 2");
            await rdioNFT.connect(user1).approve(rdioMarketplace.address, 5);
            console.log("approve 3");

            await rdioMarketplace.connect(user1).sellNFT(0, initialNFTBuyPrice);
            console.log("sell 1");
            await rdioMarketplace.connect(user1).sellNFT(3, initialNFTBuyPrice);
            console.log("sell 2");
            await rdioMarketplace.connect(user1).sellNFT(5, initialNFTBuyPrice);
            console.log("sell 3");
          });

          it("getAllNFTsForSale should return an array of all the NFTs that have been listed for sale", async () => {
            const itemsForSale: MarketItem[] =
              await rdioMarketplace.getAllNFTsForSale();

            expect(itemsForSale.length).to.equal(3);

            const idsForSale = [0, 3, 5];

            // check that the IDs of the NFTs for sale are correct
            expect(
              itemsForSale.every((i) =>
                idsForSale.some((j) => j === i.tokenID.toNumber())
              )
            );
          });
        });
      });
    });
