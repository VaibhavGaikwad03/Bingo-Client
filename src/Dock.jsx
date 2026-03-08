import React from "react";
import "./css/Dock.css";

const glowColor = "#ff006e";

export default function Dock({
  items,
  // eslint-disable-next-line no-unused-vars
  panelHeight,
  baseItemSize,
  magnification,
  isMobile,
}) {
  return (
    <div
      className={`dock-container ${isMobile ? "dock-mobile" : "dock-desktop"}`}
      style={{ "--glow-color": glowColor }}
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={item.onClick}
          className="dock-btn"
          style={{
            fontSize: baseItemSize / 2, 
            "--magnification": 1 + magnification / 100, 
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
