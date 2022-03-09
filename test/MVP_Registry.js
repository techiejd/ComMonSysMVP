const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CommunityRegistry contract", function () {

    let communityRegistry;
    let deployer;
    let a1;
    let a2;
    let registererRole;
    let defaultAdminRole;

    const sendValue = ethers.utils.parseEther('120000');

    beforeEach(async function() {
        [deployer, a1, a2] = await ethers.getSigners();

        CommunityRegistryFactory = await ethers.getContractFactory("CommunityRegistry");

        communityRegistry = await CommunityRegistryFactory.deploy("Test Registry", "TR");
        registererRole = await communityRegistry.REGISTERER_ROLE();
        defaultAdminRole = await communityRegistry.DEFAULT_ADMIN_ROLE();

        await communityRegistry.deployed();
    });

    it("should assign the deployer to be the DEFAULT_ADMIN_ROLE", async function () {
        expect(await communityRegistry.hasRole(
            defaultAdminRole, deployer.address)).to.be.true;
    });

    it("should protect grantMembership from anyone not w/ REGISTERER_ROLE", async function () {
        expectedErrorMessage = "AccessControl: account " + 
        deployer.address.toString().toLowerCase()
        + " is missing role " + registererRole;

        await expect(
            communityRegistry.grantMembershipTo(a1.address)
        ).to.be.revertedWith(expectedErrorMessage);
    });

    it("should have a minimum of 120,000 ether (COMS) for granting membership", async function () {
        await communityRegistry.grantRole(registererRole, a1.address);

        expectedErrorMessage = "Membership has a price of at least 120,000.";

        await expect(
            communityRegistry.connect(a1).grantMembershipTo(a2.address)
        ).to.be.revertedWith(expectedErrorMessage);
    });

    it("should emit that membership was given", async function () {
        await communityRegistry.grantRole(registererRole, a1.address);

        await expect(communityRegistry.connect(a1).grantMembershipTo(
            a2.address, {value: sendValue})).to.emit(
                communityRegistry, "membershipGranted").withArgs(a1.address, a2.address);

        expect(await communityRegistry.balanceOf(a2.address)).to.be.equal(1);
    });

    it("should grant membership by NFT", async function () {
        await communityRegistry.grantRole(registererRole, a1.address);

        await communityRegistry.connect(a1).grantMembershipTo(a2.address, {value: sendValue});

        expect(await communityRegistry.balanceOf(a2.address)).to.be.equal(1);
    });

    it("should return the true and member registry ID on success", async function () {
        await communityRegistry.grantRole(registererRole, a1.address);

        // Using callStatic so we can actually check the supposed return value.
        expect(await communityRegistry.connect(a1).callStatic.grantMembershipTo(
            a2.address, {value: sendValue})).to.be.eql([true, ethers.BigNumber.from(1)]);
    })
});