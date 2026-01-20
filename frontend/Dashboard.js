import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
  const fetchStats = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload?.id) throw new Error("Invalid token payload");

    const res = await axios.get(`http://localhost:5000/dashboard/stats/${payload.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    
  } catch (err) {
    console.error("Error fetching stats:", err);
  }
};
  
}, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Energy Audit ⚡</h1>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <h4> Audits </h4>
          
        </div>
        <div className={styles.statCard}>
          <h4>Issue Certificate</h4>
          
        </div>
        <div className={styles.statCard}>
          <h4>Calculate efficiency</h4>
         
        </div>
      </div>

      {/* Card Section */}
      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <h3>Submit New Audit</h3>
          <p>Analyze energy usage and generate a report.</p>
          <button onClick={() => navigate("/submit")} className={styles.logoutButton}>
            Start Audit
          </button>
        </div>
        <div className={styles.card}>
          <h3>View Certificates</h3>
          <p>Browse or download previously issued certificates.</p>
          <button onClick={() => navigate("/IssueCert")} className={styles.logoutButton}>
            View Now
          </button>
        </div>
        <div className={styles.card}>
          <h3>Analytics</h3>
          <p>Visualize usage trends and optimize energy efficiency.</p>
          <button disabled className={styles.logoutButton}>
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
