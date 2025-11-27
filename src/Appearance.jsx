import React from "react";
import { useTranslation } from "react-i18next";
import "./css/Appearance_ChangePassword.css";
import { useNavigate } from "react-router-dom";

export default function Appearance({ theme, setTheme }) {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate(); //used for navigation

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setTheme(newMode);
  };
  const isDarkMode = theme === "dark";

  const overlayBackgroundColor = isDarkMode ? "rgba(0, 0, 0, 0.7)" : "#f8f9fa";
  const modalBackgroundColor = isDarkMode ? "#1e1e1e" : "#ffffff";
  const textColor = isDarkMode ? "#e0e0e0" : "#212529";
  const borderColor = isDarkMode ? "#343a40" : "#dee2e6";
  const inputBackgroundColor = isDarkMode ? "#2c2c2c" : "#ffffff";
  const inputTextColor = isDarkMode ? "#e0e0e0" : "#212529";

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
  };

  return (
    <div
      className="position-fixed d-flex align-items-center justify-content-center p-4 modal-overlay-custom modal-offset-and-zindex"
      style={{
        backgroundColor: overlayBackgroundColor,
      }}
    >
      <div
        className="modal-content-box p-4 shadow rounded-4 border position-relative"
        style={{
          backgroundColor: modalBackgroundColor,
          color: textColor,
          borderColor: borderColor,
        }}
      >
        
        <div className="d-flex align-items-center mb-3">
          <i
            className="bi bi-arrow-left-circle fs-4 me-3 clickable"
            onClick={()=> {navigate("/chatpage")}}
            style={{ 
              cursor: "pointer",
              color: textColor
            }}
            title={t("back")}
          ></i>
          <h5 className="mb-0 fw-bold text-center flex-grow-1" style={{ color: textColor }}>
            {t("appearance")}
          </h5>
          {/* Empty div for proper alignment */}
          <div style={{ width: "32px" }}></div>
        </div>

        <form>
          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: textColor }}>
              {t("mode")}
            </label>
            <select
              className="form-select mt-1"
              name="mode"
              value={theme}
              onChange={handleModeChange}
              style={{
                backgroundColor: inputBackgroundColor,
                color: inputTextColor,
                borderColor: borderColor,
              }}
            >
              <option value="light">{t("light")}</option>
              <option value="dark">{t("dark")}</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: textColor }}>
              {t("selectLanguage")}
            </label>
            <select
              className="form-select mt-1"
              name="language"
              value={i18n.language}
              onChange={handleLanguageChange}
              style={{
                backgroundColor: inputBackgroundColor,
                color: inputTextColor,
                borderColor: borderColor,
              }}
            >
              <option value="en">{t("english")}</option>
              <option value="hi">{t("hindi")}</option>
              <option value="mr">{t("marathi")}</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
}
