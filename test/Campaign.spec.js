// DEPENDENCIES
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545');

// CONTRACTS
const Campaign = artifacts.require('Campaign');
const CampaignFactory = artifacts.require('CampaignFactory');

contract('Campaigns', accounts => {
    const [owner, account1, account2, account3] = accounts;

    beforeEach(async () => {
        this.campaignFactory = await CampaignFactory.new({from: owner, gas: '5000000'});
        await this.campaignFactory.createCampaign(web3.utils.toWei('0.01', 'ether'),{from: owner, gas: '5000000'});
        const [campaignAddress] = await this.campaignFactory.getDeployedCampaigns();
        this.campaign = await Campaign.at(campaignAddress);
    });

    it('deploys a factory and a campaign', async () => {
        assert.ok(this.campaignFactory.address);
        assert.ok(this.campaign.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await this.campaign.manager();
        assert.strictEqual(manager, owner);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await this.campaign.contribute({value: web3.utils.toWei('0.011', 'ether'), from: accounts[1]});
        const isApprover = await this.campaign.approvers(accounts[1]);

        assert.ok(isApprover);
    });

    it('requires a minimum contribution', async () => {
        try {
            await this.campaign.contribute({value: web3.utils.toWei('0.09', 'ether'), from: accounts[1]});
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('allows a manager to make a payment request', async () => {
        //string memory description, uint256 value, address payable recipient
        await this.campaign.createRequest('how about that dogecoin', web3.utils.toWei('0.2', 'ether'), account1, {from: owner, gas: '1000000'});
        const request = await this.campaign.requests(0);

        assert.strictEqual('how about that dogecoin', request.description);
        assert.strictEqual(account1, request.recipient);
    });

    it('processes requests', async () => {
        let balanceBefore = await web3.eth.getBalance(account1);
        balanceBefore = web3.utils.fromWei(balanceBefore,'ether');
        balanceBefore = parseFloat(balanceBefore);

        await this.campaign.contribute({value: web3.utils.toWei('10', 'ether'), from: owner});
        await this.campaign.createRequest('A', web3.utils.toWei('5', 'ether'), account1, {from: owner, gas: '1000000'});
        await this.campaign.approveRequest(0, {from: owner, gas: '1000000'});
        await this.campaign.finalizeRequest(0, {from: owner, gas: '1000000'});

        let balanceAfter = await web3.eth.getBalance(account1);
        balanceAfter = web3.utils.fromWei(balanceAfter,'ether');
        balanceAfter = parseFloat(balanceAfter);

        difference = balanceAfter - balanceBefore;

        assert(difference > 4);
    });
});
