// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ComplaintBook {
    struct Complaint {
        uint256 id;
        address submitter;
        string text;
        uint256 submissionTime;
    }

    Complaint[] public complaints;
    uint256 public complaintCount;

    event NewComplaint(uint256 id, address submitter, string text, uint256 submissionTime);

    function submitComplaint(string memory _text) public {
        uint256 complaintId = complaintCount;
        complaints.push(Complaint(complaintId, msg.sender, _text, block.timestamp));
        complaintCount++;
        emit NewComplaint(complaintId, msg.sender, _text, block.timestamp);
    }

    function getAllComplaints() public view returns (Complaint[] memory) {
        return complaints;
    }
}
