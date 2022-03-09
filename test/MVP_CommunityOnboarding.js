const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CommunityOnboarding contract", function () {

    let communityOnboarding;
    let communityCoin;
    let communityRegistry;
    let communityVotes;
    let deployer;
    let a1;
    let a2;
    let onboarderRole;
    let defaultAdminRole;

    const sendValue = ethers.utils.parseEther('200000');

    beforeEach(async function() {
        [deployer, a1, a2] = await ethers.getSigners();

        CommunityCoinFactory = await ethers.getContractFactory("CommunityCoin");
        communityCoin = await CommunityCoinFactory.deploy("Test Coin", "TC");

        CommunityRegistryFactory = await ethers.getContractFactory("CommunityRegistry");
        communityRegistry = await CommunityRegistryFactory.deploy("Test Registry", "TR");

        CommunityVotesFactory = await ethers.getContractFactory("CommunityVotes");
        communityVotes = await CommunityVotesFactory.deploy("Test Votes", "TV", "v0.1");

        CommunityOnboardingFactory = await ethers.getContractFactory("CommunityOnboarding");

        communityOnboarding = await CommunityOnboardingFactory.deploy("Test Community", communityCoin.address, communityRegistry.address, communityVotes.address, {value: sendValue});
        onboarderRole = await communityOnboarding.ONBOARDER_ROLE();
        defaultAdminRole = await communityOnboarding.DEFAULT_ADMIN_ROLE();

        await communityOnboarding.deployed();

        await communityCoin.grantRole(communityCoin.CONVERTER_ROLE(), communityOnboarding.address);
        await communityRegistry.grantRole(communityRegistry.REGISTERER_ROLE(), communityOnboarding.address);
        await communityVotes.grantRole(communityVotes.GRANTER_ROLE(), communityOnboarding.address);
    });

    it("should assign the deployer to be the DEFAULT_ADMIN_ROLE", async function () {
        expect(await communityOnboarding.hasRole(
            defaultAdminRole, deployer.address)).to.be.true;
    });

    it("should protect onboard from anyone not w/ ONBOARDER_ROLE", async function () {
        expectedErrorMessage = "AccessControl: account " + 
        deployer.address.toString().toLowerCase()
        + " is missing role " + onboarderRole;

        await expect(
            communityOnboarding.onboard(a1.address)
        ).to.be.revertedWith(expectedErrorMessage);
    });

    it("should give cMember 25,000 ether of Test Coin", async function () {
        await communityOnboarding.grantRole(onboarderRole, a1.address);
        expect(await communityCoin.balanceOf(a2.address)).to.be.equal(0);

        await communityOnboarding.connect(a1).onboard(a2.address);

        expect(await communityCoin.balanceOf(a2.address)).to.be.equal(ethers.utils.parseEther('25000'));
    });
    
    it("should register cMember", async function () {
        await communityOnboarding.grantRole(onboarderRole, a1.address);
        expect(await communityRegistry.balanceOf(a2.address)).to.be.equal(0);

        await communityOnboarding.connect(a1).onboard(a2.address);

        expect(await communityRegistry.balanceOf(a2.address)).to.be.equal(1);
    });

    it("should give cMember votes", async function () {
        await communityOnboarding.grantRole(onboarderRole, a1.address);
        expect(await communityVotes.balanceOf(a2.address)).to.be.equal(0);

        await communityOnboarding.connect(a1).onboard(a2.address);

        expect(await communityVotes.balanceOf(a2.address)).to.be.equal(1);
    });

    it("should give cMember 5000 ether of eth (COMS)", async function () {
        await communityOnboarding.grantRole(onboarderRole, a1.address);
        og_balance = await ethers.provider.getBalance(a2.address);

        await communityOnboarding.connect(a1).onboard(a2.address);

        expectedNewBalance = await og_balance.add(ethers.utils.parseEther('5000'));
        expect(await ethers.provider.getBalance(a2.address)).to.be.equal(expectedNewBalance);
    });

    it("should emit that cMember was onboarded", async function () {
        await communityOnboarding.grantRole(onboarderRole, a1.address);

        await expect(communityOnboarding.connect(a1).onboard(a2.address)).to.emit(
                communityOnboarding, "memberOnboarded").withArgs(a1.address, a2.address);
    });

    it("should return true, memberID and voterID on success", async function () {
        big1 = ethers.BigNumber.from(1);

        await communityOnboarding.grantRole(onboarderRole, a1.address);

        // Using callStatic so we can actually check the supposed return value.
        expect(await communityOnboarding.connect(a1).callStatic.onboard(a2.address)).
        to.be.eql([true, big1, big1]);
    });
});