// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../contracts/MVP_FundsTransferable.sol";

// This is a faucet contract for testing our clients easily
contract Faucet is ERC20, FundsTransferable {
    constructor() payable ERC20("Faucet Coin", "FC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function requestTokensFor(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function requestTokens(uint256 amount) public {
        requestTokensFor(msg.sender, amount);
    }

    function requestEthFor(address payable to, uint256 amount) public {}

    function requestEth(uint256 amount) public {
        requestEthFor(payable(msg.sender), amount);
    }

    function deposit(uint256 amount) public payable {
        require(msg.value == amount);
    }
}
