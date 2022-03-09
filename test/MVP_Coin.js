const { expect } = require("chai");

describe("CommunityCoin contract", function () {

    let communityCoin;
    let deployer;
    let a1;
    let a2;
    let converterRole;
    let defaultAdminRole;

    const sendValue = ethers.utils.parseEther('5');

    beforeEach(async function() {
        [deployer, a1, a2] = await ethers.getSigners();

        CommunityCoinFactory = await ethers.getContractFactory("CommunityCoin");

        communityCoin = await CommunityCoinFactory.deploy("Test Coin", "TC");
        converterRole = await communityCoin.CONVERTER_ROLE();
        defaultAdminRole = await communityCoin.DEFAULT_ADMIN_ROLE();

        await communityCoin.deployed();
    });

    it("should assign the deployer to be the DEFAULT_ADMIN_ROLE", async function () {
        expect(await communityCoin.hasRole(
            defaultAdminRole, deployer.address)).to.be.true;
    });

    it("should protect convertFor from anyone not w/ CONVERTER_ROLE", async function () {
        expectedErrorMessage = "AccessControl: account " + 
        deployer.address.toString().toLowerCase()
        + " is missing role " + converterRole;

        await expect(
            communityCoin.convertFor(a1.address)
        ).to.be.revertedWith(expectedErrorMessage);
    });

    it("should have a minimum of an ether (COMS) for using convertFor", async function () {
        await communityCoin.grantRole(converterRole, a1.address);

        expectedErrorMessage = "Value should be over an ether (dealing in COMS).";

        await expect(
            communityCoin.connect(a1).convertFor(a2.address)
        ).to.be.revertedWith(expectedErrorMessage);
    });

    it("should emit a message stating who converted, to whom and how much", async function () {
        await communityCoin.grantRole(converterRole, a1.address);

        await communityCoin.connect(a1).convertFor(a2.address, {value: sendValue});

        await expect(communityCoin.connect(a1).convertFor(a2.address, {value: sendValue})).
        to.emit(communityCoin, "Converted").withArgs(a1.address, a2.address, sendValue);
    });

    it("should convert eth (COMS) to community coin token", async function () {
        await communityCoin.grantRole(converterRole, a1.address);

        await communityCoin.connect(a1).convertFor(a2.address, {value: sendValue});

        expect(await communityCoin.balanceOf(a2.address)).to.equal(sendValue);
    });

    it("should protect transferFunds from anyone not w/ DEFAULT_ADMIN_ROLE", async function () {
        expectedErrorMessage = "AccessControl: account " + 
        a1.address.toString().toLowerCase()
        + " is missing role " + defaultAdminRole;

        await expect(communityCoin.connect(a1).transferFundsTo(a1.address)).to.be.revertedWith(
            expectedErrorMessage);
    });

    it("should emit a message stating who transferred.", async function () {
        await expect(communityCoin.transferFundsTo(a1.address)).to.emit(communityCoin, "TransferredFunds").
        withArgs(deployer.address, a1.address);
    });
});