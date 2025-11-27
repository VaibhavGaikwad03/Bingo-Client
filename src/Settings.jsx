import React, { useState } from "react";
import ChangePassword from "./ChangePassword";
import Appearance from "./Appearance";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "./hooks/use-mobile"; // Assuming the hook is correctly imported
import "./css/SettingsSidebar.css";
import { href } from "react-router-dom";

export default function Settings({
  setMessage,
  message,
  onClose,
  currentUserId,
  socket,
  theme,
  setTheme,
  navigate,
}) {
  const [setting, setSetting] = useState("");
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const settingItems = [
    {
      key: "change_password",
      labelKey: "changePassword",
      iconSrc: "/images/icons/forgot-password.png",
      href: "changepassword",
      className: "",
    },
    {
      key: "appearance",
      labelKey: "appearance",
      href: "appearance",
      iconSrc: "/images/icons/color-palette.png",
      className: "",
    },
    {
      key: "privacy",
      labelKey: "privacy",
      href: "privacy",
      iconSrc: "/images/icons/privacy.png",
      className: "",
    },
    {
      key: "delete_account",
      labelKey: "deleteAccount",
      href: "deleteaccount",
      iconSrc: "/images/icons/delete_account.png",
      className: "text-danger",
    },
  ];

  const renderListItem = (item) => (
    <li
      key={item.key}
      className={`list-group-item ${item.className}`}
      onClick={() => setSetting(item.key)}
    >
      <img
        src={item.iconSrc}
        alt={item.key}
        className="me-2"
        style={{ width: "25px", height: "25px" }}
      />
      {t(item.labelKey)}
    </li>
  );

  const renderSettingComponent = () => {
    if (!setting) return null;

    const commonProps = {
      onclose: () => setSetting(""),
      isMobile,
    };

    switch (setting) {
      case "change_password":
        return (
          <>
            <ChangePassword
              {...commonProps}
              setMessage={setMessage}
              message={message}
              currentUserId={currentUserId}
              socket={socket}
              navigate={navigate}
              theme={theme}
            />
          </>
        );
      case "appearance":
        return (
          <>
            <Appearance {...commonProps} theme={theme} setTheme={setTheme} />
          </>
        );
      case "privacy":
        return (
          <div className="settings-content">
            <h4>{t("privacy")}</h4>
            <p>Privacy settings content...</p>
            <button className="btn btn-secondary" onClick={commonProps.onclose}>
              Back
            </button>
          </div>
        );
      case "delete_account":
        return (
          <div className="settings-content text-danger">
            <h4>{t("deleteAccount")}</h4>
            <p>Are you sure you want to delete your account?</p>
            <button className="btn btn-danger me-2">Confirm Delete</button>
            <button className="btn btn-secondary" onClick={commonProps.onclose}>
              Cancel
            </button>
          </div>
        );
      default:
        return null;
    }
  }

  if (isMobile && setting) {
    return (
      <div className="mobile-settings-view">{renderSettingComponent()}</div>
    );
  }

  return (
    <>
      <div className={`settings-sidebar ${isMobile ? "mobile-sidebar" : ""}`}>
        <div>
          <i className="bi bi-x-lg settings-close-icon" onClick={onClose}></i>
          <h5 className="mb-4 mt-2 fw-bold"></h5>

          <ul className="list-group list-group-flush">
            {settingItems.map(renderListItem)}
          </ul>
        </div>
      </div>

      {renderSettingComponent()}
    </>
  );
}