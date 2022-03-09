// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol"; // For printing.

contract CommunityCoin is ERC20, AccessControl {
    event Converted(address indexed _convertor, address indexed _for, uint256 _value);
    event TransferredFunds(address indexed _transferer, address _to);

    bytes32 public constant CONVERTER_ROLE = keccak256("CONVERTER_ROLE");

    function convertFor(address cMember) public payable onlyRole(CONVERTER_ROLE) returns (bool) { // Note: Public instead of external so we can test.
        require(msg.value > 1 ether, "Value should be over an ether (dealing in COMS).");
        console.log('msg.value: %s', msg.value);

        _mint(cMember, msg.value);

        emit Converted(msg.sender, cMember, msg.value);

        return true;
    }

    function transferFundsTo(address payable to) public onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) {
        to.transfer(address(this).balance);

        emit TransferredFunds(msg.sender, to);
        return true;
    }

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}
