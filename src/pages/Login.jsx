import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWS } from '../context/WebSocketContext';
import { MessageTypes } from '../constants';
import { validateUsername } from '../utils/validations';
import { Eye, EyeOff, User, Lock, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import '../css/auth.css';

export default function Login() {
  const { sendMessage, authMessage, setAuthMessage, connected } = useWS();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthMessage('');
    if (name === 'username') {
      const { newValue, error } = validateUsername(value);
      setForm(prev => ({ ...prev, username: newValue }));
      setErrors(prev => ({ ...prev, username: error }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthMessage('');
    const uv = validateUsername(form.username);
    if (uv.error) { setErrors(prev => ({ ...prev, username: uv.error })); return; }
    if (!form.password) { setErrors(prev => ({ ...prev, password: 'Password is required' })); return; }

    sendMessage({
      message_type: MessageTypes.LOGIN_REQUEST,
      username: form.username,
      password: form.password,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="auth-logo">
          <div className="logo-icon">
            <MessageCircle size={32} />
          </div>
          <h1>Bingo</h1>
          <p className="auth-subtitle">Welcome back! Sign in to continue</p>
        </div>

        {authMessage && (
          <motion.div className="auth-error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            {authMessage}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          {errors.username && <span className="field-error">{errors.username}</span>}

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              type={showPw ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <span className="field-error">{errors.password}</span>}

          <motion.button
            type="submit"
            className="auth-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!connected}
          >
            {connected ? 'Sign In' : 'Connecting...'}
          </motion.button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>

        <div className="connection-dot-container">
          <span className={`connection-dot ${connected ? 'online' : 'offline'}`}></span>
          <span className="connection-text">{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </motion.div>
    </div>
  );
}
