import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Loginpage.css";
import logo from "./assets/Logo.png";

const Loginpage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch username data
      const usernameResponse = await axios.get(
        `http://127.0.0.1:8000/users/${username}/username`
      );

      if (usernameResponse.data.username !== username) {
        setError("Invalid username.");
        return;
      }

      // Fetch password data
      const passwordResponse = await axios.get(
        `http://127.0.0.1:8000/users/${username}/password`
      );

      if (passwordResponse.data.password !== password) {
        setError("Invalid password.");
        return;
      }

      // Fetch user rank to validate login permissions
      const rankResponse = await axios.get(
        `http://127.0.0.1:8000/users/${username}/rank`
      );

      const rank = rankResponse.data.rank;
      if (rank === 0) {
        setError("You are not authorized to log in.");
        return;
      }

      // Store user in local storage
      const user = {
        username,
        rank,
      };
      localStorage.setItem("currentUser", JSON.stringify(user));
      setError(""); // Clear any previous errors
      navigate("/main");
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleBackToStore = () => {
    navigate("/main"); // Update to your store path
  };

  return (
    <div className="login-page">
      {/* Top left logo */}
      <img src={logo} alt="Logo" className="login-logo" />

      {/* Top right "Back to Store" button */}
      <button className="back-to-store-button" onClick={handleBackToStore}>
        &larr; Back to Store
      </button>

      <div className="login-card">
        <h2 className="login-title">Welcome to WheelCar</h2>
        {/* Motto under the title */}
        <p className="login-motto">Where cars connect</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
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
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Log-In
          </button>
        </form>

        {/* New section: Sign-up link */}
        <p className="signup-link">
          If you don't have an account, please <Link to="/signup">Sign Up</Link>.
        </p>
      </div>
    </div>
  );
};

export default Loginpage;
