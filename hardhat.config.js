require("@nomiclabs/hardhat-waffle");
require("dotenv/config");
require("hardhat-gas-reporter");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: "5000000000000000000000000"
      }
    },
    commonsys: {
      url: "https://137.184.238.79/rpc",
      chainId: 14,
      accounts: [process.env.PRIVATEKEY]
    }
  },
  solidity: "0.8.1",
};
