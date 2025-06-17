export default function Navbar(props){
    function handleButtonLogin() {
        props.onButtonLogin();
      }
    function handleButtonSignup() {
        props.onButtonSignup();
    }

    return (
        <nav className="navbar p-4 navbar-expand-lg mb-4 mt-0">
          <div className="container-fluid">
            <div className="d-flex col-3 justify-content-start p-0 ms-0">
            <img
                  className="img-fluid"
                  src="./images/BingoLogo.png"
                  alt="chatlogo"
                  style={{ maxHeight: "90px" }}
                />
            </div>
            <div className="col-3"></div>
            <div className="col-6 d-flex justify-content-center align-items-center">
                <>
                  <button
                    className="login btn btn-light m-4 p-2"
                     onClick={handleButtonLogin}
                  >
                    {" "}
                    Login{" "}
                  </button>
                  <button
                    className="signup btn btn-light m-4 p-2"
                     onClick={handleButtonSignup}
                  >
                    {" "}
                    Signup{" "}
                  </button>
                </>    
            </div>
          </div>
        </nav>
      );
}