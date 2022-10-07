// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract RadioTimelock is TimelockController {
    // minDelay - how long we have to wait before executing == 1 block ~ 12s
    constructor(
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(12, proposers, executors, admin) {}
}
