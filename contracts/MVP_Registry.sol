// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "../contracts/MVP_FundsTransferable.sol";

contract CommunityRegistry is ERC721, AccessControl, FundsTransferable {
    event membershipGranted(address indexed _by, address indexed _to);

    bytes32 public constant GRANTER_ROLE = keccak256("GRANTER_ROLE");

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    function grantMembershipTo(address person) onlyRole(GRANTER_ROLE) public payable returns (bool, uint256) {
        require(msg.value >= (120000 ether), "Membership has a price of at least 120,000.");

        _tokenIds.increment();
        uint256 newMemberId = _tokenIds.current();

        _mint(person, newMemberId);

        emit membershipGranted(msg.sender, person);

        return (true, newMemberId);    
    }

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}