import React, { useEffect, useState } from "react";

import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useEthers, useLogs } from "@usedapp/core";
import { BigNumber, Contract, utils } from "ethers";

import {
  useProposalState,
  useGetAllProposalInformation,
} from "../../../hooks/radioDAO";

import ContractAddresses from "../../../constants/ContractAddresses.json";
import RadioDAOABI from "../../../constants/RadioDAOABI.json";

function VotingTabs() {
  const { chainId } = useEthers();
  const networkName = chainId === 5 ? "goerli" : "localhost";

  // get RadiDAO contract
  const daoABI = RadioDAOABI["abi"];
  const daoInterface = new utils.Interface(daoABI);
  const daoAddress = ContractAddresses[networkName]["RadioDAO"];
  const daoContract = new Contract(daoAddress, daoInterface);

  const [tabValue, setTabValue] = useState<string>("1");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const proposals = useGetAllProposalInformation(daoABI, daoAddress);

  useEffect(() => {
    console.log(proposals);
  }, [proposals]);

  return (
    <div className="flex w-full justify-center content-center">
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "90%" }}>
          <TabList
            onChange={handleTabChange}
            aria-label="lab API tabs example"
            centered
          >
            <Tab label="Campfire" value="1" />
            <Tab label="Sandcastle" value="2" />
            <Tab label="Summer Nights" value="3" />
          </TabList>
        </Box>
      </TabContext>
    </div>
  );
}

export default VotingTabs;
