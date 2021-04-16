// Dependencies
require('dotenv').config();
const HDWalletProvider = require("truffle-hdwallet-provider");

// ENV
const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.ALCHEMY_KEY;

// If npm config is set and either Rinkeby or Live (Mainnet)
const needsNodeAPI = process.env.npm_config_argv && process.env.npm_config_argv.includes("rinkeby");

// Must pass a Mnemonic & API Key
if ((!MNEMONIC || !NODE_API_KEY) && needsNodeAPI) {
  console.error("Please set a mnemonic and ALCHEMY_KEY.");
  process.exit(0);
}

// Rinkeby or Mainnet
const rinkebyNodeUrl = "https://eth-rinkeby.alchemyapi.io/v2/" + NODE_API_KEY;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, rinkebyNodeUrl);
      },
      gas: 10000000,
      network_id: "*",
    }
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './abis/',
  compilers: {
    solc: {
      version: '^0.8.0',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
