import React from "react";
import Dock from "./Dock";
import { Link } from "react-router-dom";
import { useIsMobile } from "./hooks/use-mobile";
export default function Navbar() {
  const isMobile = useIsMobile(); 

  const linkStyle = {
    color: "black",
    textDecoration: "none",
    textShadow: "none",
  };

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/login", text: "Login" },
    { to: "/signup", text: "Signup" },
    { to: "/about_us", text: "About us" },
  ];

  const items = navLinks.map(({ to, text }) => ({
    label: (
      <Link to={to} style={linkStyle}>
        {text}
      </Link>
    ),
    onClick: () => {},
  }));

  return (
    <nav
      className="navbar pb-4 mt-3 p-2 navbar-expand-lg mb-4 fixed-top"
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
          isMobile={isMobile}
          panelHeight={isMobile ? 36 : 48}
          baseItemSize={isMobile ? 30 : 38}
          magnification={isMobile ? 35 : 45}
        />
      </div>
    </nav>
  );
}
