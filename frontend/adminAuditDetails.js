import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './admin.module.css';

const AdminAuditDetails = () => {
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState('');
  const { auditId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAuditDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/audits/${auditId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin');
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch audit details');
        const data = await response.json();
        setAudit(data);
        setComments(data.adminComments || '');
      } catch (error) {
        setError(error.message);
        toast.error('Failed to load audit details');
      } finally {
        setLoading(false);
      }
    };

    fetchAuditDetails();
  }, [auditId, navigate]);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/audits/${auditId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus,
          adminComments: comments
        }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to update audit status');
      
      setAudit(prev => ({ ...prev, status: newStatus }));
      toast.success('Audit status updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  const handleCommentsSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/audits/${auditId}/comments`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminComments: comments }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to update comments');
      toast.success('Comments updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading audit details...</div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Audit not found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Audit Details</h1>
        <button onClick={() => navigate('/admin/dashboard')} className={styles.backButton}>
          Back to Dashboard
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.auditDetails}>
        <div className={styles.auditHeader}>
          <h2>Audit #{audit.auditNumber}</h2>
          <span className={`${styles.status} ${styles[audit.status]}`}>
            {audit.status}
          </span>
        </div>

        <div className={styles.auditInfo}>
          <div className={styles.infoSection}>
            <h3>Property Information</h3>
            <p><strong>Address:</strong> {audit.propertyAddress}</p>
            <p><strong>Type:</strong> {audit.propertyType}</p>
            <p><strong>Size:</strong> {audit.propertySize} sq ft</p>
          </div>

          <div className={styles.infoSection}>
            <h3>Energy Assessment</h3>
            <p><strong>Current Rating:</strong> {audit.energyRating}</p>
            <p><strong>Potential Rating:</strong> {audit.potentialRating}</p>
            <p><strong>Annual Savings:</strong> ${audit.annualSavings}</p>
          </div>

          <div className={styles.infoSection}>
            <h3>Recommendations</h3>
            <ul className={styles.recommendations}>
              {audit.recommendations.map((rec, index) => (
                <li key={index}>
                  <strong>{rec.title}</strong>
                  <p>{rec.description}</p>
                  <p>Estimated Cost: ${rec.estimatedCost}</p>
                  <p>Potential Savings: ${rec.potentialSavings}/year</p>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.infoSection}>
            <h3>Admin Actions</h3>
            <div className={styles.statusActions}>
              <button
                onClick={() => handleStatusChange('approved')}
                className={`${styles.actionButton} ${styles.approveButton}`}
                disabled={audit.status === 'approved'}
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusChange('rejected')}
                className={`${styles.actionButton} ${styles.rejectButton}`}
                disabled={audit.status === 'rejected'}
              >
                Reject
              </button>
              <button
                onClick={() => handleStatusChange('pending')}
                className={`${styles.actionButton} ${styles.pendingButton}`}
                disabled={audit.status === 'pending'}
              >
                Mark Pending
              </button>
            </div>

            <div className={styles.commentsSection}>
              <h4>Admin Comments</h4>
              <textarea
                value={comments}
                onChange={handleCommentsChange}
                placeholder="Add your comments here..."
                className={styles.commentsTextarea}
              />
              <button
                onClick={handleCommentsSubmit}
                className={styles.submitButton}
              >
                Save Comments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditDetails; 