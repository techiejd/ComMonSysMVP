const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CommunityVotes contract", function () {

    let communityVotes;
    let deployer;
    let a1;
    let a2;
    let granterRole;
    let defaultAdminRole;

    const sendValue = ethers.utils.parseEther('50000');

    beforeEach(async function() {
        [deployer, a1, a2] = await ethers.getSigners();

        CommunityVotesFactory = await ethers.getContractFactory("CommunityVotes");

        communityVotes = await CommunityVotesFactory.deploy("Test Votes", "TV", "v0.1");
        granterRole = await communityVotes.GRANTER_ROLE();
        defaultAdminRole = await communityVotes.DEFAULT_ADMIN_ROLE();

        await communityVotes.deployed();
    });

    it("should assign the deployer to be the DEFAULT_ADMIN_ROLE", async function () {
        expect(await communityVotes.hasRole(
            defaultAdminRole, deployer.address)).to.be.true;
    });

    it("should protect grantVotes from anyone not w/ GRANTER_ROLE", async function () {
        expectedErrorMessage = "AccessControl: account " + 
        deployer.address.toString().toLowerCase()
        + " is missing role " + granterRole;

        await expect(
            communityVotes.grantVotesTo(a1.address)
        ).to.be.revertedWith(expectedErrorMessage);
    });

    it("should have a minimum of 50,000 ether (COMS) for granting membership", async function () {
        await communityVotes.grantRole(granterRole, a1.address);

        expectedErrorMessage = "Voting has a price of 50,000.";

        await expect(
            communityVotes.connect(a1).grantVotesTo(a2.address)
        ).to.be.revertedWith(expectedErrorMessage);
    });

    it("should emit that membership was given", async function () {
        await communityVotes.grantRole(granterRole, a1.address);

        await expect(communityVotes.connect(a1).grantVotesTo(
            a2.address, {value: sendValue})).to.emit(
                communityVotes, "votesGranted").withArgs(a1.address, a2.address);

        expect(await communityVotes.balanceOf(a2.address)).to.be.equal(1);
    });

    it("should grant membership by NFT", async function () {
        await communityVotes.grantRole(granterRole, a1.address);

        await communityVotes.connect(a1).grantVotesTo(a2.address, {value: sendValue});

        expect(await communityVotes.balanceOf(a2.address)).to.be.equal(1);
    });
});