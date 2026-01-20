import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch certificates from the backend
    const fetchCertificates = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/audit/certificates', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch certificates');
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <h2>Loading certificates...</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Your Energy Audit Certificates</h1>
      <div className={styles.certificateGrid}>
        {certificates.length === 0 ? (
          <p>No certificates found. Complete an energy audit to receive a certificate.</p>
        ) : (
          certificates.map((cert) => (
            <div key={cert._id} className={styles.certificateCard}>
              <h3>Certificate #{cert.certificateNumber}</h3>
              <p>Date Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
              <p>Energy Rating: {cert.energyRating}</p>
              <p>Property Address: {cert.propertyAddress}</p>
              <button 
                onClick={() => window.open(cert.downloadUrl, '_blank')}
                className={styles.downloadButton}
              >
                Download Certificate
              </button>
            </div>
          ))
        )}
      </div>
      <button 
        onClick={() => navigate('/dashboard')}
        className={styles.backButton}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Certificates;
