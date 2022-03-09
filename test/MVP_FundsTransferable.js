const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FundsTransferable contract", function () {

    let fundsTransferableImpl;
    let deployer;
    let a1;
    let defaultAdminRole;

    const sendValue = ethers.utils.parseEther('5');

    beforeEach(async function() {
        [deployer, a1] = await ethers.getSigners();

        FundsTransferableImplFactory = await ethers.getContractFactory("FundsTransferableImpl");

        fundsTransferableImpl = await FundsTransferableImplFactory.deploy({value: ethers.utils.parseEther('5')});
        defaultAdminRole = await fundsTransferableImpl.DEFAULT_ADMIN_ROLE();

        await fundsTransferableImpl.deployed();
    });

    it("should protect transferFunds from anyone not w/ DEFAULT_ADMIN_ROLE", async function () {
        expectedErrorMessage = "AccessControl: account " + 
        a1.address.toString().toLowerCase()
        + " is missing role " + defaultAdminRole;

        await expect(fundsTransferableImpl.connect(a1).transferFundsTo(a1.address)).to.be.revertedWith(
            expectedErrorMessage);
    });

    it("should emit a message stating who transferred.", async function () {
        await expect(fundsTransferableImpl.transferFundsTo(a1.address)).to.emit(
            fundsTransferableImpl, "TransferredFunds").withArgs(
                deployer.address, a1.address);
    });

    it("should transfer any funds", async function () {
        og_balance = await ethers.provider.getBalance(a1.address);

        await fundsTransferableImpl.transferFundsTo(a1.address);

        expect(await ethers.provider.getBalance(a1.address)).to.equal(og_balance.add(sendValue));
    });
});