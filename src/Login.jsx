import { useState } from "react";

export default function Login(props) {
    let {message} = props;
    let [loginform, setLoginform] = useState("");

    function handleButtonSignup() {
        props.onButtonSignup();
    }

    function handleButtonCancel(){
        props.onButtonCancel();
    }

    function handleLoginFormSubmit(event){
        event.preventDefault();
        console.log(loginform);
        props.onLoginFormSubmit(loginform);
    }

    function handleTextChange(event) {
        let name = event.target.name;
        setLoginform({ ...loginform, [name]: event.target.value });
      }
  
    return (
      <>
        <div className="container-fluid vh-100 vw-100 m-0 p-0">
          <div
            className="row h-100 w-100 m-0"
            style={{
              background:
                "linear-gradient(to right, #ffdee9, #ff87a2, #7fa9c9, #4ca1af)",
                // background: "linear-gradient(to right, #ffffff 0%, #7fa9c9 50%, #4ca1af 100%)",
            }}
          >
            <div
              className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white"
              style={{
                background: "transparent",
              }}
            >
              <img
                src="./images/BingoLogo.png"
                alt="chat logo"
                style={{ width: "200px", marginBottom: "15px" }}
              />
              <h2 className="mb-4">Chit Chat</h2>
              <p className="text-center px-4">
                <em>Share Your Smile with this world and Find Friends</em>
              </p>
              <h4 className="mt-2"> 💌 Enjoy..!</h4>
            </div>
  
            <div
              className="col-md-6 d-flex flex-column justify-content-center align-items-center"
              style={{
                background: "transparent",
              }}
            >
              <div
                className="w-75 p-5"
                style={{
                  background:
                    "linear-gradient(to bottom right, #2c3e50, #4ca1af)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                }}
              >
                <h3 className="text-center text-primary mb-4">LOGIN</h3>

                <div className="text-center mb-4"><em>{message}</em></div>

                <form action="accept()" method="post" onSubmit={handleLoginFormSubmit}>
                  <div className="mb-4 d-flex align-items-center border-bottom pb-1">
                    <i className="bi bi-person-badge me-3 fs-4"></i>
                    <input
                      className="form-control border-0"
                      type="text"
                      name="username_email"
                      onChange={handleTextChange}
                      placeholder="Enter Username / Email-id"
                      required
                    />
                  </div>
                  <div className="mb-4 d-flex align-items-center border-bottom pb-2">
                    <i className="bi bi-lock-fill me-3 fs-4"></i>
                    <input
                      className="form-control border-0"
                      type="password"
                      onChange={handleTextChange}
                      name="password"
                      placeholder="Enter Password"
                      required
                    />
                  </div>
                  <div className="text-center">
                    <input
                      type="submit"
                      value="Login"
                      className="btn btn-success me-3"
                    />
                    <input type="button" value="Cancel"  className="btn btn-danger" onClick={handleButtonCancel} />
                  </div>
                  <div className="mt-3 text-center">
                    Don't have an account?{" "}
                    <a
                      className="text-info text-decoration-underline fw-bold"
                      href="#"
                      onClick={handleButtonSignup}
                    >
                      Signup
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
