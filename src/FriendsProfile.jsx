import React from "react";
import "./css/Chatpage.css";
import { useTranslation } from "react-i18next";

export default function FriendsProfile(props) {
  let {
    setShowProfileSidebar,
    theme,
    setShowImageModal,
    setModalImageSrc,
    selectedFriend,
    isMobile,
    onBack
  } = props;
  const { t } = useTranslation();

  // for mobile
  if (isMobile) {
    return (
      <div
        className={`position-fixed top-0 start-0 w-100 h-100 z-4 ${
          theme === "dark" ? "bg-dark text-light" : "bg-white"
        }`}
        style={{ overflowY: "auto" }}
      >
        {/* Mobile Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <button
            className="btn btn-link text-secondary p-0"
            onClick={onBack}
            style={{ fontSize: "1.25rem" }}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <h5 className="m-0">{t("contactInfo")}</h5>
          <div style={{ width: "24px" }}></div> {/* Spacer for balance */}
        </div>

        <div className="p-4">
          <div className="text-center mb-4">
            <img
              src={selectedFriend?.profilePic || "/images/good_baby_pfp.jpeg"}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => {
                setModalImageSrc(selectedFriend?.profilePic || "/images/good_baby_pfp.jpeg");
                setShowImageModal(true);
              }}
            />

            <h4 className="mt-3">{selectedFriend?.fullname || "Contact Name"}</h4>
            <p className="text-muted">{selectedFriend?.username || "username"}</p>

            <div className="d-flex justify-content-center align-items-center">
              <button className="btn p-3 me-3">
                <i
                  className="bi bi-camera-video-fill"
                  style={{
                    color: theme === "dark" ? "white" : "black",
                    fontSize: "20px",
                  }}
                ></i>
              </button>

              <button className="btn p-3 ms-3">
                <i
                  className="bi bi-telephone-fill"
                  style={{
                    color: theme === "dark" ? "white" : "black",
                    fontSize: "20px",
                  }}
                ></i>
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <h6>{t("about")}</h6>
            <p className="text-muted">
              {selectedFriend?.bio || "Bio not available"}
            </p>
          </div>

          <div>
            <ul
              className="ms-0 mb-2"
              style={{ listStyleType: "none", paddingLeft: 0 }}
            >
              <li className="text-danger d-flex align-items-center mb-3 clickable p-2 rounded">
                <img
                  src="/images/icons/block.png"
                  alt="Block"
                  className="icon-20 me-3"
                />
                {t("block")} {selectedFriend?.fullname}
              </li>

              <li className="text-danger d-flex align-items-center mb-3 clickable p-2 rounded">
                <img
                  src="/images/icons/report.png"
                  alt="Report"
                  className="icon-20 me-3"
                />
                {t("report")} {selectedFriend?.fullname}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Desktop 
  return (
    <div
      className={`flex-shrink-0 border-start ${
        theme === "dark" ? "bg-dark text-light" : "bg-white"
      }`}
      style={{ width: "350px", overflowY: "auto" }}
    >
      <div className="p-3 d-flex justify-content-between align-items-center border-bottom">
        <h5 className="m-0">{t("contactInfo")}</h5>
        <button
          className={`btn-close ${theme === "dark" ? "btn-close-white" : ""}`}
          onClick={() => setShowProfileSidebar(false)}
        ></button>
      </div>

      <div className="p-4">
        <div className="text-center mb-4">
          <img
            src={selectedFriend?.profilePic || "/images/good_baby_pfp.jpeg"}
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => {
              setModalImageSrc(selectedFriend?.profilePic || "/images/good_baby_pfp.jpeg");
              setShowImageModal(true);
            }}
          />

          <h4 className="mt-3">{selectedFriend?.fullname || "Contact Name"}</h4>
          <p className="text-muted">{selectedFriend?.username || "username"}</p>

          <div className="d-flex align-items-center justify-content-center">
            <button className="btn p-3 me-3">
              <i
                className="bi bi-camera-video-fill"
                style={{
                  color: theme === "dark" ? "white" : "black",
                  fontSize: "20px",
                }}
              ></i>
            </button>

            <button className="btn p-3 ms-3">
              <i
                className="bi bi-telephone-fill"
                style={{
                  color: theme === "dark" ? "white" : "black",
                  fontSize: "20px",
                }}
              ></i>
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <h6>{t("about")}</h6>
          <p className="text-muted">
            {selectedFriend?.bio || "Bio not available"}
          </p>
        </div>

        <div>
          <ul
            className="ms-0 mb-2"
            style={{ listStyleType: "none", paddingLeft: 0 }}
          >
            <li className="text-danger d-flex align-items-center mb-2 clickable">
              <img
                src="/images/icons/block.png"
                alt="Block"
                className="icon-20 me-3"
              />
              {t("block")}
            </li>

            <li className="text-danger d-flex align-items-center mb-2 clickable">
              <img
                src="/images/icons/report.png"
                alt="Report"
                className="icon-20 me-3"
              />
              {t("report")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

