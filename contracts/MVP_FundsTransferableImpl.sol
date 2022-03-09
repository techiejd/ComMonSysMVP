// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "../contracts/MVP_FundsTransferable.sol";

// Note: This file exists just so that we can test `FundsTransferable`
contract FundsTransferableImpl is FundsTransferable {
    constructor() payable {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // Must grant role to someone in order to test.
    }
}