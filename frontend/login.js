// src/pages/Login.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";

import axios from "../api/axiosInstance";



export default function Login() {
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
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  } catch (err) {
    alert("Login failed 😓");
    console.error(err);
  }
};

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.formBox}>
        <h2 className={styles.title}>Login</h2>
        <input
          type="email"
          placeholder="Email"
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
          Log In
        </button>
        <p className={styles.link}>
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-600 font-medium">Sign up</Link><br></br>
          <a href="/admin-login" style={{ color: "#007bff" }}>Admin Login</a>

        </p>
      </form>
    </div>
  );
}
