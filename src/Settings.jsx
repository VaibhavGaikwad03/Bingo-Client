import { useState } from "react";
import ChangePassword from "./ChangePassword";
import Appearance from "./Appearance";

export default function Settings({
  setMessage,
  message,
  onClose,
  currentUserId,
  currentUser,
  socket,
  theme,
  setTheme
}) {
  const [setting, setSetting] = useState("");

  return (
    <>
      <div className="settings-sidebar">
        {console.log(socket,"socket in settings")}
        <div>
          {console.log("Theme in settings" , theme)}
          {console.log("set theme in settings" , setTheme)}

          <i className="bi bi-x-lg settings-close-icon" onClick={onClose}></i>
          <h5 className="mb-4 mt-2"></h5>

          <ul className="list-group list-group-flush">
            <li
              className="list-group-item"
              onClick={() => setSetting("change_password")}
            >
              <img
                src="/images/icons/forgot-password.png"
                className="me-2"
                alt="change_pass_logo"
                onClick={() => setSetting("change_password")}
                style={{ width: "25px", height: "25px" }}
              />
              Change Password
            </li>
            <li
              className="list-group-item"
              onClick={() => setSetting("appearance")}
            >
              <img
                src="/images/icons/color-palette.png"
                className="me-2"
                alt="color-palette"
                onClick={() => setSetting("appearance")}
                style={{ width: "25px", height: "25px" }}
              />
              Appearance
            </li>
            <li
              className="list-group-item"
              // onClick={() => setSetting("privacy")}
            >
              <img
                src="/images/icons/privacy.png"
                className="me-2"
                alt="privacy"
                // onClick={() => setSetting("privacy")}
                style={{ width: "25px", height: "25px" }}
              />
              Privacy
            </li>
            <li
              className="list-group-item text-danger"
              // onClick={() => setSetting("delete_account")}
            >
              <img
                src="/images/icons/delete_account.png"
                className="me-2"
                alt="delete_account"
                // onClick={() => setSetting("delete_account")}
                style={{ width: "25px", height: "25px" }}
              />
              Delete Account
            </li>
          </ul>
        </div>
      </div>

      {setting === "change_password" && (
        <div className="change-password-overlay">
          <ChangePassword
            message={message}
            currentUserId={currentUserId}
            socket={socket}
            currentUser={currentUser}
            onclose={() => setSetting("")}
          />
        </div>
      )}

      {setting === "appearance" && (
        <div className="change-password-overlay">
          <Appearance
            currentUser={currentUser}
            onclose={() => setSetting("")}
            theme={theme}
            setTheme = {setTheme}
          />
        </div>
      )}
    </>
  );
}
