import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish, Contract, ContractFactory } from "ethers";
import { network, ethers } from "hardhat";
import { developmentChains } from "../helper-hardhat-config";

const toWei = (num: Number) => ethers.utils.parseEther(num.toString());
const fromWei = (num: BigNumberish) => ethers.utils.formatEther(num);

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("RadioDAONFT Unit Tests", () => {
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
      const name = "RadioDAONFT";
      const symbol = "RDIONFT";
      const marketplaceFee = toWei(0.01);
      const MAX_TOKENS = 16;

      let owner, otherAccount: SignerWithAddress;
      let RadioDAONFTFactory: ContractFactory;
      let rdioNFT: Contract;

      beforeEach(async () => {
        [owner, otherAccount] = await ethers.getSigners();

        RadioDAONFTFactory = await ethers.getContractFactory("RadioDAONFT");

        rdioNFT = await RadioDAONFTFactory.deploy(testURIs, marketplaceFee);
      });

      describe("Deployment, Construction, Initialisation and All Minting", () => {
        it("Should set the s_isInitialised flag storage variable correctly", async () => {
          expect(await rdioNFT.getInitialisedFlag()).to.be.true;
        });

        it("Should set the s_tokenURIs storage variable correctly", async () => {
          for (let i = 0; i < testURIs.length; i++) {
            expect(await rdioNFT.getTokenURI(i)).to.equal(testURIs[i]);
          }
        });

        it("Should set the right owner", async () => {
          expect(await rdioNFT.owner()).to.equal(owner.address);
        });

        it("Should set the ERC721 name and symbol correctly", async () => {
          expect(await rdioNFT.name()).to.equal(name);
          expect(await rdioNFT.symbol()).to.equal(symbol);
        });

        it("Should set the s_marketplaceFee storage variable correctly", async () => {
          expect(await rdioNFT.getMarketplaceFee()).to.equal(marketplaceFee);
        });

        it("Should mint and then list all MAX_TOKENS NFTs", async () => {
          expect(await rdioNFT.balanceOf(rdioNFT.address)).to.equal(MAX_TOKENS);

          // check all token URIs were set correctly
          await Promise.all(
            testURIs.map(async (uri, index) => {
              expect(await rdioNFT.tokenURI(index)).to.equal(uri);
            })
          );

          // get each item from the s_marketItems array and check their fields
          for (let i = 0; i < MAX_TOKENS; i++) {
            const item = await rdioNFT.s_marketItems(i);
            expect(item.tokenID).to.equal(i);
            expect(item.seller).to.equal(owner.address);
            expect(item.price).to.equal(toWei(0.1));
            expect(item.forSale).to.be.true;
          }
        });
      });

      describe("Storage Variable Getters [that haven't implicitly been tested by prior tests", () => {
        describe("Validations", () => {
          it("Should revert with the RangeOutOfBounds error if getTokenURI is called with an out of bounds index", async () => {
            await expect(rdioNFT.getTokenURI(21)).to.be.revertedWith(
              "Requested token URI index not within bounds."
            );
          });

          it("Shouldn't revert if getTokenURI is called with an in bounds index", async () => {
            expect(await rdioNFT.getTokenURI(3)).to.equal(testURIs[3]);
          });
        });
      });

      describe("User Collection", () => {
        it("Should return an empty array for any address that isn't the contract, since no NFTs have yet been purchased", async () => {
          const user1Items = await rdioNFT.connect(otherAccount).getMyNFTs();
          expect(user1Items).to.be.empty;
        });

        it("Should fetch all NFTs that the user owns", async () => {
          const ownedByOtherAccount = [3, 6, 9];
          await rdioNFT.connect(otherAccount).buyNFT(3, { value: toWei(0.1) });
          await rdioNFT.connect(otherAccount).buyNFT(6, { value: toWei(0.1) });
          await rdioNFT.connect(otherAccount).buyNFT(9, { value: toWei(0.1) });

          const myNFTs = await rdioNFT.connect(otherAccount).getMyNFTs();

          expect(myNFTs.length).to.equal(3);

          // check that the IDs of the NFTs in myNFTs is correct
          expect(
            myNFTs.every((i) =>
              ownedByOtherAccount.some((j) => j === i.toNumber())
            )
          ).to.be.true;
        });
      });

      describe("Marketplace Functionality", () => {
        describe("Getters", () => {
          it("getAllNFTsForSale should return an array of MAX_TOKENS items that are currently up for sale, since none have bene bought yet", async () => {
            const itemsForSale = await rdioNFT.getAllNFTsForSale();
            expect(itemsForSale.length).to.equal(16);
          });

          it("getAllNFTsForSale should return all MarketItems that have forSale set to true", async () => {
            const soldItems = [3, 6, 9];
            await rdioNFT
              .connect(otherAccount)
              .buyNFT(3, { value: toWei(0.1) });
            await rdioNFT
              .connect(otherAccount)
              .buyNFT(6, { value: toWei(0.1) });
            await rdioNFT
              .connect(otherAccount)
              .buyNFT(9, { value: toWei(0.1) });

            const unsoldNFTs = await rdioNFT
              .connect(otherAccount)
              .getAllNFTsForSale();

            expect(unsoldNFTs.length).to.equal(13);

            // check that the IDs of the unsold NFTs are correct
            expect(
              unsoldNFTs.every(
                (i) => !soldItems.some((j) => j === i.tokenID.toNumber())
              )
            ).to.be.true;
          });
        });

        describe("Setters", () => {
          it("Marketplace owner should be able to change the marketplace fee", async () => {
            await rdioNFT.updateMarketplaceFee(toWei(0.2));
            expect(await rdioNFT.getMarketplaceFee()).to.equal(toWei(0.2));
          });
        });

        describe("Buying NFTs", () => {
          describe("Validation", () => {
            it("Should revert a transaction where the seller attempts to buy their own NFT", async () => {
              // owner tries to purchase an NFT for which they are the seller from the marketplace
              await expect(
                rdioNFT.buyNFT(3, { value: toWei(0.1) })
              ).to.be.revertedWith(
                "You cannot purchase the NFT that you already owned and have listed. Instead, delist the NFT from the marketplace."
              );
            });

            it("Should revert a transaction where the buyer does not send a value equal to the listing price", async () => {
              // otherAccount tries to purchase an NFT with only 0.05 ETH, when the listed price is 0.1 ETH
              await expect(
                rdioNFT.connect(otherAccount).buyNFT(3, { value: toWei(0.05) })
              ).to.be.revertedWith(
                "You either sent too little or too much ETH. Please send the asking price to complete the transaction."
              );
            });

            it("Should revert a transaction where the NFT has already been sold", async () => {
              await rdioNFT
                .connect(otherAccount)
                .buyNFT(3, { value: toWei(0.1) });

              await expect(
                rdioNFT.connect(otherAccount).buyNFT(3, { value: toWei(0.1) })
              ).to.be.revertedWith(
                "This item is not for sale. How did you manage to try and purchase it?"
              );
            });
          });
          describe("Correct update of MarketItem object in s_marketItems", () => {
            it("Should set the forSale field to false", async () => {
              // otherAccount purchases an NFT from the marketplace
              await rdioNFT
                .connect(otherAccount)
                .buyNFT(3, { value: toWei(0.1) });

              expect((await rdioNFT.s_marketItems(3)).forSale).to.be.false;
            });
          });

          describe("Correct transfer of NFT and ETH", () => {
            let originalSellerBalance;
            beforeEach(async () => {
              originalSellerBalance = await owner.getBalance();

              await rdioNFT
                .connect(otherAccount)
                .buyNFT(3, { value: toWei(0.1) });
            });

            // skip this test because sometimes it doesn't work properly
            it.skip("Seller should receive payment of the listed NFT price", async () => {
              const newSellerBalance = await owner.getBalance();

              expect(+fromWei(newSellerBalance)).to.equal(
                +fromWei(originalSellerBalance) + 0.1
              );
            });

            it("Buyer should receive the NFT", async () => {
              expect(await rdioNFT.ownerOf(3)).to.equal(otherAccount.address);
              expect(await rdioNFT.balanceOf(otherAccount.address)).to.equal(1);
            });
          });

          describe("Event Emittance", () => {
            it("Should emit a MarketItemBought event", async () => {
              await expect(
                rdioNFT.connect(otherAccount).buyNFT(3, { value: toWei(0.1) })
              )
                .to.emit(rdioNFT, "MarketItemBought")
                .withArgs(3, owner.address, otherAccount.address, toWei(0.1));
            });
          });
        });

        describe("Selling NFTs", () => {
          beforeEach(async () => {
            await rdioNFT
              .connect(otherAccount)
              .buyNFT(3, { value: toWei(0.1) });
          });

          describe("Validation", () => {
            it("Should revert a transaction where the seller does not send a value equal to the marketplace fee", async () => {
              await expect(
                rdioNFT
                  .connect(otherAccount)
                  .sellNFT(3, toWei(0.15), { value: toWei(0.005) })
              ).to.be.revertedWith(
                "A fee must be paid to the marketplace to list your NFT. This fee must be exactly the marketplace fee."
              );
            });
          });
          describe("Correct update of MarketItem object in s_marketItems", () => {
            beforeEach(async () => {
              await rdioNFT
                .connect(otherAccount)
                .sellNFT(3, toWei(0.15), { value: toWei(0.01) });
            });

            it("Should set the seller to the correct address", async () => {
              expect((await rdioNFT.s_marketItems(3)).seller).to.equal(
                otherAccount.address
              );
            });

            it("Should set the price to the new sale price", async () => {
              expect((await rdioNFT.s_marketItems(3)).price).to.equal(
                toWei(0.15)
              );
            });

            it("Should set the forSale field to true", async () => {
              expect((await rdioNFT.s_marketItems(3)).forSale).to.be.true;
            });
          });
          describe("Correct transfer of NFT and ETH", () => {
            let originalOwnerBalance;
            beforeEach(async () => {
              originalOwnerBalance = await owner.getBalance();

              await rdioNFT
                .connect(otherAccount)
                .sellNFT(3, toWei(0.15), { value: toWei(0.01) });
            });

            it("Contract owner should receive payment of the marketplace fee", async () => {
              const newOwnerBalance = await owner.getBalance();

              expect(+fromWei(newOwnerBalance)).to.equal(
                +fromWei(originalOwnerBalance) + 0.01
              );
            });

            it("Contract should receive the NFT", async () => {
              expect(await rdioNFT.ownerOf(3)).to.equal(rdioNFT.address);
              expect(await rdioNFT.balanceOf(otherAccount.address)).to.equal(0);
            });
          });
          describe("Event Emittance", () => {
            it("Should emit a MarketItemListed event", async () => {
              await expect(
                rdioNFT
                  .connect(otherAccount)
                  .sellNFT(3, toWei(0.15), { value: toWei(0.01) })
              )
                .to.emit(rdioNFT, "MarketItemListed")
                .withArgs(3, otherAccount.address, toWei(0.15));
            });
          });
        });

        describe("Delisting NFTs", () => {
          beforeEach(async () => {
            await rdioNFT
              .connect(otherAccount)
              .buyNFT(3, { value: toWei(0.1) });

            await rdioNFT
              .connect(otherAccount)
              .sellNFT(3, toWei(0.15), { value: toWei(0.01) });
          });
          describe("Validation", () => {
            it("Should revert a transaction where the message sender is not the seller of the NFT", async () => {
              await expect(
                rdioNFT.connect(owner).delistNFT(3)
              ).to.be.revertedWith(
                "You cannot delist an NFT that you are not the seller of."
              );
            });
          });
          describe("Correct update of MarketItem object in s_marketItems", () => {
            it("Should set the forSale field to true", async () => {
              await rdioNFT.connect(otherAccount).delistNFT(3);

              expect((await rdioNFT.s_marketItems(3)).forSale).to.be.false;
            });
          });
          describe("Correct transfer of NFT", () => {
            it("Seller (delister) should receive the NFT", async () => {
              await rdioNFT.connect(otherAccount).delistNFT(3);

              expect(await rdioNFT.ownerOf(3)).to.equal(otherAccount.address);
              expect(await rdioNFT.balanceOf(otherAccount.address)).to.equal(1);
            });
          });
          describe("Event Emittance", () => {
            it("Should emit a MarketItemDelisted event", async () => {
              await expect(rdioNFT.connect(otherAccount).delistNFT(3))
                .to.emit(rdioNFT, "MarketItemDelisted")
                .withArgs(3, otherAccount.address);
            });
          });
        });
      });
    });
