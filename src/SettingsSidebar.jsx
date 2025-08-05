import { useState } from "react";
import Settings from "./Settings.jsx";
import { MessageTypes } from "./Status_MessageTypes";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

export default function SettingsSidebar({
  theme,
  setTheme,
  setMessage,
  message,
  onClose,
  currentUserId,
  currentUsername,
  socket,
}) {
  let [settingsView, setSettingsView] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  function handleclosesettings() {
    navigate("/settings");
    setSettingsView("");
  }

  // function handleLogoutButtonClick(){
  //   const logout_req = {
  //     message_type: MessageTypes.LOGOUT_REQUEST,
  //     user_id : currentUserId ,
  //     username : currentUsername
  //   };
  //   console.log(logout_req);
  //   socket.send(JSON.stringify(logout_req));
  // }
  function handleLogoutButtonClick() {
    setShowLogoutConfirm(true);
  }

  function confirmLogout() {
    const logout_req = {
      message_type: MessageTypes.LOGOUT_REQUEST,
      user_id: currentUserId,
      username: currentUsername,
    };
    console.log(logout_req);
    socket.send(JSON.stringify(logout_req));
    setShowLogoutConfirm(false);
  }

  function handleCancelLogout() {
    setShowLogoutConfirm(false);
  }

  return settingsView === "settings" ? (
    <Settings
      theme={theme}
      setTheme={setTheme}
      onClose={() => setSettingsView("")}
    />
  ) : (
    <div className="settings-options">
      <>
        {console.log("Theme in settings sidebar", theme)}
        {console.log("set theme in settings sidebar", setTheme)}
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
            // onClick={() => navigate("/")}
            onClick={handleLogoutButtonClick}
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

      {showLogoutConfirm && (
        <ConfirmModal
          title="Confirm Logout"
          message="Are you sure you want to log out?"
          onConfirm={confirmLogout}
          onCancel={handleCancelLogout}
        />
      )}

      {settingsView == "settings" && (
        <>
          <Settings
            message={message}
            setMessage={setMessage}
            theme={theme}
            setTheme={setTheme}
            socket={socket}
            onClose={handleclosesettings}
            currentUserId={currentUserId}
          />
        </>
      )}
    </div>
  );
}
