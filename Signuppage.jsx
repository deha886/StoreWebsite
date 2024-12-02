import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signuppage.css';
import logo from './assets/Logo.png';

const Signuppage = () => {
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
    <div className="signup-page">
      {/* Top left logo */}
      <img src={logo} alt="Logo" className="signup-logo" />

      {/* Top right "Back to Store" button */}
      <button className="back-to-store-button" onClick={handleBackToStore}>
        &larr; Back to Store
      </button>

      <div className="signup-card">
        <h2 className="signup-title">Create an Account</h2>
        {/* Motto under the title */}
        <p className="signup-motto">Join the WheelCar community</p>
        
        <form onSubmit={handleSubmit} className="signup-form">
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
          <button type="submit" className="signup-button">Sign Up</button>
        </form>

        {/* New section: Login link */}
        <p className="login-link">
          Already have an account? <Link to="/login">Log In</Link>.
        </p>
      </div>
    </div>
  );
};

export default Signuppage;