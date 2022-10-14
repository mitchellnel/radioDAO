import React, { useState } from "react";

import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useEthers } from "@usedapp/core";
import { Contract, utils } from "ethers";

import { useGetAllProposalInformation } from "../../../hooks/radioDAO";

import ContractAddresses from "../../../constants/ContractAddresses.json";
import RadioDAOABI from "../../../constants/RadioDAOABI.json";
import { ProposalInformation } from "../../../types/types";

function VotingTabs() {
  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  // get RadioDAO contract
  const daoABI = RadioDAOABI["abi"];
  const daoInterface = new utils.Interface(daoABI);
  const daoAddress = ContractAddresses[networkName]["RadioDAO"];
  const daoContract = new Contract(daoAddress, daoInterface);

  const [tabValue, setTabValue] = useState<string>("no-active-proposals");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  // get the active proposals
  const proposals: ProposalInformation[] = useGetAllProposalInformation(
    daoABI,
    daoAddress
  );

  return (
    <div className="flex w-full justify-center content-center">
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "90%" }}>
          <TabList
            onChange={handleTabChange}
            aria-label="proposal-tab-list"
            centered
          >
            {proposals.length !== 0 &&
            proposals.filter((proposal) => proposal.state === 1).length !==
              0 ? (
              proposals?.map((proposal) => {
                if (proposal.state === 1) {
                  console.log("fds");
                  const value = String(proposal.id);

                  return (
                    <Tab
                      key={value}
                      label={truncateString(value, 15)}
                      value={value}
                    />
                  );
                }
              })
            ) : (
              <Tab label="No active proposals" value="no-active-proposals" />
            )}
          </TabList>
        </Box>
      </TabContext>
    </div>
  );
}

export default VotingTabs;

function truncateString(str: string, strLen: number): string {
  if (str.length <= strLen) return str;

  const separator = "...";

  const nCharsToShow = strLen - separator.length;

  const frontChars = Math.ceil(nCharsToShow / 2);
  const backChars = Math.floor(nCharsToShow / 2);

  return (
    str.substring(0, frontChars) +
    separator +
    str.substring(str.length - backChars)
  );
}
