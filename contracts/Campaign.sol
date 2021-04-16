// SPDX-License-Identifier: <SPDX-License>
pragma solidity ^0.8.0;

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    uint256 numRequests = 0;
    mapping(uint => Request) public requests;

    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution); // In Wei
        approvers[msg.sender] = true;
    }

    function createRequest(string memory description, uint256 value, address payable recipient) public restricted {
        uint256 requestId = numRequests++;
        Request storage r = requests[requestId];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
        approversCount++;
    }

    function approveRequest(uint256 requestId) public {
        require(approvers[msg.sender]);

        Request storage r = requests[requestId];

        require(!r.approvals[msg.sender]);

        r.approvals[msg.sender] = true;
        r.approvalCount++;
    }

    function finalizeRequest(uint256 requestId) public restricted {
        Request storage r = requests[requestId];
        
        require(!r.complete);
        require(r.approvalCount > (approversCount/2));

        r.recipient.transfer(r.value);
        r.complete = true;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}
