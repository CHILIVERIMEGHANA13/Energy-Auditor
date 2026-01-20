// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certificate {
    struct Cert {
        string userName;
        string auditDate;
        uint256 score;
        address issuedTo;
    }

    Cert[] private certificates;

    event CertificateIssued(
        string userName,
        string auditDate,
        uint256 score,
        address indexed issuedTo
    );

    function issueCertificate(string memory _userName, string memory _auditDate, uint256 _score) public {
        require(bytes(_userName).length > 0, "Username required");
        require(bytes(_auditDate).length > 0, "Audit date required");

        certificates.push(Cert({
            userName: _userName,
            auditDate: _auditDate,
            score: _score,
            issuedTo: msg.sender
        }));

        emit CertificateIssued(_userName, _auditDate, _score, msg.sender);
    }

    function getCertificate(uint256 index) public view returns (string memory, string memory, uint256, address) {
        require(index < certificates.length, "Invalid certificate index");
        Cert memory cert = certificates[index];
        return (cert.userName, cert.auditDate, cert.score, cert.issuedTo);
    }

    function getTotalCertificates() public view returns (uint256) {
        return certificates.length;
    }
}
