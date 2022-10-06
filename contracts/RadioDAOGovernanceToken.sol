// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract RadioDAOGovernanceToken is ERC20Votes {
    uint256 public s_maxSupply = 16;

    constructor()
        ERC20("RadioDAOGovernanceToken", "RDIO")
        ERC20Permit("RadioDAOGovernanceToken")
    {
        _mint(msg.sender, s_maxSupply);
    }

    // Overrided functions (required by Solidity) //
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._burn(account, amount);
    }

    //
}
