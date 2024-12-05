import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signuppage.css";
import logo from "./assets/Logo.png";

const Signuppage = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taxId = Math.random().toString(36).substring(2, 10); // Generate random taxId
    const newUser = {
      fullname,
      username,
      email,
      password,
      address,
      rank: 1, // Automatically assign rank 1
      taxId,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert("User successfully registered!");
        navigate("/main");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error registering user. Please try again.");
    }
  };

  const handleBackToStore = () => {
    navigate("/main");
  };

  return (
    <div className="signup-page">
      {/* Top left logo */}
      <img src={logo} alt="Logo" className="signup-logo" />

      {/* Top right "Back to Store" button */}
      <button className="back-to-store-button" onClick={handleBackToStore}>
        &larr; Back to Store
      </button>

      <div className="signup-card">
        <h2 className="signup-title">Create an Account</h2>
        <p className="signup-motto">Join the WheelCar community</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="fullname" className="form-label">Full Name</label>
            <input
              type="text"
              id="fullname"
              className="form-input"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address" className="form-label">Address</label>
            <input
              type="text"
              id="address"
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Log In</Link>.
        </p>
      </div>
    </div>
  );
};

export default Signuppage;
