import React, { useState } from 'react';
import { useWS } from '../context/WebSocketContext';
import { MessageTypes } from '../constants';
import { X, Moon, Sun, Lock, LogOut } from 'lucide-react';
import { validatePassword } from '../utils/validations';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export default function SettingsPanel({ onClose }) {
  const { theme, setTheme, sendMessage, currentUserId } = useWS();
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '' });
  const [pwError, setPwError] = useState('');

  const handleChangePassword = (e) => {
    e.preventDefault();
    const v = validatePassword(pwForm.new_password);
    if (v.error) { setPwError(v.error); return; }
    setPwError('');
    sendMessage({
      message_type: MessageTypes.CHANGE_PASSWORD_REQUEST,
      user_id: currentUserId,
      old_password: pwForm.old_password,
      new_password: pwForm.new_password,
    });
    setPwForm({ old_password: '', new_password: '' });
  };

  const handleLogout = () => {
    sendMessage({
      message_type: MessageTypes.LOGOUT_REQUEST,
      user_id: currentUserId,
      username: localStorage.getItem('currentUsername') || '',
    });
  };

  return (
    <div className="panel-content">
      <div className="panel-header">
        <h2>Settings</h2>
        <button className="icon-btn" onClick={onClose}><X size={20} /></button>
      </div>

      <div className="panel-body">
        {/* Theme */}
        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <div className={`theme-option ${theme === 'dark' ? 'active' : ''}`}>
              <Moon size={16} /> Dark
            </div>
            <div className={`theme-option ${theme === 'light' ? 'active' : ''}`}>
              <Sun size={16} /> Light
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="settings-section">
          <h3><Lock size={16} /> Change Password</h3>
          <form onSubmit={handleChangePassword} className="settings-form">
            <input
              type="password"
              placeholder="Current password"
              value={pwForm.old_password}
              onChange={e => setPwForm(p => ({ ...p, old_password: e.target.value }))}
              required
            />
            <input
              type="password"
              placeholder="New password"
              value={pwForm.new_password}
              onChange={e => setPwForm(p => ({ ...p, new_password: e.target.value }))}
              required
            />
            {pwError && <span className="field-error">{pwError}</span>}
            <motion.button type="submit" className="settings-btn" whileTap={{ scale: 0.97 }}>
              Update Password
            </motion.button>
          </form>
        </div>

        {/* Logout */}
        <div className="settings-section">
          <motion.button className="logout-btn" onClick={handleLogout} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <LogOut size={18} /> Sign Out
          </motion.button>
        </div>
      </div>
    </div>
  );
}
