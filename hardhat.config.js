require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: "500000000000000000000000"
      }
    }
  },
  solidity: "0.8.1",
};
