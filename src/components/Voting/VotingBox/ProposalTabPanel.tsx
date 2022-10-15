import React, { useEffect, useState } from "react";

import { TabPanel } from "@mui/lab";

import { ProposalInformation } from "../../../types/types";
import { RadioDAONFTMetadata } from "../../../../scripts/types";
import NFTModalArt from "../../shared/NFTModalFeatures/NFTModalArt";
import { Typography } from "@mui/material";
import NFTModalTitle from "../../shared/NFTModalFeatures/NFTModalTitle";

interface ProposalTabPanelProps {
  proposal: ProposalInformation;
}

function ProposalTabPanel({ proposal }: ProposalTabPanelProps) {
  const [songTitle, setSongTitle] = useState<string>("");
  const [songArtist, setSongArtist] = useState<string>("");
  const [imageURI, setImageURI] = useState<string>("");
  const [audioURI, setAudioURI] = useState<string>("");

  const tokenURI = proposal.description.split("$")[1];
  const panelValue = String(proposal.id);

  // update the UI when we get the token URI
  useEffect(() => {
    const updateUI = async () => {
      if (tokenURI) {
        const requestURL = tokenURI
          .toString()
          .replace("ipfs://", "https://ipfs.io/ipfs/");
        const tokenURIResponse: RadioDAONFTMetadata = await (
          await fetch(requestURL)
        ).json();

        setSongTitle(tokenURIResponse.title);
        setSongArtist(tokenURIResponse.artist);
        setImageURI(
          tokenURIResponse.image.replace("ipfs://", "https://ipfs.io/ipfs/")
        );
        setAudioURI(
          tokenURIResponse.audio.replace("ipfs://", "https://ipfs.io/ipfs/")
        );
      }
    };
    updateUI();
  }, [tokenURI]);

  return (
    <div style={{ marginTop: "-20px" }}>
      <TabPanel value={panelValue}>
        <div className="flex flex-col gap-4">
          <Typography
            id="tab-panel-title"
            variant="h2"
            component="h2"
            color="primary.main"
            fontFamily="Outfit"
            fontSize="3.5rem"
            fontWeight="600"
          >
            Next song: {songTitle} by {songArtist}
          </Typography>
          <div className="flex flex-row">
            <div className="basis-1/2">
              <NFTModalArt imageURI={imageURI} />
            </div>
            <div className="flex flex-col basis-1/2 mt-10 gap-y-40">
              <div className="flex flex-row justify-center">
                <p>Votes For</p>
                <p>Votes Against</p>
              </div>
              <div className="flex flex-row justify-center">
                <p>Vote for BTN</p>
                <p>Vote against BTN</p>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
    </div>
  );
}

export default ProposalTabPanel;
