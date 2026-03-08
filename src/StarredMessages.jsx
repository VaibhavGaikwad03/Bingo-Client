import React from 'react';

export default function StarredMessages({ starredMessages, theme , currentUserId }) {
    const formatTimeOnly = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="starred-container">
      {starredMessages.map((msg) => (
        <div key={msg.id} className={`p-3 border-bottom ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`}>
          <div className="d-flex justify-content-between small mb-1">
            <span className="fw-bold">{msg.sender_id === currentUserId ?  "You" : "Contact"}</span>
            <span className="text-muted">{formatTimeOnly(msg.timestamp)}</span>
          </div>
          <p className="mb-0 small">{msg.content}</p>
        </div>
      ))}
    </div>
  );
}