import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './admin.module.css';
import axios from "../api/axiosInstance";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAudits: 0,
    pendingAudits: 0,
    totalUsers: 0,
    recentAudits: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/admin', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Include cookies for CSRF protection
        });

        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin');
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch admin data');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        setError(error.message);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.backButton}>
          Logout
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Audits</h3>
          <p>{stats.totalAudits}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Audits</h3>
          <p>{stats.pendingAudits}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
      </div>

      <div className={styles.recentAudits}>
        <h2>Recent Audits</h2>
        <div className={styles.auditList}>
          {stats.recentAudits.length === 0 ? (
            <p>No recent audits found</p>
          ) : (
            stats.recentAudits.map((audit) => (
              <div key={audit._id} className={styles.auditCard}>
                <h4>Audit #{audit.auditNumber}</h4>
                <p>Date: {new Date(audit.date).toLocaleDateString()}</p>
                <p>Status: {audit.status}</p>
                <p>User: {audit.userName}</p>
                <button 
                  onClick={() => navigate(`/admin/audit/${audit._id}`)}
                  className={styles.viewButton}
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.adminActions}>
        <button 
          onClick={() => navigate('/admin/users')}
          className={styles.actionButton}
        >
          Manage Users
        </button>
        <button 
          onClick={() => navigate('/admin/audits')}
          className={styles.actionButton}
        >
          View All Audits
        </button>
        <button 
          onClick={() => navigate('/admin/reports')}
          className={styles.actionButton}
        >
          Generate Reports
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
