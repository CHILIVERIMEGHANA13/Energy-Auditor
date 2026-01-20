import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './CertificatePage.css'; // Create this file

const CertificatePage = ({ audits }) => {
    const { certificateId } = useParams();
    const navigate = useNavigate();
    const audit = audits.find(a => a.id === certificateId);

    if (!audit) {
        return (
            <div className="certificate-page-container">
                <h2>Certificate Not Found</h2>
                <p>The certificate with ID "{certificateId}" could not be found.</p>
                <Link to="/previous-audits" className="link-btn">Back to Previous Audits</Link>
            </div>
        );
    }

    return (
        <div className="certificate-page-container">
            <button onClick={() => navigate(-1)} className="back-button">← Back</button>
            <h2>Energy Efficiency Certificate</h2>
            {/* Display the full certificate HTML */}
            <div dangerouslySetInnerHTML={{ __html: audit.certificateHTML }} />
            <div className="actions">
                 <Link to="/" className="link-btn">Submit New Audit</Link>
            </div>
        </div>
    );
};

export default CertificatePage;