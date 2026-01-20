import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import styles from "./Login.module.css"; // Reuse existing styles

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post("/auth/admin-login", {
        email,
        password,
      });

      // Store admin token separately if needed
      localStorage.setItem("adminToken", res.data.token);

      // Redirect to admin dashboard
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      alert("Login failed 🚫");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.formBox}>
        <h2 className={styles.title}>Admin Login</h2>
        <input
          type="email"
          placeholder="Admin Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className={styles.button}>
          Log In as Admin
        </button>
        {/* 🔒 No signup link here – admin access only */}
      </form>
    </div>
  );
}
