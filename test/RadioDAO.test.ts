import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import {
  BigNumber,
  BigNumberish,
  constants,
  Contract,
  ContractFactory,
} from "ethers";
import { deployments, ethers, network } from "hardhat";

import {
  RadioDAONFT,
  RadioDAO,
  RadioTimelock,
  Radio,
} from "../typechain-types";

import { developmentChains } from "../helper-hardhat-config";
import { moveBlocks, moveTime } from "../scripts/utils";
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("RadioDAO Integration Tests", () => {
      let deployer: SignerWithAddress;
      let rdioNFT: RadioDAONFT;
      let dao: RadioDAO;
      let timelock: RadioTimelock;
      let radio: Radio;

      let votingDelay: BigNumber, votingPeriod: BigNumber, minDelay: BigNumber;

      beforeEach(async () => {
        [deployer] = await ethers.getSigners();

        await deployments.fixture(["all"]);

        rdioNFT = await ethers.getContract("RadioDAONFT");
        dao = await ethers.getContract("RadioDAO");
        timelock = await ethers.getContract("RadioTimelock");
        radio = await ethers.getContract("Radio");

        votingDelay = await dao.votingDelay();
        votingPeriod = await dao.votingPeriod();
        minDelay = await timelock.getMinDelay();

        console.log(
          "pre-delegate deployer votes: ",
          await rdioNFT.getVotes(deployer.address)
        );
        await rdioNFT.delegate(deployer.address);
        console.log(
          "deployer votes: ",
          await rdioNFT.getVotes(deployer.address)
        );

        await rdioNFT.transferFrom(
          deployer.address,
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          "0"
        );

        console.log(
          "after transfer deployer votes: ",
          await rdioNFT.getVotes(deployer.address)
        );
        console.log(
          "after transfer user1 votes: ",
          await rdioNFT.getVotes("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
        );

        await rdioNFT.delegate("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
        console.log(
          "deployer votes: ",
          await rdioNFT.getVotes(deployer.address)
        );
        console.log(
          "after delegate user1 votes: ",
          await rdioNFT.getVotes("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
        );
      });

      describe("Radio Functionality", () => {
        it("Should only allow the Radio's state to be changed through governance", async () => {
          await expect(
            radio.queueSong("here is a song uri")
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });
      });

      describe("Governance Workflow", () => {
        it("Should propose, vote, wait, queue, and then execute", async () => {
          // propose
          console.log("\nProposing ...");
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

          console.log(
            `Current state of Proposal ${proposalId} is: ${proposalState}`
          );

          // wait
          console.log("\n... Waiting ...\n");
          await moveBlocks(votingDelay.add(1).toNumber());

          // vote
          console.log("\nVoting ...");
          const voteTxn = await dao.castVoteWithReason(
            proposalId,
            2,
            "This is my favourite song"
          );
          await voteTxn.wait(1);

          proposalState = await dao.state(proposalId);

          assert.equal(proposalState.toString(), "1");

          console.log(
            `Current state of Proposal ${proposalId} is: ${proposalState}`
          );

          // wait
          console.log("\n... Waiting ...\n");
          await moveBlocks(votingPeriod.add(10).toNumber());

          console.log(
            `Current state of Proposal ${proposalId} is: ${proposalState}`
          );

          // queue
          console.log("\nQueueing ...");
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
          console.log("\n... Waiting ...\n");
          await moveTime(minDelay.add(1).toNumber());
          await moveBlocks(1);

          proposalState = await dao.state(proposalId);
          console.log(
            `Current state of Proposal ${proposalId} is: ${proposalState}`
          );

          // execute
          console.log("\nExecuting ...");
          const executeTxn = await dao.execute(
            [radio.address],
            [0],
            [encodedFunctionCall],
            descriptionHash
          );
          await executeTxn.wait(1);

          expect(await radio.getNextSong()).to.equal("song uri");
        });
      });
    });
