// DEPENDENCIES
const ganache = require('ganache-cli');
const Web3 = require('web3');

// CONTRACTS
const Campaign = artifacts.require('Campaign');
const CampaignFactory = artifacts.require('CampaignFactory');

const web3 = new Web3(ganache.provider());

module.exports = async function(deployer, network) {
  let proxyRegistryAddress = '';
  if (network === 'development') {
    // Development
    proxyRegistryAddress = "0x9465116cC26f6AC5A7e3FC763F050E4C9f8024D0";  
  } else if (network === 'rinkeby' || network == 'rinkeby-fork') {
    console.log('rinkeyyyyyy')
    // Rinkeby
    proxyRegistryAddress = "0xF548e9efa64e3d9f9B205fEd61cE5Bc8ca6B1212";
  }

  // Deploy contract to network
  // await deployer.deploy(Campaign, '1000000', proxyRegistryAddress, {gas: 5000000, from: proxyRegistryAddress});
  await deployer.deploy(CampaignFactory, {gas: 5000000, from: proxyRegistryAddress});
};
