import Dock from "./Dock";
// import SplashCursor from "./SplashCursor";

export default function Navbar(props) {
  
  const items = [
    {
      label: <span style={{ color: "black" }}>Home</span>,
      onClick: () => alert("Home!"),
    },
    {
      label: <span style={{ color: "black" }}>Login</span>,
      onClick: props.onButtonLogin,
    },
    {
      label: <span style={{ color: "black" }}>Signup</span>,
      onClick: props.onButtonSignup,
    },
    {
      label: <span style={{ color: "black" }}>About us</span>,
      onClick: () => alert("About us!"),
    },
  ];

  return (
    <>
      <nav
        className="navbar p-4 navbar-expand-lg mb-4 mt-0"
        style={{ position: "relative" }}
      >
        {/* <SplashCursor /> */}
        <div className="container-fluid">

          {/* Logo */}
          <div className="d-flex col-3 justify-content-start p-0 ms-0">
            <img
              className="img-fluid mt-3"
              src="./images/BingoLogo.png"
              alt="chatlogo"
              style={{
                maxHeight: "130px",
                filter: "drop-shadow(0 0 15px #ff00ff)",
                animation: "floatLogo 4s ease-in-out infinite",
              }}
            />
          </div>

          {/* Dock Menu */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              paddingRight: "20px"
            }}
          >
            <Dock items={items} panelHeight={48} baseItemSize={38} magnification={45} />
          </div>

        </div>
      </nav>
    </>
  );
}
