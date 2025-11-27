import { useState, useEffect } from "react";
import { MessageTypes } from "./js_files/Status_MessageTypes";
import {
  validatePassword,
  validateConfirmPassword,
} from "./js_files/Validations";
import { useTranslation } from "react-i18next";
import "./css/Appearance_ChangePassword.css";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword({
  setMessage,
  message,
  currentUserId,
  socket,
  theme
}) {
  const [oldPass, setOldPass] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isFormFilled = oldPass !== "" && newPass !== "" && confirmPass !== "";

  const { t } = useTranslation();

  const navigate = useNavigate(); //used for navigation
  
  useEffect(() => {
    if (message) {
      clearMessage();
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const passwordValidation = validatePassword(newPass);
    if (!passwordValidation.isValid) {
      setError(`❌ ${passwordValidation.error}`);
      setSuccess("");
      return;
    }

    const confirmValidation = validateConfirmPassword(confirmPass, newPass);
    if (!confirmValidation.isValid) {
      setError(`❌ ${confirmValidation.error}`);
      setSuccess("");
      return;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      const passwordData = {
        message_type: MessageTypes.CHANGE_PASSWORD_REQUEST,
        user_id: currentUserId,
        old_password: oldPass,
        new_password: newPass,
      };
      socket.send(JSON.stringify(passwordData));
    } else {
      setError("❌ Failed to connect to server. Please try again.");
      return;
    }

    setSuccess("✅ Password updated successfully.");
    setError("");
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
  };

  function clearMessage() {
    setTimeout(() => setMessage(""), 2000);
  }

  return (
    <div className="position-fixed d-flex align-items-center justify-content-center p-4 modal-overlay-custom modal-offset-and-zindex">
      <div
        className="p-4 shadow rounded-4 border"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div className="d-flex align-items-center mb-3">
          <i
            className="bi bi-arrow-left-circle fs-4 me-3 clickable"
            onClick={()=> {navigate("/chatpage")}}
            style={{ cursor: "pointer" }}
            title="Back to Chat"
          ></i>
          <h4 className="mb-0 text-center flex-grow-1">
            {t("changePassword")}
          </h4>

          <div style={{ width: "32px" }}></div>
        </div>{" "}

        <em>{message}</em>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative">
            <label className="form-label fw-bold">{t("oldPassword")}</label>
            <input
              type={showOldPass ? "text" : "password"}
              className="form-control"
              style={{ paddingRight: "40px" }}
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value.replace(/\s/g, ""))}
            />
            <i
              className={`bi ${
                showOldPass ? "bi-eye" : "bi-eye-slash"
              } position-absolute end-0 me-3`}
              style={{
                right: "10px",
                cursor: "pointer",
                top: "75%",
                transform: "translateY(-50%)",
              }}
              onClick={() => setShowOldPass(!showOldPass)}
            ></i>
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label fw-bold">{t("newPassword")}</label>
            <input
              type={showNewPass ? "text" : "password"}
              className="form-control"
              style={{ paddingRight: "40px" }}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value.replace(/\s/g, ""))}
            />
            <i
              className={`bi ${
                showNewPass ? "bi-eye" : "bi-eye-slash"
              } position-absolute end-0 me-3`}
              style={{
                right: "10px",
                cursor: "pointer",
                top: "75%",
                transform: "translateY(-50%)",
              }}
              onClick={() => setShowNewPass(!showNewPass)}
            ></i>
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label fw-bold">{t("confirmPassword")}</label>
            <input
              type={showConfirmPass ? "text" : "password"}
              className="form-control"
              style={{ paddingRight: "40px" }}
              value={confirmPass}
              onChange={(e) =>
                setConfirmPass(e.target.value.replace(/\s/g, ""))
              }
            />
            <i
              className={`bi ${
                showConfirmPass ? "bi-eye" : "bi-eye-slash"
              } position-absolute end-0 me-3`}
              style={{
                right: "10px",
                cursor: "pointer",
                top: "75%",
                transform: "translateY(-50%)",
              }}
              onClick={() => setShowConfirmPass(!showConfirmPass)}
            ></i>
          </div>

          {error && <div className="text-danger mb-2">{error}</div>}
          {success && <div className="text-success mb-2">{success}</div>}

          <div className="text-end">
            <button
              type="submit"
              className="btn btn-primary px-4 me-2"
              disabled={!isFormFilled}
            >
              {t("submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
