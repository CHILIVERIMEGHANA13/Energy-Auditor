import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './AuditResult.css'; // Create this file

const AuditResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { auditData, score, certificateHTML, certificateId } = location.state || {}; // Get data passed via navigate

    if (!auditData) {
        return (
            <div className="audit-result-container">
                <p>No audit data found. Please submit an audit first.</p>
                <button onClick={() => navigate('/')} className="action-btn">Submit New Audit</button>
            </div>
        );
    }

    return (
        <div className="audit-result-container">
            <h2>Audit Result & Certificate</h2>
            <p className="score-display">Efficiency Score: <strong>{score} / 100</strong></p>
            
            <div className="certificate-preview">
                <h3>Generated Certificate (Preview)</h3>
                {/* Use dangerouslySetInnerHTML for HTML content from string. Be cautious with non-trusted sources. */}
                <div dangerouslySetInnerHTML={{ __html: certificateHTML }} />
            </div>

            <div className="result-actions">
                <button onClick={() => navigate('/')} className="action-btn">Submit Another Response</button>
                <Link to="/previous-audits" className="action-btn">View Previous Audits</Link>
                <Link to={`/certificate/${certificateId}`} className="action-btn">View Full Certificate Page</Link>
            </div>
        </div>
    );
};

export default AuditResult;