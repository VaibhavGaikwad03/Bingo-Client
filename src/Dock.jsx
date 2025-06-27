import React from "react";
import "./Dock.css";

const glowColor = "#ff006e"; 

export default function Dock({ items, panelHeight, baseItemSize, magnification }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        padding: "20px",
        borderRadius: "20px",
        backdropFilter: "blur(20px)",
        background: "rgba(255, 255, 255, 0.05)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        flexWrap: "wrap",   // allow wrapping on mobile
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={item.onClick}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "none",
            borderRadius: "15px",
            padding: "10px 20px",
            color: "#ffffff",
            transition: "all 0.3s ease",
            fontSize: baseItemSize / 2,
            boxShadow: `0 0 10px ${glowColor}`,
            whiteSpace: "nowrap",
            minWidth: "80px",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = `scale(${1 + magnification / 100})`;
            e.target.style.boxShadow = `0 0 20px ${glowColor}`;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = `0 0 10px ${glowColor}`;
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
