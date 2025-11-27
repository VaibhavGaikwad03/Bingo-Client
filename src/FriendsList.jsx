import React from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "./hooks/use-mobile";
import { useState } from "react";
import "./css/SettingsSidebar.css";

export default function FriendsList({ onClose }) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");

  const friendRequest = [
    {
      sender: "john123",
      name_of_sender: "John Mathew",
      profile_url: "/images/good_baby_pfp.jpeg",
    },
    {
      sender: "rutuja_d",
      name_of_sender: "Rutuja Dabhade",
      profile_url: "/images/good_baby_pfp.jpeg",
    },
    {
      sender: "harsh_09",
      name_of_sender: "Harsh Patil",
      profile_url: "/images/good_baby_pfp.jpeg",
    },
    {
      sender: "neha_07",
      name_of_sender: "Neha Sharma",
      profile_url: "/images/good_baby_pfp.jpeg",
    },
  ];

  const sortedFriends = [...friendRequest].sort((a, b) =>
    a.name_of_sender.localeCompare(b.name_of_sender)
  );

  const filteredFriends = sortedFriends.filter(
    (u) =>
      u.name_of_sender.toLowerCase().includes(search.toLowerCase()) ||
      u.sender.toLowerCase().includes(search.toLowerCase())
  );

  const totalFriends = friendRequest.length;

  if (isMobile) {
    return (
      <div className="bg-white vh-100 p-3 mobile-sidebar">
        <div className="d-flex align-items-center mb-4">
          <i
            className="bi bi-x-lg fs-4 me-3"
            role="button"
            onClick={onClose}
          ></i>

          <h5 className="mb-0 fw-bold">
            {t("friendList")} ({totalFriends})
          </h5>
        </div>
        <div className="mb-3 position-relative">
          <i className="bi bi-search position-absolute search-icon"></i>

          <input
            type="text"
            className="form-control search-input"
            placeholder="Search friends..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {friendRequest.length > 0 ? (
          filteredFriends.map((req, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom"
            >
              <img
                src={req.profile_url || "/images/icons/user.png"}
                alt="profile"
                className="rounded-circle"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                }}
              />

              <div className="flex-grow-1 ms-3">
                <div className="fw-semibold">{req.name_of_sender}</div>
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                  @{req.sender}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted mt-3">{t("noFriends")}</p>
        )}
      </div>
    );
  }

  return (
    <div className="settings-options">
      <i className="bi bi-x-lg settings-close-icon" onClick={onClose}></i>

      <h5 className="mb-4 mt-2">
        {t("friendList")} ({totalFriends})
      </h5>

      <div className="mb-3 position-relative">
        <i className="bi bi-search position-absolute search-icon"></i>

        <input
          type="text"
          className="form-control search-input"
          placeholder="Search friends..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {friendRequest.length > 0 ? (
        filteredFriends.map((req, index) => (
          <div
            key={index}
            className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom"
          >
            <img
              src={req.profile_url || "/images/icons/user.png"}
              alt="profile"
              className="rounded-circle"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
              }}
            />

            <div className="flex-grow-1 ms-3">
              <div className="fw-semibold">{req.name_of_sender}</div>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                @{req.sender}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted mt-3">{t("noFriends")}</p>
      )}
    </div>
  );
}
