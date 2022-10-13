import React, { useEffect, useState } from "react";

import { Contract, utils } from "ethers";
import { useEthers } from "@usedapp/core";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useGetVotes } from "../../../../../hooks/radioDAONFT";
import { useApproveAndSellNFT } from "../../../../../hooks/radioDAOMarketplace";

import ModalCloseButton from "../../../../shared/ModalFeatures/ModalCloseButton";
import ModalPlayer from "../../../../shared/ModalFeatures/ModalPlayer/ModalPlayer";

import NelthereumABI from "../../../../../constants/NelthereumABI.json";
import RadioDAONFTABI from "../../../../../constants/RadioDAONFTABI.json";
import ContractAddresses from "../../../../../constants/ContractAddresses.json";

const modalBoxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "primary.light",
  border: "2px solid #e8bd30",
  boxShadow: 24,
  p: 2,
  outline: "none",
};

interface CollectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  nftContract: Contract;
  marketplaceContract: Contract;
  tokenID: number;
  songTitle: string | undefined;
  songArtist: string | undefined;
  imageURI: string | undefined;
  audioURI: string | undefined;
  marketplaceFee: string;
}

function CollectionModal({
  isVisible,
  onClose,
  nftContract,
  marketplaceContract,
  tokenID,
  songTitle,
  songArtist,
  imageURI,
  audioURI,
  marketplaceFee,
}: CollectionModalProps) {
  const [sellBtnLoading, setSellBtnLoading] = useState<boolean>(false);
  const [sellPrice, setSellPrice] = useState<string>("");
  const [sellPriceFieldError, setSellPriceFieldError] =
    useState<boolean>(false);

  // get NEL contract
  const { account, chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  const nelABI = NelthereumABI["abi"];
  const nelInterface = new utils.Interface(nelABI);
  const nelAddress = ContractAddresses[networkName]["Nelthereum"];
  const nelContract = new Contract(nelAddress, nelInterface);

  // get function to make sell transaction
  const { approveAndSellNFTState, approveAndSellNFT } = useApproveAndSellNFT(
    nelContract,
    nftContract,
    marketplaceContract,
    marketplaceFee
  );

  // handler for when the sell button is pressed
  const handleSellButtonClick = async (priceToSell: string) => {
    if (priceToSell === "") {
      setSellPriceFieldError(true);
      return;
    }

    approveAndSellNFT(tokenID, utils.parseUnits(sellPrice, 18));
  };

  // use transaction states to set loading button state
  useEffect(() => {
    if (
      approveAndSellNFTState.status === "PendingSignature" ||
      approveAndSellNFTState.status === "Mining"
    ) {
      setSellBtnLoading(true);
    } else {
      setSellBtnLoading(false);
    }
  }, [approveAndSellNFTState]);

  // sellPrice control
  const handleSellPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSellPrice(event.target.value);
  };

  // validation checks on sellPrice
  useEffect(() => {
    if (Number(sellPrice)) {
      const sellPrice_Number: Number = Number(sellPrice);

      if (sellPrice_Number <= 0) {
        setSellPriceFieldError(true);
      } else {
        setSellPriceFieldError(false);
      }
    } else if (sellPrice !== "") {
      setSellPriceFieldError(true);
    } else {
      setSellPriceFieldError(false);
    }
  }, [sellPrice]);

  // DAO stuff
  const [registeredToVote, setRegisteredToVote] = useState<boolean>(false);
  const [proposeBtnLoading, setProposeBtnLoading] = useState<boolean>(false);

  // get RadioDAONFT ABI
  const nftABI = RadioDAONFTABI["abi"];

  const userVotes = useGetVotes(nftABI, nftContract.address);

  useEffect(() => {
    if (userVotes !== undefined) {
      if (Number(userVotes) > 0) {
        setRegisteredToVote(true);
      } else {
        setRegisteredToVote(false);
      }
    } else {
      setRegisteredToVote(false);
    }
  }, [userVotes]);

  // get function to make propose transaction
  // TODO: implement this hook

  // handler for when the propose button is pressed
  const handleProposeButtonClicked = async () => {
    console.log("Propose clicked!");
  };

  return (
    <Modal
      open={isVisible}
      onClose={onClose}
      aria-labelledby="modal-listing-modal"
      aria-describedby="modal-listing-modal-description"
    >
      <Box sx={modalBoxStyle}>
        <div
          className="flex flex-row items-center"
          style={{ justifyContent: "space-between" }}
        >
          <div className="flex flex-row items-end">
            <Typography
              id="modal-listing-modal"
              variant="h2"
              component="h2"
              color="primary.contrastText"
              fontFamily="Outfit"
              fontWeight="600"
            >
              {songTitle}
            </Typography>
            <Typography
              id="modal-listing-modal-description"
              variant="h4"
              component="h4"
              color="primary.contrastText"
              fontFamily="Outfit"
              fontWeight="600"
              sx={{
                marginBottom: "5px",
              }}
            >
              <div className="flex flex-row ml-3">{"by " + songArtist}</div>
            </Typography>
          </div>
          <ModalCloseButton onClick={onClose} />
        </div>
        <div className="flex flex-row mt-4 justify-center items-center">
          <div className="basis-1/2 pl-6">
            <img
              className=""
              src={imageURI}
              alt="nft song art"
              height="400"
              width="400"
              style={{ marginRight: "200px" }}
            />
          </div>

          <div className="flex flex-col basis-1/2 pt-20 px-10">
            <Tooltip
              title={
                registeredToVote
                  ? ""
                  : "You need to register to vote! Head to the Voting page."
              }
            >
              <div className="flex mb-20 justify-center">
                <LoadingButton
                  disabled={!registeredToVote}
                  loading={proposeBtnLoading}
                  loadingIndicator={
                    <CircularProgress color="secondary" size={24} />
                  }
                  variant="contained"
                  color="secondary"
                  sx={{
                    fontFamily: "Outfit",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                  onClick={handleProposeButtonClicked}
                >
                  Propose Song
                </LoadingButton>
              </div>
            </Tooltip>
            <ModalPlayer audioURI={audioURI as string} />
          </div>
        </div>
        <div className="flex justify-center mt-16 mb-8 gap-8">
          <TextField
            required
            value={sellPrice}
            onChange={handleSellPriceChange}
            label="Price to Sell (in NEL)"
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"
            sx={{ backgroundColor: "#e8bd30" }}
            error={sellPriceFieldError}
            helperText={
              sellPriceFieldError ? "Please input a valid sell price" : ""
            }
          />
          <LoadingButton
            loading={sellBtnLoading}
            loadingIndicator={<CircularProgress color="secondary" size={24} />}
            variant="contained"
            color="secondary"
            sx={{ fontFamily: "Outfit", fontSize: "1rem", fontWeight: "600" }}
            onClick={() => handleSellButtonClick(sellPrice)}
          >
            Sell NFT
          </LoadingButton>
        </div>
      </Box>
    </Modal>
  );
}

export default CollectionModal;
