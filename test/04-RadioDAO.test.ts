import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, BigNumberish } from "ethers";
import { deployments, ethers, network } from "hardhat";

import {
  Nelthereum,
  RadioDAOMarketplace,
  RadioDAONFT,
  RadioDAO,
  RadioTimelock,
  Radio,
} from "../typechain-types";

import { developmentChains } from "../helper-hardhat-config";
import { moveBlocks, moveTime } from "../scripts/utils";

const toWei = (num: Number) => ethers.utils.parseEther(num.toString());
const fromWei = (num: BigNumberish) => ethers.utils.formatEther(num);

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("RadioDAO Integration Tests", () => {
      const AGAINST_VOTE = 0;
      const FOR_VOTE = 1;
      const ABSTAIN_VOTE = 2;

      const INITIAL_NFT_BUY_PRICE = toWei(1);

      let deployer: SignerWithAddress, user1: SignerWithAddress;
      let nel: Nelthereum;
      let rdioMarketplace: RadioDAOMarketplace;
      let rdioNFT: RadioDAONFT;
      let dao: RadioDAO;
      let timelock: RadioTimelock;
      let radio: Radio;

      let votingDelay: BigNumber, votingPeriod: BigNumber, minDelay: BigNumber;

      beforeEach(async () => {
        [deployer, user1] = await ethers.getSigners();

        await deployments.fixture(["all"]);

        nel = await ethers.getContract("Nelthereum");
        rdioMarketplace = await ethers.getContract("RadioDAOMarketplace");
        rdioNFT = await ethers.getContract("RadioDAONFT");
        dao = await ethers.getContract("RadioDAO");
        timelock = await ethers.getContract("RadioTimelock");
        radio = await ethers.getContract("Radio");

        votingDelay = await dao.votingDelay();
        votingPeriod = await dao.votingPeriod();
        minDelay = await timelock.getMinDelay();

        await nel.connect(user1).requestTokens();
      });

      describe("Radio Functionality", () => {
        it("Should only allow the Radio's state to be changed through governance", async () => {
          await expect(
            radio.queueSong("here is a song uri")
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });
      });

      describe("Governance Workflow", () => {
        beforeEach(async () => {
          // deployer delists NFT from marketplace
          await rdioMarketplace.connect(deployer).delistNFT(3);

          // user1 buys NFT from marketplace
          await nel
            .connect(user1)
            .approve(rdioMarketplace.address, INITIAL_NFT_BUY_PRICE);
          await rdioMarketplace.connect(user1).buyNFT(9);
        });

        it("Should propose, vote FOR, wait, queue, and then execute", async () => {
          // propose
          console.log("\n\t\tProposing ...");
          const encodedFunctionCall = radio.interface.encodeFunctionData(
            "queueSong",
            ["song uri"]
          );

          const proposeTxn = await dao
            .connect(deployer)
            .propose(
              [radio.address],
              [0],
              [encodedFunctionCall],
              'Queue the song with URI "song uri"'
            );
          const proposeReceipt = await proposeTxn.wait(1);

          const proposalId = proposeReceipt.events![0].args!.proposalId;
          let proposalState = await dao.state(proposalId);

          // proposal state should be 0 == Pending
          assert.equal(proposalState.toString(), "0");

          console.log(
            `\t\tCurrent state of Proposal ${proposalId} is: ${proposalState}`
          );

          // wait
          console.log("\n\t\t... Waiting ...\n");
          await moveBlocks(votingDelay.add(1).toNumber());

          // vote
          console.log("\n\t\tVoting ...");
          const voteTxn = await dao.castVoteWithReason(
            proposalId,
            FOR_VOTE,
            "This is my favourite song"
          );
          await voteTxn.wait(1);

          proposalState = await dao.state(proposalId);

          // proposal state should be 1 == Active
          assert.equal(proposalState.toString(), "1");

          console.log(
            `\t\tCurrent state of Proposal ${proposalId} is: ${proposalState}`
          );

          // wait
          console.log("\n\t\t... Waiting ...\n");
          await moveBlocks(votingPeriod.add(10).toNumber());

          expect(await dao.hasVoted(proposalId, deployer.address)).to.be.true;

          proposalState = await dao.state(proposalId);

          // proposal state should be 4 == Succeeded
          assert.equal(proposalState.toString(), "4");

          console.log(
            `\t\tCurrent state of Proposal ${proposalId} is: ${proposalState}`
          );

          // queue
          console.log("\n\t\tQueueing ...");
          const descriptionHash = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes('Queue the song with URI "song uri"')
          );

          const queueTxn = await dao.queue(
            [radio.address],
            [0],
            [encodedFunctionCall],
            descriptionHash
          );
          await queueTxn.wait(1);

          // wait
          console.log("\n\t\t... Waiting ...\n");
          await moveTime(minDelay.add(1).toNumber());
          await moveBlocks(1);

          proposalState = await dao.state(proposalId);

          // proposal state should be 5 == Queued
          assert.equal(proposalState.toString(), "5");

          console.log(
            `\t\tCurrent state of Proposal ${proposalId} is: ${proposalState}`
          );

          // execute
          console.log("\n\t\tExecuting ...");
          const executeTxn = await dao.execute(
            [radio.address],
            [0],
            [encodedFunctionCall],
            descriptionHash
          );
          await executeTxn.wait(1);

          proposalState = await dao.state(proposalId);

          // proposal state should be 7 == Executed
          assert.equal(proposalState.toString(), "7");

          console.log(
            `\t\tCurrent state of Proposal ${proposalId} is: ${proposalState}`
          );

          expect(await radio.getNextSong()).to.equal("song uri");
        });

        it("Should propose, vote AGAINST, and then be rejected", async () => {
          // propose
          console.log("\n\t\tProposing ...");
          const encodedFunctionCall = radio.interface.encodeFunctionData(
            "queueSong",
            ["song uri"]
          );

          const proposeTxn = await dao
            .connect(deployer)
            .propose(
              [radio.address],
              [0],
              [encodedFunctionCall],
              'Queue the song with URI "song uri"'
            );
          const proposeReceipt = await proposeTxn.wait(1);

          const proposalId = proposeReceipt.events![0].args!.proposalId;
          let proposalState = await dao.state(proposalId);

          // proposal state should be 0 == Pending
          assert.equal(proposalState.toString(), "0");

          console.log(
            `\t\tCurrent state of Proposal ${proposalId} is: ${proposalState}`
          );

          // wait
          console.log("\n\t\t... Waiting ...\n");
          await moveBlocks(votingDelay.add(1).toNumber());

          // vote
          console.log("\n\t\tVoting ...");
          const voteTxn = await dao.castVoteWithReason(
            proposalId,
            AGAINST_VOTE,
            "This is my favourite song"
          );
          await voteTxn.wait(1);

          proposalState = await dao.state(proposalId);

          // proposal state should be 1 == Active
          assert.equal(proposalState.toString(), "1");

          console.log(
            `\t\tCurrent state of Proposal ${proposalId} is: ${proposalState}`
          );

          // wait
          console.log("\n\t\t... Waiting ...\n");
          await moveBlocks(votingPeriod.add(10).toNumber());

          expect(await dao.hasVoted(proposalId, deployer.address)).to.be.true;

          proposalState = await dao.state(proposalId);

          // proposal state should be 3 == Defeated
          assert.equal(proposalState.toString(), "3");

          console.log(
            `\t\tCurrent state of Proposal ${proposalId} is: ${proposalState}`
          );

          // queue
          console.log("\n\t\tAttempting to Queue ...");
          const descriptionHash = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes('Queue the song with URI "song uri"')
          );

          await expect(
            dao.queue(
              [radio.address],
              [0],
              [encodedFunctionCall],
              descriptionHash
            )
          ).to.be.rejectedWith("Governor: proposal not successful");
        });

        it("Should allow anyone to execute a proposal", async () => {
          // propose
          console.log("\n\t\tProposing ...");
          const encodedFunctionCall = radio.interface.encodeFunctionData(
            "queueSong",
            ["song uri"]
          );

          const proposeTxn = await dao
            .connect(deployer)
            .propose(
              [radio.address],
              [0],
              [encodedFunctionCall],
              'Queue the song with URI "song uri"'
            );
          const proposeReceipt = await proposeTxn.wait(1);

          const proposalId = proposeReceipt.events![0].args!.proposalId;
          let proposalState = await dao.state(proposalId);

          // proposal state should be 0 == Pending
          assert.equal(proposalState.toString(), "0");

          console.log(
            `\t\tCurrent state of Proposal ${proposalId} is: ${proposalState}`
          );

          // wait
          console.log("\n\t\t... Waiting ...\n");
          await moveBlocks(votingDelay.add(1).toNumber());

          // vote
          console.log("\n\t\tVoting ...");
          const voteTxn = await dao.castVoteWithReason(
            proposalId,
            FOR_VOTE,
            "This is my favourite song"
          );
          await voteTxn.wait(1);

          proposalState = await dao.state(proposalId);

          // proposal state should be 1 == Active
          assert.equal(proposalState.toString(), "1");

          console.log(
            `\t\tCurrent state of Proposal ${proposalId} is: ${proposalState}`
          );

          // wait
          console.log("\n\t\t... Waiting ...\n");
          await moveBlocks(votingPeriod.add(10).toNumber());

          expect(await dao.hasVoted(proposalId, deployer.address)).to.be.true;

          proposalState = await dao.state(proposalId);

          // proposal state should be 4 == Succeeded
          assert.equal(proposalState.toString(), "4");

          console.log(
            `\t\tCurrent state of Proposal ${proposalId} is: ${proposalState}`
          );

          // queue
          console.log("\n\t\tQueueing ...");
          const descriptionHash = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes('Queue the song with URI "song uri"')
          );

          const queueTxn = await dao.queue(
            [radio.address],
            [0],
            [encodedFunctionCall],
            descriptionHash
          );
          await queueTxn.wait(1);

          // wait
          console.log("\n\t\t... Waiting ...\n");
          await moveTime(minDelay.add(1).toNumber());
          await moveBlocks(1);

          proposalState = await dao.state(proposalId);

          // proposal state should be 5 == Queued
          assert.equal(proposalState.toString(), "5");

          console.log(
            `\t\tCurrent state of Proposal ${proposalId} is: ${proposalState}`
          );

          // execute
          console.log("\n\t\tExecuting from another account...");
          const executeTxn = await dao
            .connect(user1)
            .execute(
              [radio.address],
              [0],
              [encodedFunctionCall],
              descriptionHash
            );
          await executeTxn.wait(1);

          proposalState = await dao.state(proposalId);

          // proposal state should be 7 == Executed
          assert.equal(proposalState.toString(), "7");

          console.log(
            `\t\tCurrent state of Proposal ${proposalId} is: ${proposalState}`
          );

          expect(await radio.getNextSong()).to.equal("song uri");
        });
      });
    });

/* FYI, proposal states are as follows:
    - 0 == Pending
    - 1 == Active
    - 2 == Cancelled
    - 3 == Defeated
    - 4 == Succeeded
    - 5 == Queued
    - 6 == Expired
    - 7 == Executed
*/
