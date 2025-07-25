import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.css";
import { useNavigate } from "react-router-dom";
import { MessageTypes } from "./Status_MessageTypes";

export default function Signup(props) {
  const { message, setMessage , socket , timestamp } = props;
  const [signupform, setSignupform] = useState({});
  const [usernameError, setUsernameError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const isValidPassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasNoSpaces = !/\s/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasNoSpaces && hasSpecialChar;
  };

  function handleButtonCancel() {
    navigate("/");
  }

  function clearMessage() {
    setMessage("");
  }

  function handleButtonLogin() {
    navigate("/login");
  }

  function handleSignupFormSubmit(event) {
    event.preventDefault();
    if (!isValidPassword(signupform.password || "")) {
      setMessage(
        "❌ Password must be at least 8 characters, contain a special character, and have no spaces."
      );
      return;
    }
    console.log(signupform);
    if (socket && socket.readyState === WebSocket.OPEN) {
      const signupData = {
        message_type: MessageTypes.SIGN_UP_REQUEST,
        ...signupform,
        timestamp,
      };
      socket.send(JSON.stringify(signupData));
    } else {
      console.log("WebSocket not connected:", socket?.readyState);
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

      setSignupform({ ...signupform, [name]: newValue });
      setUsernameError(error);
    } else {
      setSignupform({ ...signupform, [name]: inputValue });
    }
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
        {/* <div className="text-center mb-4">
          <em>{message === "Signup Successfull" ? message : null}</em>
        </div> */}
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

          <div className="mb-4 d-flex align-items-center border-bottom pb-2">
            <i className="bi bi-lock-fill me-3 fs-4"></i>
            <input
              className="form-control border-0"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="off"
              onChange={handleTextChange}
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

          <div className="mb-4 d-flex align-items-center border-bottom pb-2">
            <i className="bi bi-person-vcard-fill me-3 fs-4"></i>
            <input
              className="form-control border-0"
              type="text"
              name="fullname"
              autoComplete="off"
              onChange={handleTextChange}
              placeholder="Enter your Full name"
              required
            />
          </div>

          <div className="mb-4 d-flex align-items-center border-bottom pb-2">
            <i className="bi bi-calendar-date me-3 fs-4"></i>
            <DatePicker
              selected={signupform.dob ? new Date(signupform.dob) : null}
              onChange={(date) => {
                if (date) {
                  handleTextChange("dob", formatDate(date));
                }
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

          <div className="pb-1 mb-3">
            <div className="d-flex align-items-center border-bottom">
              <i className="bi bi-envelope-at-fill me-3 fs-4"></i>
              <input
                className="form-control border-0 mb-2"
                type="email"
                name="email"
                autoComplete="off"
                onChange={handleTextChange}
                placeholder="Email-id"
                required
              />
            </div>
            {message === "Email already exists!" && (
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
                pattern="[0-9]{10}"
                maxLength="10"
                onChange={handleTextChange}
                placeholder="Mobile number"
                required
              />
            </div>
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





// import { useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./CustomDatePicker.css";
// import { useNavigate } from "react-router-dom";

// export default function Signup(props) {
//   const { message, setMessage } = props;
//   const [signupform, setSignupform] = useState({});
//   const [usernameError, setUsernameError] = useState("");
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

//   function handleButtonCancel() {
//     navigate("/");
//   }

//   function clearMessage() {
//     setMessage("");
//   }

//   function handleButtonLogin() {
//     navigate("/login");
//   }

//   function handleSignupFormSubmit(event) {
//     event.preventDefault();
//     console.log(signupform);
//     props.onSignupFormSubmit(signupform);
//   }

//   function formatDate(date) {
//     if (!date) return "";
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   }

//   function handleTextChange(eventOrName, value) {
//     let name, inputValue;
//     clearMessage();
//     if (typeof eventOrName === "object" && eventOrName.target) {
//       name = eventOrName.target.name;
//       inputValue = eventOrName.target.value;
//     } else {
//       name = eventOrName;
//       inputValue = value;
//     }

//     if (name === "username") {
//       let newValue = "";
//       let error = "";

//       for (let i = 0; i < inputValue.length; i++) {
//         let char = inputValue[i];

//         if (char >= "A" && char <= "Z") {
//           char = char.toLowerCase();
//         }

//         if (
//           (char >= "a" && char <= "z") ||
//           (char >= "0" && char <= "9") ||
//           char === "_"
//         ) {
//           if (i === 0 && !/[a-z_]/.test(char)) {
//             error = "First character must be a lowercase letter or underscore.";
//             break;
//           }
//           newValue += char;
//         } else {
//           error = `Character "${inputValue[i]}" is not allowed.`;
//           break;
//         }
//       }

//       setSignupform({ ...signupform, [name]: newValue });
//       setUsernameError(error);
//     } else {
//       setSignupform({ ...signupform, [name]: inputValue });
//     }
//   }

//   return (
//     <div
//       className="d-flex flex-column justify-content-center align-items-center"
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh",
//         background:
//           "linear-gradient(to right, #ffdee9, #ff87a2, #7fa9c9, #4ca1af)",
//         margin: 0,
//         overflow: "auto",
//       }}
//     >
//       <div className="mb-3">
//         <img
//           className="img-fluid mt-3"
//           src="./images/BingoLogo.png"
//           alt="chatlogo"
//           style={{
//             maxHeight: "120px",
//             filter: "drop-shadow(0 0 15px #ff00ff)",
//             animation: "floatLogo 4s ease-in-out infinite",
//           }}
//         />
//       </div>

//       <div
//         className="p-4 form-container"
//         style={{
//           width: "90%",
//           maxWidth: "500px",
//           backgroundColor: "rgba(255, 255, 255, 0.1)",
//           borderRadius: "15px",
//           boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
//           backdropFilter: "blur(8px)",
//           border: "1px solid rgba(255, 255, 255, 0.18)",
//         }}
//       >
//         <h3 className="text-center text-primary mb-4">SIGNUP</h3>
//         <div className="text-center mb-4">
//           <em>{message === "Signup Successfull" ? message : null}</em>
//         </div>

//         <form onSubmit={handleSignupFormSubmit}>
//           <div className="pb-1 mb-3">
//             <div className="d-flex align-items-center border-bottom">
//               <i className="bi bi-person-circle me-3 fs-4"></i>
//               <input
//                 className="form-control border-0 mb-2"
//                 type="text"
//                 name="username"
//                 autoComplete="off"
//                 value={signupform.username || ""}
//                 onChange={handleTextChange}
//                 placeholder="Username"
//                 required
//               />
//             </div>
//             {usernameError && (
//               <div className="ms-5 text-danger">
//                 <em>{usernameError}</em>
//               </div>
//             )}
//             {message === "Username already exists!" && !usernameError && (
//               <div className="ms-5 text-danger">
//                 <em>{message}</em>
//               </div>
//             )}
//           </div>

//           <div className="mb-4 d-flex align-items-center border-bottom pb-2">
//             <i className="bi bi-lock-fill me-3 fs-4"></i>
//             <input
//               className="form-control border-0"
//               type={showPassword ? "text" : "password"}
//               name="password"
//               autoComplete="off"
//               onChange={handleTextChange}
//               placeholder="Password"
//               required
//             />
//             <i
//               className={`bi ${
//                 showPassword ? "bi-eye" : "bi-eye-slash"
//               } position-absolute end-0 me-5`}
//               style={{
//                 cursor: "pointer",
//               }}
//               onClick={() => setShowPassword(!showPassword)}
//             ></i>
//           </div>

//           <div className="mb-4 d-flex align-items-center border-bottom pb-2">
//             <i className="bi bi-person-vcard-fill me-3 fs-4"></i>
//             <input
//               className="form-control border-0"
//               type="text"
//               name="fullname"
//               autoComplete="off"
//               onChange={handleTextChange}
//               placeholder="Enter your Full name"
//               required
//             />
//           </div>

//           <div className="mb-4 d-flex align-items-center border-bottom pb-2">
//             <i className="bi bi-calendar-date me-3 fs-4"></i>
//             <DatePicker
//               selected={signupform.dob ? new Date(signupform.dob) : null}
//               onChange={(date) => {
//                 if (date) {
//                   handleTextChange("dob", formatDate(date));
//                 }
//               }}
//               placeholderText="Select your Date of Birth"
//               className="form-control border-0 w-100"
//               calendarClassName="custom-calendar"
//               dateFormat="yyyy-MM-dd"
//               maxDate={new Date()}
//               showMonthDropdown
//               showYearDropdown
//               scrollableYearDropdown
//               yearDropdownItemNumber={100}
//               required
//             />
//           </div>

//           <div className="pb-1 mb-3">
//             <div className="d-flex align-items-center border-bottom">
//               <i className="bi bi-envelope-at-fill me-3 fs-4"></i>
//               <input
//                 className="form-control border-0 mb-2"
//                 type="email"
//                 name="email"
//                 autoComplete="off"
//                 onChange={handleTextChange}
//                 placeholder="Email-id"
//                 required
//               />
//             </div>
//             {message === "Email already exists!" && (
//               <div className="ms-5 text-danger">
//                 <em>{message}</em>
//               </div>
//             )}
//           </div>

//           <div className="pb-1 mb-3">
//             <div className="d-flex align-items-center border-bottom">
//               <i className="bi bi-telephone-fill me-3 fs-4"></i>
//               <input
//                 className="form-control border-0 mb-2"
//                 type="tel"
//                 name="phone"
//                 autoComplete="off"
//                 pattern="[0-9]{10}"
//                 maxLength="10"
//                 onChange={handleTextChange}
//                 placeholder="Mobile number"
//                 required
//               />
//             </div>
//             {message === "Phone already exists!" && (
//               <div className="ms-5 text-danger">
//                 <em>{message}</em>
//               </div>
//             )}
//           </div>

//           <div className="mb-4 d-flex ps-5 ms-4 align-items-center me-1 fw-bold flex-wrap">
//             <label className="m-1">
//               Gender :
//               <input
//                 onChange={handleTextChange}
//                 className="m-1"
//                 type="radio"
//                 name="gender"
//                 value="Male"
//                 required
//               />{" "}
//               Male
//             </label>
//             <label className="m-1">
//               <input
//                 onChange={handleTextChange}
//                 className="m-1"
//                 type="radio"
//                 name="gender"
//                 value="Female"
//               />{" "}
//               Female
//             </label>
//             <label className="m-1">
//               <input
//                 onChange={handleTextChange}
//                 className="m-1"
//                 type="radio"
//                 name="gender"
//                 value="Other"
//               />{" "}
//               Other
//             </label>
//           </div>

//           <div className="text-center">
//             <input
//               type="submit"
//               value="Signup"
//               className="btn btn-success me-3"
//             />
//             <input
//               type="button"
//               value="Cancel"
//               className="btn btn-danger"
//               onClick={handleButtonCancel}
//             />
//           </div>

//           <div className="mt-3 text-center">
//             Already have an account?{" "}
//             <button
//               type="button"
//               className="btn btn-link p-0 text-primary fw-bold"
//               onClick={handleButtonLogin}
//             >
//               Login
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
