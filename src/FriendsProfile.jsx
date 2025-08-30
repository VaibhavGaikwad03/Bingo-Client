import React from "react";

export default function FriendsProfile(props) {
  let { setShowProfileSidebar, theme } = props;
  return (
    <>
      <div
        className={`flex-shrink-0 border-start ${
          theme === "dark" ? "bg-dark text-light" : "bg-white"
        }`}
        style={{ width: "350px", overflowY: "auto" }}
      >
        <div className="p-3 d-flex justify-content-between align-items-center border-bottom">
          <h5 className="m-0">Contact Info</h5>
          <button
            className={`btn-close ${theme === "dark" ? "btn-close-white" : ""}`}
            onClick={() => setShowProfileSidebar(false)}
          ></button>
        </div>

        <div className="p-4">
          <div className="text-center mb-4">
            <img
              src="/images/good_baby_pfp.jpeg"
              alt="Profile"
              className="rounded-circle"
              style={{ width: 150, height: 150, objectFit: "cover" }}
            />
            <h4 className="mt-3">Contact Name</h4>
            <p className="text-muted">Online</p>
          </div>
          <p>Bio... </p>
        </div>
      </div>
    </>
  );
}
