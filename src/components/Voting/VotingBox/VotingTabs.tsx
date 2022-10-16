import React, { useState } from "react";

import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useEthers } from "@usedapp/core";

import { useGetAllProposalInformation } from "../../../hooks/radioDAO";

import ProposalTabPanel from "./ProposalTabPanel";

import ContractAddresses from "../../../constants/ContractAddresses.json";
import RadioDAOABI from "../../../constants/RadioDAOABI.json";
import { ProposalInformation } from "../../../types";

function VotingTabs() {
  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  // get RadioDAO contract
  const daoABI = RadioDAOABI["abi"];
  const daoAddress = ContractAddresses[networkName]["RadioDAO"];

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
    <div className="flex flex-col w-full justify-center items-center content-center">
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "90%" }}>
          <TabList
            onChange={handleTabChange}
            aria-label="proposal-tab-list"
            centered
          >
            {proposals.length === 0 ||
            proposals.filter(
              (proposal) =>
                proposal.state === 1 ||
                proposal.state === 4 ||
                proposal.state === 5
            ).length !== 0 ? (
              // eslint-disable-next-line array-callback-return
              proposals?.map((proposal) => {
                if (
                  proposal.state === 1 ||
                  proposal.state === 4 ||
                  proposal.state === 5
                ) {
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
        {proposals.length === 0 ||
        proposals.filter(
          (proposal) =>
            proposal.state === 1 || proposal.state === 4 || proposal.state === 5
        ).length !== 0 ? (
          // eslint-disable-next-line array-callback-return
          proposals?.map((proposal) => {
            if (
              proposal.state === 1 ||
              proposal.state === 4 ||
              proposal.state === 5
            ) {
              const value = String(proposal.id);

              return <ProposalTabPanel key={value} proposal={proposal} />;
            }
          })
        ) : (
          <TabPanel value="no-active-proposals">
            There are no active proposals.
          </TabPanel>
        )}
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
