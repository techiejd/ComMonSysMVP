// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "../contracts/MVP_FundsTransferable.sol";

contract CommunityCoin is ERC20, AccessControl, FundsTransferable {
    event Converted(address indexed _convertor, address indexed _for, uint256 _value);
    bytes32 public constant CONVERTER_ROLE = keccak256("CONVERTER_ROLE");

    function convertFor(address cMember) public payable onlyRole(CONVERTER_ROLE) returns (bool) { // Note: Public instead of external so we can test.
        require(msg.value > 1 ether, "Value should be over an ether (dealing in COMS).");

        _mint(cMember, msg.value);

        emit Converted(msg.sender, cMember, msg.value);

        return true;
    }

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}
