import { useState } from "react";
import { MessageTypes } from "./Status_MessageTypes";
import { useEffect } from "react";

export default function ChangePassword({
  setMessage,
  message,
  currentUserId,
  currentUser,
  onclose,
  socket,
}) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const isFormFilled = oldPass !== "" && newPass !== "" && confirmPass !== "";

  const [currentThemeMode, setCurrentThemeMode] = useState(() => {
    return localStorage.getItem("themeMode") || "light";
  });

  // Listen for changes to the theme mode (e.g., from Appearance component)
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentThemeMode(localStorage.getItem("themeMode") || "light");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (message) {
      clearMessage();
    }
  }, [message]);

  const isValidPassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasNoSpaces = !/\s/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasNoSpaces && hasSpecialChar;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parseUser = currentUser;

    // // This check should probably be done on the server, not client-side in JS
    // if (oldPass !== parseUser.password) {
    //   setError("❌ Old password is incorrect.");
    //   setSuccess("");
    //   return;
    // }

    if (!isValidPassword(newPass)) {
      // Moved up for quicker feedback
      setError(
        "❌ Password must be at least 8 characters, contain a special character, and have no spaces."
      );
      setSuccess("");
      return;
    }

    if (newPass !== confirmPass) {
      // Moved up for quicker feedback
      setError("❌ Passwords do not match.");
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
      console.log(passwordData, "Password data");
      socket.send(JSON.stringify(passwordData));
    } else {
      console.log("WebSocket not connected:", socket?.readyState);
      setError("❌ Failed to connect to server. Please try again."); // Added error for WebSocket not connected
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

  // Determine dynamic overlay background color
  const overlayBackgroundColor =
    currentThemeMode === "dark" ? "rgba(0, 0, 0, 0.7)" : "#f8f9fa";

  return (
    <div
    className="position-fixed d-flex align-items-center justify-content-center p-4 modal-overlay-custom modal-offset-and-zindex"
    >
      <div
        className="bg-white p-4 shadow rounded-4 border"
        style={{
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h4 className="mb-3 text-center">Change Password</h4>
        <em>{message}</em>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative">
            <label className="form-label fw-bold">Old Password</label>
            <input
              type={showOldPass ? "text" : "password"}
              className="form-control"
              style={{ paddingRight: "40px" }}
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value.replace(/\s/g, ''))}
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
                // Bootstrap icons usually inherit color, but if not, you can force it:
                // color: currentThemeMode === 'dark' ? '#e0e0e0' : '#212529'
              }}
              onClick={() => setShowOldPass(!showOldPass)}
            ></i>
          </div>
          <div className="mb-3 position-relative">
            <label className="form-label fw-bold">New Password</label>
            <input
              type={showNewPass ? "text" : "password"}
              className="form-control"
              style={{ paddingRight: "40px" }}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value.replace(/\s/g, ''))}
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
            <label className="form-label fw-bold">Confirm Password</label>
            <input
              type={showConfirmPass ? "text" : "password"}
              className="form-control"
              style={{ paddingRight: "40px" }}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value.replace(/\s/g, ''))}
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

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary px-4 me-2"
              disabled={!isFormFilled}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary px-4"
              onClick={onclose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
