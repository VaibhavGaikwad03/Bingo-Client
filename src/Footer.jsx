import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#f4f4f4",
        padding: "20px 0",
        marginTop: "50px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
          fontSize: "1rem",
        }}
      >
        <a href="/contact" style={{ textDecoration: "none", color: "#333" }}>
          Contact Us
        </a>
        <a href="/privacy" style={{ textDecoration: "none", color: "#333" }}>
          Privacy Policy
        </a>
        <a href="/terms" style={{ textDecoration: "none", color: "#333" }}>
          Terms & Conditions
        </a>
      </div>
      <p style={{ textAlign: "center", marginTop: "10px", color: "#777" }}>
        © {new Date().getFullYear()} Bingo Chat
      </p>
    </footer>
  );
}