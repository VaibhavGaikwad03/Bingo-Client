import React from "react";
import { X } from "lucide-react";

export default function Appearance({ onclose, theme, setTheme }) {
  // console.log("Theme:", theme);
  // console.log("setTheme:", setTheme);

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
        <button
          onClick={onclose}
          className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2"
          style={{
            color: textColor,
            borderColor: borderColor,
          }}
        >
          <X size={16} />
        </button>

        <h5 className="mb-3 fw-bold text-center" style={{ color: textColor }}>
          Appearance Settings
        </h5>

        <form>
          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: textColor }}>
              Select Mode
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
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: textColor }}>
              Select Language
            </label>
            <select
              className="form-select mt-1"
              name="language"
              style={{
                backgroundColor: inputBackgroundColor,
                color: inputTextColor,
                borderColor: borderColor,
              }}
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="marathi">Marathi</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
}
