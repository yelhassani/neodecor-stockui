import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
  
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        username,
        password,
      });
  
      // Save the JWT token
      localStorage.setItem("token", response.data);
      navigate("/dashboard");
  
    } catch (err) {
      if (err.response) {
        // Handle different error statuses from backend
        if (err.response.status === 401) {
          setError("Incorrect username or password. Please try again.");
        } else if (err.response.status === 400) {
          setError("Invalid request. Please check your input.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      } else {
        setError("Server is unreachable. Check your internet connection.");
      }
    }
  };  

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Email Address"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="login-footer">
        </div>
      </div>
    </div>
  );
};

export default Login;