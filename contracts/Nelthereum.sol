// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Nelthereum is ERC20 {
    // ERC20 Variables
    uint256 constant INITIAL_SUPPLY = 100_000_000_000_000_000_000;
    uint256 constant FAUCET_DRIP_AMOUNT = 10_000_000_000_000_000_000;

    // ERC20 Events
    event FaucetDispensed(address indexed requester);

    constructor() ERC20("Nelthereum", "NEL") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function requestTokens() external {
        _mint(msg.sender, FAUCET_DRIP_AMOUNT);
    }
}
