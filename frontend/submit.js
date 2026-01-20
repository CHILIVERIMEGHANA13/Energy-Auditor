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
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  
  useEffect(() => {

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
      
    } catch (err) {
      console.error('Error saving audit:', JSON.stringify(err.response?.data || err.response || err.message, null, 2));
    }
    setLoading(false);
  };

  const handleNewSubmission = () => {
    setFormData({
      energyUsed: '',
      appliances: '',
      areaSqft: '',
      buildingType: '',
      hvacAgeYears: '',
    });
    setGeneratedAudit(null);
  };

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
        <input
          type="number"
          name="appliances"
          placeholder="Number of Appliances"
          value={formData.appliances}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="number"
          name="areaSqft"
          placeholder="Area (sq ft)"
          value={formData.areaSqft}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="text"
          name="buildingType"
          placeholder="Building Type"
          value={formData.buildingType}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="number"
          name="hvacAgeYears"
          placeholder="HVAC Age (years)"
          value={formData.hvacAgeYears}
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
            onClick={handleNewSubmission}
            className={styles.button}
            style={{ marginTop: '1rem', backgroundColor: '#ddd', color: '#000' }}
          >
            Submit Another Audit
          </button>
        </div>
      )}

      
    </div>
  );
};

export default Submit;