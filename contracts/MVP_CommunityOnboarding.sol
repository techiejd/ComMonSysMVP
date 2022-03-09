// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "../contracts/MVP_Coin.sol";
import "../contracts/MVP_Registry.sol";
import "../contracts/MVP_Votes.sol";
import "../contracts/MVP_FundsTransferable.sol";

contract CommunityOnboarding is AccessControl, FundsTransferable {
    event memberOnboarded(address indexed _by, address _member);

    bytes32 public constant ONBOARDER_ROLE = keccak256("ONBOARDER_ROLE");

    struct Community {
        CommunityCoin coin;
        CommunityRegistry registry;
        CommunityVotes votes;
    }

    Community private _community;

    string private _communityName;
    uint256 private constant _startingBudget = 200000 ether;
    uint256 private constant _amountForRegistering = 120000 ether;
    uint256 private constant _amountForVoting = 50000 ether;
    uint256 private constant _amountForConversion = 25000 ether;
    uint256 private constant _remaining = _startingBudget - _amountForRegistering - _amountForConversion - _amountForVoting; // 5000 ether

    function onboard(address payable cMember /* Community Member */) public onlyRole(ONBOARDER_ROLE) returns (bool success, uint256 memberID, uint256 voterID) {
        success = _community.coin.convertFor{value: _amountForConversion}(cMember);
        require(success, "Failed to convert.");

        (success, memberID) = _community.registry.grantMembershipTo{value: _amountForRegistering}(cMember);
        require(success, "Failed to register.");

        (success, voterID) = _community.votes.grantVotesTo{value: _amountForVoting}(cMember);
        require(success, "Failed to grant votes.");

        cMember.transfer(_remaining);

        emit memberOnboarded(msg.sender, cMember);

        return (success, memberID, voterID);
    }

    constructor(string memory communityName_, CommunityCoin coin_, CommunityRegistry registry_, CommunityVotes votes_) payable {
        _communityName = communityName_;
        _community = Community(coin_, registry_, votes_);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}