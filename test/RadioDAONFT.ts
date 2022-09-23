import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { assert, expect } from "chai";
import { network, deployments, ethers } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("RadioDAONFT Unit Tests", () => {
      async function deployNFTContractFixture() {
        const URIs = [
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

        const [owner, otherAccount] = await ethers.getSigners();

        const RadioDAONFT = await ethers.getContractFactory("RadioDAONFT");
        const rdioNFT = await RadioDAONFT.deploy(URIs);

        return { rdioNFT, URIs, name, symbol, owner, otherAccount };
      }

      describe("Deployment, Construction and Initialisation", () => {
        it("Should set the s_isInitialised flag storage variable correctly", async () => {
          const { rdioNFT } = await loadFixture(deployNFTContractFixture);

          expect(await rdioNFT.getInitialisedFlag()).to.be.true;
        });

        it("Should set the s_tokenURIs storage variable correctly", async () => {
          const { rdioNFT, URIs } = await loadFixture(deployNFTContractFixture);

          for (let i = 0; i < URIs.length; i++) {
            expect(await rdioNFT.getTokenURI(i)).to.equal(URIs[i]);
          }
        });

        it("Should set the right owner", async () => {
          const { rdioNFT, owner } = await loadFixture(
            deployNFTContractFixture
          );

          expect(await rdioNFT.owner()).to.equal(owner.address);
        });

        it("Should set the ERC721 name and symbol correctly", async () => {
          const { rdioNFT, name, symbol } = await loadFixture(
            deployNFTContractFixture
          );

          expect(await rdioNFT.name()).to.equal(name);
          expect(await rdioNFT.symbol()).to.equal(symbol);
        });
      });

      describe("Getters", () => {
        describe("Validations", () => {
          it("Should revert with the RangeOutOfBounds error if getTokenURI is called with an out of bounds index", async () => {
            const { rdioNFT } = await loadFixture(deployNFTContractFixture);

            await expect(rdioNFT.getTokenURI(21)).to.be.revertedWith(
              "Requested token URI index not within bounds."
            );
          });

          it("Shouldn't revert if getTokenURI is called with an in bounds index", async () => {
            const { rdioNFT, URIs } = await loadFixture(
              deployNFTContractFixture
            );

            expect(await rdioNFT.getTokenURI(3)).to.equal(URIs[3]);
          });
        });
      });

      describe("Minting", () => {
        describe("Events", () => {
          it("Should emit an NFTMinted and an NFTTokenURISet event on mint", async () => {
            const { rdioNFT, URIs, owner } = await loadFixture(
              deployNFTContractFixture
            );

            expect(await rdioNFT.mintNFT())
              .to.emit(rdioNFT, "NFTMinted")
              .withArgs(owner.address, 0)
              .to.emit(rdioNFT, "NFTTokenURISet")
              .withArgs(0, URIs[0]);
          });
        });

        it("Should return the new token ID", async () => {
          const { rdioNFT } = await loadFixture(deployNFTContractFixture);

          expect((await rdioNFT.mintNFT()).value).to.equal(0);
        });

        it("Should increment the token counter", async () => {
          const { rdioNFT } = await loadFixture(deployNFTContractFixture);

          await rdioNFT.mintNFT();

          expect(await rdioNFT.getTokenCounter()).to.equal(1);
        });
      });
    });
