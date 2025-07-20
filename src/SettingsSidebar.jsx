import { useState } from "react";
import Settings from "./Settings.jsx";
import { MessageTypes } from "./Status_MessageTypes";
import { useNavigate } from "react-router-dom";

export default function SettingsSidebar({ onClose }) {
  let [settingsView, setSettingsView] = useState("");
  const navigate = useNavigate();
  function handleclosesettings() {
    navigate("/settings");
    setSettingsView("");
  }

  function handleLogoutButtonClick(){
    props.onLogoutButtonClick();
  }

  return settingsView === "settings" ? (
    <Settings onClose={() => setSettingsView("")} />
  ) : (
    <div className="settings-options">
      <>
        <i className="bi bi-x-lg settings-close-icon" onClick={onClose}></i>

        <h5 className="mb-4 mt-2"></h5>

        <ul className="list-group list-group-flush">
          <li
            className="list-group-item"
            onClick={() => setSettingsView("settings")}
          >
            <img
              src="/images/icons/setting.png"
              className="me-2"
              alt="settings_logo"
              style={{ width: "20px", height: "20px" }}
            />
            Settings
          </li>
          <li
            className="list-group-item text-danger"
            onClick={() => navigate("/")}
          >
            <img
              src="/images/icons/logout.png"
              alt="logout_logo"
              style={{ width: "20px", height: "20px", marginRight: "10px" }}
              onClick={handleLogoutButtonClick}
            />
            Logout
          </li>
        </ul>
      </>

      {settingsView == "settings" && (
        <>
          <Settings
            onClose={handleclosesettings}
            // onClose={() => setSettingsView("")}
          />
        </>
      )}
    </div>
  );
}
