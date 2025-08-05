import React from 'react';
import './CustomAlertModal.css'; // Reusing the same CSS file for consistent styling

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close-button" onClick={onCancel}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer confirm-footer"> {/* Added a new class for styling the buttons */}
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="confirm-button" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;