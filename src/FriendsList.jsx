import React from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "./hooks/use-mobile";
import { useState } from "react";
import "./css/SettingsSidebar.css";

export default function FriendsList({ onClose, userFriendsList }) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");

  // const userFriendsList = [
  //   {
  //     username: "john123",
  //     fullname: "John Mathew",
  //     profile_url: "/images/good_baby_pfp.jpeg",
  //   },
  //   {
  //     username: "rutuja_d",
  //     fullname: "Rutuja Dabhade",
  //     profile_url: "/images/good_baby_pfp.jpeg",
  //   },
  //   {
  //     username: "harsh_09",
  //     fullname: "Harsh Patil",
  //     profile_url: "/images/good_baby_pfp.jpeg",
  //   },
  //   {
  //     username: "neha_07",
  //     fullname: "Neha Sharma",
  //     profile_url: "/images/good_baby_pfp.jpeg",
  //   },
  // ];

  const sortedFriends = [...userFriendsList ].sort((a, b) =>
    a.fullname.localeCompare(b.fullname)
  );

  const filteredFriends = sortedFriends.filter(
    (u) =>
      u.fullname.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalFriends = userFriendsList .length;

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

        {userFriendsList .length > 0 ? (
          filteredFriends.map((req, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom"
            >
              <img
                src={req.profile_url || "/images/good_baby_pfp.jpeg"}
                alt="profile"
                className="rounded-circle"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                }}
              />

              <div className="flex-grow-1 ms-3">
                <div className="fw-semibold">{req.fullname}</div>
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                  @{req.username}
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

      {userFriendsList .length > 0 ? (
        filteredFriends.map((req, index) => (
          <div
            key={index}
            className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom"
          >
            <img
              src={req.profile_url || "/images/good_baby_pfp.jpeg"}
              alt="profile"
              className="rounded-circle"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
              }}
            />

            <div className="flex-grow-1 ms-3">
              <div className="fw-semibold">{req.fullname}</div>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                @{req.username}
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
