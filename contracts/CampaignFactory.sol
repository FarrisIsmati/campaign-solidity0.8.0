// SPDX-License-Identifier: <SPDX-License>
pragma solidity ^0.8.0;

import "./Campaign.sol";

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address campaignAddress = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(campaignAddress);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}
