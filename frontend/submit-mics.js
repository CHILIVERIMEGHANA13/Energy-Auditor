import React, { useState, useEffect } from 'react';
import axios from "../api/axiosInstance";
import styles from "./submit.module.css";

const Submit = () => {
  const [formData, setFormData] = useState({
    energyUsed: '',
    appliances: '',
    areaSqft: '',
    buildingType: '',
    hvacAgeYears: '',
  });

  const [generatedAudit, setGeneratedAudit] = useState(null);
  const [previousAudits, setPreviousAudits] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


  const fetchPreviousAudits = async () => {
  try {
    //const res = await axios.get('/audits');
    const res = await axios.get('/audits', getAuthHeader());

    setPreviousAudits(res.data);
  } catch (err) {
    console.error('Error fetching audits:', err);
  }
};



  useEffect(() => {
    fetchPreviousAudits();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/audits', formData, getAuthHeader());
      console.log('Audit saved:', response.data);
      setGeneratedAudit(response.data.audit);
      fetchPreviousAudits();
    } catch (err) {
  console.error('Error saving audit:', {
    data: err.response?.data,
    status: err.response?.status,
    message: err.message,
  });
}
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Energy Audit Submission</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="number"
          name="energyUsed"
          placeholder="Energy Used (kWh)"
          value={formData.energyUsed}
          onChange={handleChange}
          required
          className={styles.input}
        />
       
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Audit'}
        </button>
      </form>

      {generatedAudit && (
        <div className={styles.certificateBox}>
          <h3>Certificate Generated ✅</h3>
          <p><strong>Score:</strong> {generatedAudit.score}</p>
          <p><strong>Certificate ID:</strong> {generatedAudit.certificate?.id}</p>
          <p><strong>Issued on:</strong> {new Date(generatedAudit.certificate?.timestamp).toLocaleDateString()}</p>
          <button
            onClick={handleSubmit}
            className={styles.button}
            style={{ marginTop: '1rem', backgroundColor: '#ddd', color: '#000' }}
          >
            Submit Another Audit
          </button>
        </div>
      )}

      <div className={styles.auditList}>
        <h3>Previous Audits</h3>
        {previousAudits.length === 0 ? (
          <p>No audits found.</p>
        ) : (
          <ul>
            {previousAudits.map((audit, index) => (
              <li key={index} className={styles.auditItem}>
                <p><strong>Energy Used:</strong> {audit.energyUsed} kWh</p>
                <p><strong>Appliances:</strong> {audit.appliances}</p>
                <p><strong>Area:</strong> {audit.area} sq ft</p>
                <p><strong>Score:</strong> {audit.score}</p>
                {audit.certificate && (
                  <>
                    <p><strong>Certificate ID:</strong> {audit.certificate.id}</p>
                    <p><strong>Issued on:</strong> {new Date(audit.certificate.timestamp).toLocaleDateString()}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Submit;