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
      const symbol = "RDIO";
      const MAX_TOKENS = 16;

      let deployer: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress;
      let RadioDAONFTFactory: ContractFactory;
      let rdioNFT: Contract;

      beforeEach(async () => {
        [deployer, user1, user2] = await ethers.getSigners();

        RadioDAONFTFactory = await ethers.getContractFactory("RadioDAONFT");

        rdioNFT = await RadioDAONFTFactory.deploy(testURIs);
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

        it("Should set the ERC721 name and symbol correctly", async () => {
          expect(await rdioNFT.name()).to.equal(name);
          expect(await rdioNFT.symbol()).to.equal(symbol);
        });

        it("Should mint all MAX_TOKENS NFTs and send them to the deployer", async () => {
          expect(await rdioNFT.balanceOf(deployer.address)).to.equal(
            MAX_TOKENS
          );

          // check all token URIs were set correctly
          await Promise.all(
            testURIs.map(async (uri, index) => {
              expect(await rdioNFT.tokenURI(index)).to.equal(uri);
            })
          );
        });

        it("Should self-delegate the deployer a voting power equal to MAX_TOKENS", async () => {
          expect(await rdioNFT.getVotes(deployer.address)).to.equal(MAX_TOKENS);
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
          const user1Items = await rdioNFT
            .connect(user1)
            .getUserNFTs(user1.address);
          expect(user1Items).to.be.empty;
        });

        it("Should fetch all NFTs that the user owns", async () => {
          const ownedByDeployer = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
          ];
          const deployerNFTs = await rdioNFT
            .connect(deployer)
            .getUserNFTs(deployer.address);

          expect(deployerNFTs.length).to.equal(16);

          expect(
            deployerNFTs.every((i) =>
              ownedByDeployer.some((j) => j === i.toNumber())
            )
          ).to.be.true;
        });
      });
    });
