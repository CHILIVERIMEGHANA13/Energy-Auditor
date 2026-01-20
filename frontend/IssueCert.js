import React, { useState } from "react";
import { contract, web3 } from "./blockchain";
import './IssueCert.css';

function IssueCert() {
  const [userName, setUserName] = useState("");
  const [auditDate, setAuditDate] = useState("");
  const [score, setScore] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [allCertificates, setAllCertificates] = useState([]);

  const handleIssue = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];
      await contract.methods
        .issueCertificate(userName, auditDate, score)
        .send({ from: account });
      alert("✅ Certificate Issued!");
    } catch (error) {
      console.error("❌ Error issuing certificate:", error);
      alert("Something went wrong. Check the console!");
    }
  };

  // <-- Move this function OUTSIDE of 
  const handleCheckLatest = async () => {
  try {
    const total = await contract.methods.getTotalCertificates().call();
    if (parseInt(total) === 0) {
      alert("No certificates found.");
      return;
    }
    // Get the latest certificate (index = total - 1)
    const cert = await contract.methods.getCertificate(total - 1).call();
    setCertificate(cert);
    alert(`Latest Certificate:\nUser: ${cert[0]}\nDate: ${cert[1]}\nScore: ${cert[2]}\nIssued To: ${cert[3]}`);
  } catch (error) {
    alert("Error fetching certificate.");
    setCertificate(null);
  }
};
 
const handleFetchAll = async () => {
    try {
      const total = await contract.methods.getTotalCertificates().call();
      const certs = [];
      for (let i = 0; i < total; i++) {
        const cert = await contract.methods.getCertificate(i).call();
        certs.push(cert);
      }
      setAllCertificates(certs);
    } catch (error) {
      alert("Error fetching all certificates.");
      setAllCertificates([]);
    }
  };
  return (
    <div className="issue-container">
      <h2>Issue Certificate</h2>
      <input placeholder="Username" onChange={(e) => setUserName(e.target.value)} />
      <input placeholder="Audit Date" onChange={(e) => setAuditDate(e.target.value)} />
      <input placeholder="Score" onChange={(e) => setScore(e.target.value)} />
      <button onClick={handleIssue}>Issue Cert</button>
      <button onClick={handleCheckLatest}>Check Latest Certificate</button>
      <button onClick={handleFetchAll}>Show All Certificates</button>
      {certificate && (
        <div>
          <p>Username: {certificate[0]}</p>
          <p>Audit Date: {certificate[1]}</p>
          <p>Score: {certificate[2]}</p>
          <p>Issued To: {certificate[3]}</p>
        </div>
      )}
    {allCertificates.length > 0 && (
        <div>
          <h3>All Certificates</h3>
          {allCertificates.length > 0 && (
  <div className="certificates-list">
    
    {allCertificates.map((cert, idx) => (
      <div className="certificate-card" key={idx}>
        <p><strong>Username:</strong> {cert[0]}</p>
        <p><strong>Audit Date:</strong> {cert[1]}</p>
        <p><strong>Score:</strong> {cert[2]}</p>
        <p className="issued-to"><strong>Issued To:</strong> {cert[3]}</p>
      </div>
    ))}
  </div>
          )}
        </div>
      )}
    </div>  
  );
}

export default IssueCert;