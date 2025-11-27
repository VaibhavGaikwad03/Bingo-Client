import React, { useState } from "react";
import { MessageTypes } from "./js_files/Status_MessageTypes";
import ConfirmModal from "./ConfirmModal";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "./hooks/use-mobile";
import "./css/SettingsSidebar.css"
export default function SettingsSidebar({
  navigate,
  currentUserId,
  currentUsername,
  socket,
  onClose,
  theme
}) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const confirmLogout = () => {
    const logout_req = {
      message_type: MessageTypes.LOGOUT_REQUEST,
      user_id: currentUserId,
      username: currentUsername,
    };
    socket.send(JSON.stringify(logout_req));
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const sidebarItems = [
    // {
    //   key: "profile",
    //   labelKey: "Profile",
    //   iconSrc: "/images/icons/user.png",
    //   alt: "profile",
    //   onClick: () => navigate("/profile"),
    //   className: isMobile ? "list-group-item-action" : "",
    // },
    {
      key: "profile",
      labelKey: "Friend List",
      iconSrc: "/images/icons/bff.png",
      alt: "profile",
      onClick: () => navigate("/profile"),
      className: isMobile ? "list-group-item-action" : "",
    },
    {
      key: "settings",
      labelKey: "Settings",
      iconSrc: "/images/icons/setting.png",
      alt: "settings",
      onClick: () => navigate("/settings"),
      className: isMobile ? "list-group-item-action" : "",
    },
    {
      key: "logout",
      labelKey: "Logout",
      iconSrc: "/images/icons/logout.png",
      alt: "logout",
      onClick: () => setShowLogoutConfirm(true),
      className: "text-danger",
    },
  ];

  const renderListItem = (item) => (
    <li
      key={item.key}
      className={`list-group-item ${item.className}`}
      onClick={item.onClick}
    >
      <img src={item.iconSrc} alt={item.alt} className="me-2 icon-size" />
      {t(item.labelKey)}
    </li>
  );

  const confirmModal = showLogoutConfirm && (
    <ConfirmModal
      title="Confirm Logout"
      message="Are you sure you want to log out?"
      onConfirm={confirmLogout}
      onCancel={handleCancelLogout}
    />
  );

  if (isMobile) {
    return (
      <div className="bg-white vh-100 p-3 mobile-sidebar">
        <div className="d-flex align-items-center mb-4">
          <i
            className="bi bi-x-lg fs-4 me-3"
            role="button"
            onClick={onClose}
          ></i>
          <h5 className="mb-0 fw-bold"></h5>
        </div>

        <ul className="list-group">{sidebarItems.map(renderListItem)}</ul>
        {confirmModal}
      </div>
    );
  }

  return (
    <div className="settings-options">
      <i className="bi bi-x-lg settings-close-icon" onClick={onClose}></i>
      <h5 className="mb-4 mt-2"></h5>
      <ul className="list-group list-group-flush">
        {sidebarItems.map((item) => {
          const desktopItem = {
            ...item,
            className: item.key === "logout" ? "text-danger" : "",
          };
          return renderListItem(desktopItem);
        })}
      </ul>
      {confirmModal}
    </div>
  );
}
