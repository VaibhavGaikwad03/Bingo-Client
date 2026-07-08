import React from 'react';
import { useWS } from '../context/WebSocketContext';
import { MessageTypes, FriendRequestStatus } from '../constants';
import { X, Check, UserX } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export default function FriendRequests({ onClose }) {
  const { friendRequests, setFriendRequests, setFriendsList, sendMessage, currentUserId, currentUsername, currentName } = useWS();

  const handleAccept = (req) => {
    toast.success(`Accepted request from ${req.sender}`);
    setFriendRequests(prev => prev.filter(r => r.sender_id !== req.sender_id));
    setFriendsList(prev => [...prev, {
      user_id: req.sender_id,
      username: req.sender,
      fullname: req.name_of_sender,
    }]);
    sendMessage({
      message_type: MessageTypes.FRIEND_REQ_RESPONSE,
      sender_id: req.receiver_id,
      sender: req.receiver,
      name_of_sender: req.name_of_receiver,
      receiver_id: req.sender_id,
      receiver: req.sender,
      name_of_receiver: req.name_of_sender,
      request_status: FriendRequestStatus.ACCEPTED,
      timestamp: new Date().toISOString(),
    });
  };

  const handleDecline = (req) => {
    toast.info(`Declined request from ${req.sender}`);
    setFriendRequests(prev => prev.filter(r => r.sender_id !== req.sender_id));
    sendMessage({
      message_type: MessageTypes.FRIEND_REQ_RESPONSE,
      sender_id: req.receiver_id,
      sender: req.receiver,
      name_of_sender: req.name_of_receiver,
      receiver_id: req.sender_id,
      receiver: req.sender,
      name_of_receiver: req.name_of_sender,
      request_status: FriendRequestStatus.REJECTED,
      timestamp: new Date().toISOString(),
    });
  };

  const daysAgo = (ts) => {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '';
    const now = new Date();
    d.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diff = Math.round((now - d) / 86400000);
    if (diff === 0) return 'today';
    if (diff === 1) return 'yesterday';
    return `${diff}d ago`;
  };

  return (
    <div className="panel-content">
      <div className="panel-header">
        <h2>Friend Requests</h2>
        <button className="icon-btn" onClick={onClose}><X size={20} /></button>
      </div>

      <div className="panel-body">
        {friendRequests.length === 0 ? (
          <div className="panel-empty">
            <UserX size={48} />
            <p>No pending requests</p>
          </div>
        ) : (
          friendRequests.map((req, i) => (
            <motion.div
              key={req.sender_id || i}
              className="request-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="avatar">{req.name_of_sender?.[0]?.toUpperCase() || '?'}</div>
              <div className="request-info">
                <span className="request-name">{req.name_of_sender}</span>
                <span className="request-handle">@{req.sender}</span>
                {req.timestamp && <span className="request-time">{daysAgo(req.timestamp)}</span>}
              </div>
              <div className="request-actions">
                <button className="accept-btn" onClick={() => handleAccept(req)} title="Accept">
                  <Check size={18} />
                </button>
                <button className="decline-btn" onClick={() => handleDecline(req)} title="Decline">
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
