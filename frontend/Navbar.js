import React from 'react';
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  let userId = null;
  let userRole = null;
  const token = localStorage.getItem("token");
  if (token) {
  try {
    const decoded = jwtDecode(token);
    if (decoded && decoded.user) {
      userId = decoded.user.id;
      userRole = decoded.user.role;
    } else {
      // Handle old or invalid token structure
      userId = null;
      userRole = null;
    }
  } catch (e) {
    userId = null;
    userRole = null;
  }
}

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">Energy Auditor</Link>
    
    </nav>
  );
}

export default Navbar;