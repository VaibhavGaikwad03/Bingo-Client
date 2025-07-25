import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageTypes } from "./Status_MessageTypes";

export default function Login(props) {
  const { message, setMessage , socket ,timestamp ,setCurrentUsername} = props;
  const [loginform, setLoginform] = useState({});
  const [usernameError, setUsernameError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  function handleButtonCancel() {
    navigate("/");
  }

  function clearMessage() {
    setMessage("");
  }

  function handleButtonSignup() {
    navigate("/signup");
  }

  function handleLoginFormSubmit(event) {
    event.preventDefault();
    setCurrentUsername(loginform.username);
    if (socket && socket.readyState === WebSocket.OPEN) {
      const loginData = {
        message_type: MessageTypes.LOGIN_REQUEST,
        ...loginform,
        timestamp,
      };
      socket.send(JSON.stringify(loginData));
    } else {
      console.log("WebSocket not connected:", socket?.readyState);
    }
  }

  function handleTextChange(eventOrName, value) {
    let name, inputValue;
    clearMessage();
    if (typeof eventOrName === "object" && eventOrName.target) {
      name = eventOrName.target.name;
      inputValue = eventOrName.target.value;
    } else {
      name = eventOrName;
      inputValue = value;
    }

    if (name === "username") {
      let newValue = "";
      let error = "";

      for (let i = 0; i < inputValue.length; i++) {
        let char = inputValue[i];

        if (char >= "A" && char <= "Z") {
          char = char.toLowerCase();
        }

        if (
          (char >= "a" && char <= "z") ||
          (char >= "0" && char <= "9") ||
          char === "_"
        ) {
          if (i === 0 && !/[a-z_]/.test(char)) {
            error = "First character must be a lowercase letter or underscore.";
            break;
          }
          newValue += char;
        } else {
          error = `Character "${inputValue[i]}" is not allowed.`;
          break;
        }
      }
      setLoginform({ ...loginform, [name]: newValue });
      setUsernameError(error);
    } else {
      setLoginform({ ...loginform, [name]: inputValue });
    }
  }

  return (
    <div className="container-fluid vh-100 vw-100 m-0 p-0">
      <div
        className="row h-100 w-100 m-0"
        style={{
          background:
            "linear-gradient(to right, #ffdee9, #ff87a2, #7fa9c9, #4ca1af)",
        }}
      >
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white">
          <img
            className="img-fluid mt-3"
            src="./images/BingoLogo.png"
            alt="chatlogo"
            style={{
              width: "200px",
              marginBottom: "15px",
              filter: "drop-shadow(0 0 15px #ff00ff)",
              animation: "floatLogo 4s ease-in-out infinite",
            }}
          />
          <h2 className="mb-4 text-muted">Chit Chat</h2>
          <p className="text-center px-4 text-muted">
            <em>Share Your Smile with this world and Find Friends</em>
          </p>
          <h4 className="mt-2 text-muted"> 💌 Enjoy..!</h4>
        </div>

        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <div className="w-75 p-5 form-container">
            <h3 className="text-center text-primary mb-4">LOGIN</h3>
            <div className="text-center mb-4">
              <em>{message === "Login Successfull" ? message : null}</em>
            </div>

            <form onSubmit={handleLoginFormSubmit}>
              <div className="pb-1 mb-3">
                <div className="d-flex align-items-center border-bottom ">
                  <i className="bi bi-person-badge me-3 fs-4"></i>
                  <input
                    className="form-control border-0 mb-2"
                    type="text"
                    name="username"
                    autoComplete="off"
                    value={loginform.username || ""}
                    onChange={handleTextChange}
                    placeholder="Username"
                    required
                  />
                </div>
                {usernameError && (
                  <div className="ms-5 text-danger">
                    <em>{usernameError}</em>
                  </div>
                )}
                {message === "Username does not Exist" && !usernameError && (
                  <div className="ms-5 text-danger">
                    <em>{message}</em>
                  </div>
                )}
              </div>

              <div className="pb-1 mb-3">
                <div className="d-flex align-items-center border-bottom position-relative w-100">
                  <i className="bi bi-lock-fill me-3 fs-4"></i>
                  <input
                    className="form-control border-0 mb-2"
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    name="password"
                    onChange={handleTextChange}
                    placeholder="Enter Password"
                    required
                  />
                  <i
                    className={`bi ${
                      showPassword ? "bi-eye" : "bi-eye-slash"
                    } position-absolute end-0 me-3`}
                    style={{
                      cursor: "pointer",
                      top: "40%",
                      transform: "translateY(-50%)",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>

                {message === "Incorrect Password" && (
                  <div className="ms-5 text-danger">
                    <em>{message}</em>
                  </div>
                )}
              </div>

              <div className="text-center">
                <input
                  type="submit"
                  value="Login"
                  className="btn btn-success me-3"
                />
                <input
                  type="button"
                  value="Cancel"
                  className="btn btn-danger"
                  onClick={handleButtonCancel}
                />
              </div>

              <div className="mt-3 text-center">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="btn btn-link p-0 text-primary fw-bold"
                  onClick={handleButtonSignup}
                >
                  Signup
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
