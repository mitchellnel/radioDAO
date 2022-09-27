import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
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

      let owner, user1, user2, user3: SignerWithAddress;
      let RadioDAONFTFactory: ContractFactory;
      let rdioNFT: Contract;

      beforeEach(async () => {
        [owner, user1, user2, user3] = await ethers.getSigners();

        RadioDAONFTFactory = await ethers.getContractFactory("RadioDAONFT");

        rdioNFT = await RadioDAONFTFactory.deploy(testURIs);
      });

      describe("Deployment, Construction and Initialisation", () => {
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
      });

      describe("Getters", () => {
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

      describe("Minting", () => {
        describe("Events", () => {
          it("Should emit an NFTMinted and an NFTTokenURISet event on mint", async () => {
            expect(await rdioNFT.mintNFT())
              .to.emit(rdioNFT, "NFTMinted")
              .withArgs(owner.address, 0)
              .to.emit(rdioNFT, "NFTTokenURISet")
              .withArgs(0, testURIs[0]);
          });
        });

        it("Should return the new token ID", async () => {
          expect((await rdioNFT.mintNFT()).value).to.equal(0);
        });

        it("Should increment the token counter", async () => {
          await rdioNFT.mintNFT();

          expect(await rdioNFT.getTokenCounter()).to.equal(1);
        });
      });
    });
