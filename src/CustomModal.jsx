import React from 'react';
import './CustomModal.css'; 

const CustomModal = ({ title, message, onClose }) => {
  if (!message) { 
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>OK</button> 
        </div>
      </div>
    </div>
  );
};

export default CustomModal;