import React from 'react';
import { Link } from 'react-router-dom';
import './PreviousAudits.css'; // Create this file

const PreviousAudits = ({ audits }) => {
    if (!audits || audits.length === 0) {
        return (
            <div className="previous-audits-container">
                <h2>Previous Audit Records</h2>
                <p>No previous audit records found.</p>
                <Link to="/" className="link-btn">Submit a New Audit</Link>
            </div>
        );
    }

    return (
        <div className="previous-audits-container">
            <h2>Previous Audit Records</h2>
            <ul className="audit-list">
                {audits.map(audit => (
                    <li key={audit.id} className="audit-item">
                        <div className="audit-info">
                            <span><strong>Building:</strong> {audit.formData.buildingType}</span>
                            <span><strong>Area:</strong> {audit.formData.areaSqft} sqft</span>
                            <span><strong>Score:</strong> {audit.score}/100</span>
                            <span><strong>Date:</strong> {new Date(audit.timestamp).toLocaleDateString()}</span>
                        </div>
                        <Link to={`/certificate/${audit.id}`} className="view-cert-btn">View Certificate</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PreviousAudits;