import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Signup.module.css";
import { ToastContainer, toast } from "react-toastify";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();

  if (!name || !email || !password || !confirmPassword) {
    toast.error("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    toast.warning("Passwords do not match");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    body: JSON.stringify({ name, email, password })

  },
})
  

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Signup failed ❌");
      return;
    }

    toast.success("Signup successful 🚀 Please log in");
    setTimeout(() => {
      navigate("/"); // 👈 redirect to login
    }, 1500);
  } catch (err) {
    console.error("Signup error:", err);
    toast.error("Something went wrong 😵");
  }
};

  return (
    <div className={styles.container}>
      <form onSubmit={handleSignup} className={styles.formBox}>
        <h2 className={styles.title}>Create an Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          className={styles.input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" className={styles.button}>
          Sign Up
        </button>

        <p className={styles.link}>
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
