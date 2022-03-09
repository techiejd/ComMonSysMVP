// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract FundsTransferable is AccessControl {
    event TransferredFunds(address indexed _transferer, address _to);

    function transferFundsTo(address payable to) public onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) { // Note: It's up to inheriting class to grant DEFAULT_ADMIN_ROLE
        to.transfer(address(this).balance);

        emit TransferredFunds(msg.sender, to);
        return true;
    }
}