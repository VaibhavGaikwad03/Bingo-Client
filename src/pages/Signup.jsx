import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWS } from '../context/WebSocketContext';
import { MessageTypes } from '../constants';
import { validateUsername, validatePassword, validateEmail, validatePhone, validateDOB } from '../utils/validations';
import { Eye, EyeOff, User, Lock, Mail, Phone, Calendar, UserCheck, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import '../css/auth.css';

export default function Signup() {
  const { sendMessage, authMessage, setAuthMessage, connected } = useWS();
  const [form, setForm] = useState({
    username: '', password: '', fullname: '', dob: '', email: '', phone: '', gender: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setAuthMessage('');
    let updated = { ...form };
    let newErrors = { ...errors };

    switch (name) {
      case 'username': {
        const r = validateUsername(value);
        updated.username = r.newValue;
        newErrors.username = r.error;
        break;
      }
      case 'password': {
        const r = validatePassword(value);
        updated.password = value;
        newErrors.password = r.error;
        break;
      }
      case 'email': {
        const r = validateEmail(value);
        updated.email = value;
        newErrors.email = r.error;
        break;
      }
      case 'phone': {
        const cleaned = value.replace(/\D/g, '');
        updated.phone = cleaned;
        newErrors.phone = cleaned.length > 0 && cleaned.length !== 10 ? 'Must be 10 digits' : '';
        break;
      }
      case 'dob': {
        const r = validateDOB(value);
        updated.dob = value;
        newErrors.dob = r.error;
        break;
      }
      case 'fullname': {
        updated.fullname = value;
        newErrors.fullname = value.trim() === '' ? 'Required' : '';
        break;
      }
      default:
        updated[name] = value;
    }
    setForm(updated);
    setErrors(newErrors);
  };

  const onInput = (e) => handleChange(e.target.name, e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthMessage('');
    // Validate all
    const uv = validateUsername(form.username);
    const pv = validatePassword(form.password);
    const ev = validateEmail(form.email);
    const phv = validatePhone(form.phone);
    const dv = validateDOB(form.dob);
    const fn = form.fullname.trim() !== '';
    const gn = !!form.gender;

    const errs = {
      username: uv.error, password: pv.error, email: ev.error,
      phone: phv.error, dob: dv.error,
      fullname: fn ? '' : 'Required',
      gender: gn ? '' : 'Required',
    };
    setErrors(errs);
    if (Object.values(errs).some(e => e)) return;

    sendMessage({
      message_type: MessageTypes.SIGN_UP_REQUEST,
      ...form,
      fullname: form.fullname.trim(),
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
        className="auth-card auth-card--signup"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="auth-logo">
          <img src="/logo.png?v=2" alt="Bingo Logo" className="auth-logo-img" />
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join the conversation</p>
        </div>

        {authMessage && (
          <motion.div className="auth-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {authMessage}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-col">
              <div className="input-group">
                <User size={18} className="input-icon" />
                <input type="text" name="username" placeholder="Username *" value={form.username} onChange={onInput} autoComplete="off" required />
              </div>
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>
            <div className="form-col">
              <div className="input-group">
                <Lock size={18} className="input-icon" />
                <input type={showPw ? 'text' : 'password'} name="password" placeholder="Password *" value={form.password} onChange={onInput} onKeyDown={e => e.key === ' ' && e.preventDefault()} required />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
          </div>

          <div className="input-group">
            <UserCheck size={18} className="input-icon" />
            <input type="text" name="fullname" placeholder="Full Name *" value={form.fullname} onChange={onInput} required />
          </div>
          {errors.fullname && <span className="field-error">{errors.fullname}</span>}

          <div className="form-row">
            <div className="form-col">
              <div className="input-group">
                <Mail size={18} className="input-icon" />
                <input type="email" name="email" placeholder="Email *" value={form.email} onChange={onInput} required />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="form-col">
              <div className="input-group">
                <Phone size={18} className="input-icon" />
                <input type="tel" name="phone" placeholder="Phone (10 digits) *" value={form.phone} onChange={onInput} required />
              </div>
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="input-group">
            <Calendar size={18} className="input-icon" />
            <input type="date" name="dob" value={form.dob} onChange={onInput} max={new Date().toISOString().split('T')[0]} required />
          </div>
          {errors.dob && <span className="field-error">{errors.dob}</span>}

          <div className="gender-group">
            <span className="gender-label">Gender *</span>
            <div className="gender-options">
              {['Male', 'Female', 'Other'].map(g => (
                <label key={g} className={`gender-chip ${form.gender === g ? 'active' : ''}`}>
                  <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={onInput} />
                  {g}
                </label>
              ))}
            </div>
            {errors.gender && <span className="field-error">{errors.gender}</span>}
          </div>

          <motion.button type="submit" className="auth-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={!connected}>
            {connected ? 'Create Account' : 'Connecting...'}
          </motion.button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
