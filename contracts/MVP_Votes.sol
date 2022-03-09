// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "../contracts/MVP_FundsTransferable.sol";


contract CommunityVotes is ERC721Votes, AccessControl, FundsTransferable {
    bytes32 public constant GRANTER_ROLE = keccak256("GRANTER_ROLE");
    event votesGranted(address indexed _by, address indexed _to);

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;


    string private constant _voterURI = "commonsys.tech/definitions/voter.json";

    function grantVotesTo(address person) onlyRole(GRANTER_ROLE) public payable returns (bool, uint256) {
        require(msg.value >= (50000 ether), "Voting has a price of 50,000.");

        _tokenIds.increment();
        uint256 newVoteId = _tokenIds.current();

        _mint(person, newVoteId);

        emit votesGranted(msg.sender, person);

        return (true, newVoteId);    
    }

    constructor(string memory name_, string memory symbol_, string memory version_) ERC721(name_, symbol_) EIP712(name_, version_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}