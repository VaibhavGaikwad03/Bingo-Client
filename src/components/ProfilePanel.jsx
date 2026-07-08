import React, { useState } from 'react';
import { useWS } from '../context/WebSocketContext';
import { MessageTypes } from '../constants';
import { X, Edit3, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePanel({ onClose }) {
  const { userProfile, currentUserId, sendMessage } = useWS();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullname: userProfile.fullname || '',
    email: userProfile.email || '',
    phone: userProfile.phone || '',
    dob: userProfile.dob || '',
    gender: userProfile.gender || '',
  });

  const handleSave = () => {
    sendMessage({
      message_type: MessageTypes.UPDATE_PROFILE_REQUEST,
      user_id: currentUserId,
      username: userProfile.username,
      ...form,
    });
    setEditing(false);
  };

  const InfoRow = ({ label, value, field }) => (
    <div className="profile-row">
      <span className="profile-label">{label}</span>
      {editing && field ? (
        <input
          className="profile-input"
          value={form[field]}
          onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
        />
      ) : (
        <span className="profile-value">{value || '—'}</span>
      )}
    </div>
  );

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="panel-content">
      <div className="panel-header">
        <h2>Profile</h2>
        <button className="icon-btn" onClick={onClose}><X size={20} /></button>
      </div>

      <div className="panel-body profile-body">
        <div className="profile-avatar-large">
          {getInitials(userProfile.fullname)}
        </div>
        <h3 className="profile-name">{userProfile.fullname || 'User'}</h3>
        <span className="profile-handle">@{userProfile.username}</span>

        <div className="profile-details">
          <InfoRow label="Full Name" value={form.fullname} field="fullname" />
          <InfoRow label="Email" value={form.email} field="email" />
          <InfoRow label="Phone" value={form.phone} field="phone" />
          <InfoRow label="Date of Birth" value={form.dob} field="dob" />
          <InfoRow label="Gender" value={form.gender} field="gender" />
        </div>

        <motion.button
          className="settings-btn profile-edit-btn"
          onClick={editing ? handleSave : () => setEditing(true)}
          whileTap={{ scale: 0.97 }}
        >
          {editing ? <><Save size={16} /> Save Changes</> : <><Edit3 size={16} /> Edit Profile</>}
        </motion.button>
      </div>
    </div>
  );
}
