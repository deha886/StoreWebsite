
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Loginpage.css';
import logo from './assets/Logo.png';

const Loginpage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    navigate('/main');
  };

  const handleBackToStore = () => {
    navigate('/main'); // Update to your store path
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
          <button type="submit" className="login-button">Log-In</button>
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