import React, { useState, useEffect } from "react";
import Dock from "./Dock";
import { Link } from "react-router-dom";

export default function Navbar(props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = [
    {
      label: (
        <Link
          to="/"
          style={{ color: "black", textDecoration: "none", textShadow: "none" }}
        >
          Home
        </Link>
      ),
      onClick: () => {},
    },
    {
      label: (
        <Link
          to="/login"
          style={{ color: "black", textShadow: "none", textDecoration: "none" }}
        >
          Login
        </Link>
      ),
      onClick: () => {},
    },
    {
      label: (
        <Link
          to="/signup"
          style={{ color: "black", textShadow: "none", textDecoration: "none" }}
        >
          Signup
        </Link>
      ),
      onClick: () => {},
    },
    {
      label: (
        <Link
          to="/about_us"
          style={{ color: "black", textShadow: "none", textDecoration: "none" }}
        >
          About us
        </Link>
      ),
      onClick: () => {},
    },
  ];

  return (
    <nav
      className="navbar pb-4 mt-3 p-2 navbar-expand-lg mb-4 fixed-top "
      style={{ background: "#ffc0db" }}
    >
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between">
        <div className="p-0 m-0">
          <img
            className="img-fluid"
            src="./images/BingoLogo.png"
            alt="chatlogo"
            style={{
              maxHeight: isMobile ? "60px" : "120px",
              filter: "drop-shadow(0 0 15px #ff00ff)",
              animation: "floatLogo 4s ease-in-out infinite",
            }}
          />
        </div>

        <Dock
          items={items}
          panelHeight={isMobile ? 36 : 48}
          baseItemSize={isMobile ? 30 : 38}
          magnification={isMobile ? 35 : 45}
        />
      </div>
    </nav>
  );
}
