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
  : describe("Nelthereum Unit Tests", () => {
      const name = "Nelthereum";
      const symbol = "NEL";
      const INITIAL_SUPPLY = toWei(100);
      const FAUCET_DRIP_AMOUNT = toWei(10);

      let owner: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress;
      let NELFactory: ContractFactory;
      let nel: Contract;

      beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();

        NELFactory = await ethers.getContractFactory("Nelthereum");

        nel = await NELFactory.deploy();
      });

      describe("Deployment and Construction", () => {
        it("Should set the ERC20 name and symbol correctly", async () => {
          expect(await nel.name()).to.equal(name);
          expect(await nel.symbol()).to.equal(symbol);
        });

        it("Should mint the correct INITIAL_SUPPLY of tokens", async () => {
          const totalSupply = await nel.totalSupply();

          expect(totalSupply.toString()).to.equal(INITIAL_SUPPLY);
        });
      });

      describe("Faucet Functionality", () => {
        it("Should distribute the correct amount (FAUCET_DRIP_AMOUNT) of tokens via requestTokens", async () => {
          await nel.connect(user1).requestTokens();

          expect(await nel.balanceOf(user1.address)).to.equal(
            FAUCET_DRIP_AMOUNT
          );
        });

        describe("Event Emittance", () => {
          it("Should emit a FaucetDispensed event", async () => {
            await expect(nel.connect(user1).requestTokens())
              .to.emit(nel, "FaucetDispensed")
              .withArgs(user1.address);
          });
        });
      });

      describe("Transfers", () => {
        const tokensToSend = toWei(5);

        it("Should be able to transfer tokens successfully to an address", async () => {
          await nel.connect(owner).transfer(user1.address, tokensToSend);

          expect(await nel.balanceOf(user1.address)).to.equal(tokensToSend);
        });

        describe("Event Emittance", () => {
          it("Should emit a Transfer event", async () => {
            await expect(
              nel.connect(owner).transfer(user1.address, tokensToSend)
            )
              .to.emit(nel, "Transfer")
              .withArgs(owner.address, user1.address, tokensToSend);
          });
        });
      });

      describe("Approvals and Allowances", () => {
        const tokenAmount = toWei(20);

        it("Should accurately set the allowance", async () => {
          await nel.connect(owner).approve(user1.address, tokenAmount);

          expect(await nel.allowance(owner.address, user1.address)).to.equal(
            tokenAmount
          );
        });

        it("Should approve another address to transfer tokens", async () => {
          await nel.connect(owner).approve(user1.address, tokenAmount);

          await nel
            .connect(user1)
            .transferFrom(owner.address, user2.address, tokenAmount);

          expect(await nel.balanceOf(user2.address)).to.equal(tokenAmount);
        });

        describe("Validation", () => {
          it("Should not allow an unapproved address to make transfers", async () => {
            await expect(
              nel
                .connect(user1)
                .transferFrom(owner.address, user2.address, tokenAmount)
            ).to.be.revertedWith("ERC20: insufficient allowance");
          });

          it("Should not allow a user to go over the allowance", async () => {
            await nel.connect(owner).approve(user1.address, tokenAmount);

            await expect(
              nel
                .connect(user1)
                .transferFrom(owner.address, user2.address, toWei(50))
            ).to.be.revertedWith("ERC20: insufficient allowance");
          });
        });

        describe("Event Emittance", () => {
          it("Emits an approval event, when an approval occurs", async () => {
            await expect(nel.connect(owner).approve(user1.address, tokenAmount))
              .to.emit(nel, "Approval")
              .withArgs(owner.address, user1.address, tokenAmount);
          });
        });
      });
    });
