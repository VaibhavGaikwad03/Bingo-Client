import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.css";
import { useNavigate } from "react-router-dom";
import { MessageTypes } from "./Status_MessageTypes";
import {
  validateUsername,
  validatePassword,
  validateName,
  validateEmail,
  validatePhone,
  validateDOB,
} from "./Validations.js";

export default function Signup(props) {
  const { message, setMessage, socket, timestamp } = props;
  const [signupform, setSignupform] = useState({});
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [dobError, setDobError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  function handleButtonCancel() {
    navigate("/");
  }

  function clearMessage() {
    setMessage("");
  }

  function handleButtonLogin() {
    clearMessage();
    navigate("/login");
  }

  function handleSignupFormSubmit(event) {
    event.preventDefault();
    clearMessage();

    const usernameValidation = validateUsername(signupform.username);
    const passwordValidation = validatePassword(signupform.password);
    const nameValidation = validateName(signupform.fullname);
    const emailValidation = validateEmail(signupform.email);
    const phoneValidation = validatePhone(signupform.phone);
    const dobValidation = validateDOB(signupform.dob);

    setUsernameError(usernameValidation.error);
    setPasswordError(passwordValidation.error);
    setFullNameError(nameValidation.error);
    setEmailError(emailValidation.error);
    setPhoneError(phoneValidation.error);
    setDobError(dobValidation.error);

    const hasGender = !!signupform.gender;
    if (!hasGender) {
      setMessage("Please select a gender.");
    }

    const formIsValid =
      !usernameValidation.error &&
      !passwordValidation.error &&
      !nameValidation.error &&
      !emailValidation.error &&
      !phoneValidation.error &&
      !dobValidation.error &&
      hasGender;

    if (!formIsValid) {
      setMessage("❌ Please correct the errors in the form.");
      return;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      const signupData = {
        message_type: MessageTypes.SIGN_UP_REQUEST,
        ...signupform,
        timestamp,
      };
      socket.send(JSON.stringify(signupData));
      console.log(signupData);
    } else {
      console.log("WebSocket not connected:", socket?.readyState);
      setMessage("❌ Unable to connect to the server.");
    }
  }

  function formatDate(date) {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function handleTextChange(eventOrName, value) {
    let name, inputValue;

    if (typeof eventOrName === "object" && eventOrName.target) {
      name = eventOrName.target.name;
      inputValue = eventOrName.target.value;
    } else {
      name = eventOrName;
      inputValue = value;
    }

    setSignupform((prevForm) => {
      const updatedForm = { ...prevForm, [name]: inputValue };

      clearMessage();

      switch (name) {
        case "username": {
          const { newValue, error } = validateUsername(inputValue);
          setUsernameError(error);
          return { ...prevForm, username: newValue };
        }
        case "fullname": {
          const { value, error } = validateName(inputValue);
          setFullNameError(error);
          return { ...prevForm, fullname: value };
        }
        case "email": {
          const { error } = validateEmail(inputValue);
          setEmailError(error);
          break;
        }
        case "phone": {
          const cleanedPhone = inputValue.replace(/\D/g, "");
          setPhoneError(
            cleanedPhone.length > 0 && cleanedPhone.length !== 10
              ? "Phone number must be exactly 10 digits."
              : ""
          );
          return { ...prevForm, phone: cleanedPhone };
        }
        case "dob": {
          const { error } = validateDOB(inputValue);
          setDobError(error);
          break;
        }
        case "password": {
          const { error } = validatePassword(inputValue);
          setPasswordError(error);
          break;
        }
        default:
          break;
      }
      return updatedForm;
    });
  }

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background:
          "linear-gradient(to right, #ffdee9, #ff87a2, #7fa9c9, #4ca1af)",
        margin: 0,
        overflow: "auto",
      }}
    >
      <div className="mb-3">
        <img
          className="img-fluid mt-3"
          src="./images/BingoLogo.png"
          alt="chatlogo"
          style={{
            maxHeight: "120px",
            filter: "drop-shadow(0 0 15px #ff00ff)",
            animation: "floatLogo 4s ease-in-out infinite",
          }}
        />
      </div>

      <div
        className="p-4 form-container"
        style={{
          width: "90%",
          maxWidth: "500px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "15px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <h3 className="text-center text-primary mb-4">SIGNUP</h3>
        {message && (
          <div className="text-center mb-4 text-danger">
            <em>{message}</em>
          </div>
        )}

        <form onSubmit={handleSignupFormSubmit}>
          <div className="pb-1 mb-3">
            <div className="d-flex align-items-center border-bottom">
              <i className="bi bi-person-circle me-3 fs-4"></i>
              <input
                className="form-control border-0 mb-2"
                type="text"
                name="username"
                autoComplete="off"
                value={signupform.username || ""}
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
            {message === "Username already exists!" && !usernameError && (
              <div className="ms-5 text-danger">
                <em>{message}</em>
              </div>
            )}
          </div>

          <div className="pb-1 mb-3">
            <div className="d-flex align-items-center border-bottom">
              <i className="bi bi-lock-fill me-3 fs-4"></i>
              <input
                className="form-control border-0"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="off"
                onChange={handleTextChange}
                onKeyDown={(e) => {
                  if (e.key === " ") e.preventDefault();
                }}
                placeholder="Password"
                required
              />
              <i
                className={`bi ${
                  showPassword ? "bi-eye" : "bi-eye-slash"
                } position-absolute end-0 me-5`}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            {passwordError && (
              <div className="ms-5 text-danger">
                <em>{passwordError}</em>
              </div>
            )}
          </div>

          <div className="pb-1 mb-3">
            <div className="d-flex align-items-center border-bottom">
              <i className="bi bi-person-vcard-fill me-3 fs-4"></i>
              <input
                className="form-control border-0"
                type="text"
                name="fullname"
                autoComplete="off"
                value={signupform.fullname || ""}
                onChange={handleTextChange}
                placeholder="Enter your Full name"
                required
              />
            </div>
            {fullNameError && (
              <div className="ms-5 text-danger">
                <em>{fullNameError}</em>
              </div>
            )}
          </div>

          <div className="pb-1 mb-3">
            <div className="d-flex align-items-center border-bottom">
              <i className="bi bi-calendar-date me-3 fs-4"></i>
              <DatePicker
                selected={signupform.dob ? new Date(signupform.dob) : null}
                onChange={(date) => {
                  const formattedDate = date ? formatDate(date) : null;
                  handleTextChange("dob", formattedDate);
                }}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                placeholderText="Select your Date of Birth"
                className="form-control border-0 w-100"
                calendarClassName="custom-calendar"
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                required
              />
            </div>
            {dobError && (
              <div className="ms-5 text-danger">
                <em>{dobError}</em>
              </div>
            )}
          </div>

          <div className="pb-1 mb-3">
            <div className="d-flex align-items-center border-bottom">
              <i className="bi bi-envelope-at-fill me-3 fs-4"></i>
              <input
                className="form-control border-0 mb-2"
                type="email"
                name="email"
                autoComplete="off"
                value={signupform.email || ""}
                onChange={handleTextChange}
                placeholder="Email-id"
                required
              />
            </div>
            {emailError && (
              <div className="ms-5 text-danger">
                <em>{emailError}</em>
              </div>
            )}
            {message === "Email already exists!" && !emailError && (
              <div className="ms-5 text-danger">
                <em>{message}</em>
              </div>
            )}
          </div>

          <div className="pb-1 mb-3">
            <div className="d-flex align-items-center border-bottom">
              <i className="bi bi-telephone-fill me-3 fs-4"></i>
              <input
                className="form-control border-0 mb-2"
                type="tel"
                name="phone"
                autoComplete="off"
                value={signupform.phone || ""}
                onChange={handleTextChange}
                placeholder="Mobile number"
                required
              />
            </div>
            {phoneError && (
              <div className="ms-5 text-danger">
                <em>{phoneError}</em>
              </div>
            )}
            {message === "Phone already exists!" && (
              <div className="ms-5 text-danger">
                <em>{message}</em>
              </div>
            )}
          </div>

          <div className="mb-4 d-flex ps-5 ms-4 align-items-center me-1 fw-bold flex-wrap">
            <label className="m-1">
              Gender :
              <input
                onChange={handleTextChange}
                className="m-1"
                type="radio"
                name="gender"
                value="Male"
                checked={signupform.gender === "Male"}
                required
              />{" "}
              Male
            </label>
            <label className="m-1">
              <input
                onChange={handleTextChange}
                className="m-1"
                type="radio"
                name="gender"
                value="Female"
                checked={signupform.gender === "Female"}
              />{" "}
              Female
            </label>
            <label className="m-1">
              <input
                onChange={handleTextChange}
                className="m-1"
                type="radio"
                name="gender"
                value="Other"
                checked={signupform.gender === "Other"}
              />{" "}
              Other
            </label>
          </div>

          <div className="text-center">
            <input
              type="submit"
              value="Signup"
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
            Already have an account?{" "}
            <button
              type="button"
              className="btn btn-link p-0 text-primary fw-bold"
              onClick={handleButtonLogin}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
