import React from 'react';
import './css/CustomAlertModal.css'; 
import { useTranslation } from "react-i18next";

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  if (!message) {
    return null;
  }
  const { t } = useTranslation();

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
        <div className="modal-footer confirm-footer"> 
          <button className="cancel-button" onClick={onCancel}>{t("cancel")}</button>
          <button className="confirm-button" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;