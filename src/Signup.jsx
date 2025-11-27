import React from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./css/CustomDatePicker.css";
import { MessageTypes } from "./js_files/Status_MessageTypes.js";
import {
  validateUsername,
  validatePassword,
  validateEmail,
  validatePhone,
  validateDOB,
} from "./js_files/Validations.js";
import "./css/Signup.css";

export default function Signup(props) {
  const {navigate, message, setMessage, socket, timestamp, isMobile } = props;

  const [signupform, setSignupform] = useState({});
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [dobError, setDobError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
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

  // validates, handles signupform and sends details to server
  function handleSignupFormSubmit(event) {
    event.preventDefault();
    clearMessage();

    const usernameValidation = validateUsername(signupform.username);
    const passwordValidation = validatePassword(signupform.password);

    const fullName = signupform.fullname || "";
    if (fullName.trim() === "") {
      setFullNameError("Full name is required.");
    } else {
      setFullNameError("");
    }

    const emailValidation = validateEmail(signupform.email);
    const phoneValidation = validatePhone(signupform.phone);
    const dobValidation = validateDOB(signupform.dob);

    setUsernameError(usernameValidation.error);
    setPasswordError(passwordValidation.error);
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
      fullName.trim() !== "" &&
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
        fullname: fullName.trim(),
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

    // Get input name and value - handles both event and manual call
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
          setFullNameError(inputValue.trim() === "" ? "Full name is required." : "");
          break;
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
      className="signup-outer d-flex flex-column justify-content-start align-items-center"
      style={{
        paddingTop: isMobile ? "env(safe-area-inset-top, 20px)" : "40px",
      }}
    >
      <div className="mb-3">
        <img
          className="img-fluid mt-3 floating-logo"
          src="./images/BingoLogo.png"
          alt="chatlogo"
          style={{
            maxHeight: isMobile ? "80px" : "120px",
            width: "auto",
          }}
        />
      </div>

      <div
        className="p-4 form-container"
        style={{
          width: isMobile ? "95%" : "90%",
          padding: isMobile ? "1rem" : "1.5rem",
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
              <i className="bi bi-person-circle fs-4"></i>
              <span className="required-star me-2">*</span>
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
              <i className="bi bi-lock-fill fs-4"></i>
              <span className="required-star me-2">*</span>
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
              <i className="bi bi-person-vcard-fill fs-4"></i>
              <span className="required-star me-2">*</span>

              <input
                type="text"
                name="fullname"
                className="form-control border-0"
                autoComplete="off"
                value={signupform.fullname || ""}
                onChange={handleTextChange}
                placeholder="Full Name"
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
              <i className="bi bi-calendar-date fs-4"></i>
              <span className="required-star me-2">*</span>
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
              <i className="bi bi-envelope-at-fill fs-4 "></i>
              <span className="required-star me-2">*</span>
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
              <i className="bi bi-telephone-fill fs-4"></i>
              <span className="required-star me-2">*</span>

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
              Gender :<span className="required-star me-2">*</span>
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

          <div
            className="text-center"
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "10px" : "0",
              justifyContent: "center",
            }}
          >
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
