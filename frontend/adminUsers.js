import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './admin.module.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, suspended
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/users', {
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

        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to update user status');
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
      
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading users...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>User Management</h1>
        <button onClick={() => navigate('/admin/dashboard')} className={styles.backButton}>
          Back to Dashboard
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Users</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className={styles.userList}>
        {filteredUsers.length === 0 ? (
          <p className={styles.noResults}>No users found</p>
        ) : (
          filteredUsers.map(user => (
            <div key={user._id} className={styles.userCard}>
              <div className={styles.userInfo}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Status: <span className={styles[user.status]}>{user.status}</span></p>
              </div>
              <div className={styles.userActions}>
                <button
                  onClick={() => handleStatusChange(user._id, user.status === 'active' ? 'suspended' : 'active')}
                  className={`${styles.actionButton} ${user.status === 'active' ? styles.suspendButton : styles.activateButton}`}
                >
                  {user.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
                <button
                  onClick={() => navigate(`/admin/users/${user._id}/audits`)}
                  className={styles.viewButton}
                >
                  View Audits
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUsers; 