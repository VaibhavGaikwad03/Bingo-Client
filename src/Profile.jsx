import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.css";
import {
  validateName,
  validateUsername,
  validatePhone,
  validateDOB,
  validateEmail,
} from "./Validations";

export default function Profile(props) {
  let { userProfileInfo, socket, timestamp } = props;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    fullname: userProfileInfo.fullname || "",
    username: userProfileInfo.username || "",
    dob: userProfileInfo.dob || "",
    gender: userProfileInfo.gender || "",
    email: userProfileInfo.email || "",
    phone: userProfileInfo.phone || "",
  });

  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setFormData({
      fullname: userProfileInfo.fullname || "",
      username: userProfileInfo.username || "",
      dob: userProfileInfo.dob || "",
      gender: userProfileInfo.gender || "",
      email: userProfileInfo.email || "",
      phone: userProfileInfo.phone || "",
    });
    if (userProfileInfo.dob) {
      setSelectedDate(new Date(userProfileInfo.dob));
    } else {
      setSelectedDate(null);
    }
  }, [userProfileInfo]);

  function clearMessage() {
    setMessage("");
  }

  function handleChange(e) {
    clearMessage();
    const { name, value } = e.target;
    let error = "";
    let validValue = value;

    switch (name) {
      case "fullname": {
        const { value: validatedValue, error: validationError } =
          validateName(value);
        validValue = validatedValue;
        error = validationError;
        break;
      }
      case "username": {
        const { newValue, error: validationError } = validateUsername(value);
        validValue = newValue;
        error = validationError;
        break;
      }
      case "email": {
        const { error: validationError } = validateEmail(value);
        error = validationError;
        break;
      }
      case "phone": {
        const cleaned = value.replace(/\D/g, "");
        validValue = cleaned;
        if (cleaned.length > 0 && cleaned.length !== 10) {
          error = "Phone number must be exactly 10 digits.";
        } else {
          error = "";
        }
        break;
      }
      case "gender": {
        validValue = value;
        break;
      }
      default:
        break;
    }

    setFormData((prev) => ({ ...prev, [name]: validValue }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  }

  const handleDateChange = (date) => {
    clearMessage();
    setSelectedDate(date);
    const formattedDate = date ? formatDate(date) : "";
    const { error } = validateDOB(formattedDate);
    setFormData((prev) => ({ ...prev, dob: formattedDate }));
    setErrors((prev) => ({ ...prev, dob: error }));
  };

  const validateFormOnSubmit = () => {
    const newErrors = {};

    const nameValidation = validateName(formData.fullname);
    if (nameValidation.error) newErrors.fullname = nameValidation.error;

    const usernameValidation = validateUsername(formData.username);
    if (usernameValidation.error) newErrors.username = usernameValidation.error;

    const phoneValidation = validatePhone(formData.phone);
    if (phoneValidation.error) newErrors.phone = phoneValidation.error;

    const dobValidation = validateDOB(formData.dob);
    if (dobValidation.error) newErrors.dob = dobValidation.error;

    const emailValidation = validateEmail(formData.email);
    if (emailValidation.error) newErrors.email = emailValidation.error;

    const hasGender = !!formData.gender;
    if (!hasGender) {
      setMessage("Please select a gender.");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    clearMessage();
    if (validateFormOnSubmit()) {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const updateData = {
          message_type: "UPDATE_PROFILE_REQUEST", // Use a constant for message type
          ...formData,
          timestamp,
        };
        socket.send(JSON.stringify(updateData));
        console.log("Sent update request:", updateData);
        setMessage("Profile update request sent to the server.");
        setIsEditing(false);
      } else {
        console.log("WebSocket not connected:", socket?.readyState);
        setMessage("❌ Unable to connect to the server.");
      }
    } else {
      setMessage("❌ Please correct the errors before saving.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setMessage("");
    setFormData({
      fullname: userProfileInfo.fullname || "",
      username: userProfileInfo.username || "",
      dob: userProfileInfo.dob || "",
      gender: userProfileInfo.gender || "",
      email: userProfileInfo.email || "",
      phone: userProfileInfo.phone || "",
    });
    if (userProfileInfo.dob) {
      setSelectedDate(new Date(userProfileInfo.dob));
    } else {
      setSelectedDate(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <div
        className="profile-page"
        style={{
          width: "100vw",
          minHeight: "100vh",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            margin: "0 auto",
            position: "relative",
            padding: "10px",
          }}
        >
          {!isEditing && (
            <div
              className="bi bi-arrow-left-circle"
              style={{
                fontSize: "1.8rem",
                cursor: "pointer",
                position: "absolute",
                top: "10px",
                left: "10px",
              }}
              onClick={() => navigate("/chatpage")}
              title="Back"
            ></div>
          )}
          <div
            className="bi bi-pencil-square"
            style={{
              fontSize: "1.8rem",
              cursor: "pointer",
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
            onClick={() => setIsEditing(true)}
            title="Edit"
          ></div>
        </div>

        {message && (
          <div className="text-center mb-4 text-danger">
            <em>{message}</em>
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src="/images/good_baby_pfp.jpeg"
            alt="Profile"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>

        <div
          className="form-wrapper"
          style={{
            width: "400px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <label className="form-label-custom">
            Name
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="form-control"
              disabled={!isEditing}
            />
            {errors.fullname && (
              <div className="text-danger">{errors.fullname}</div>
            )}{" "}
          </label>

          <label className="form-label-custom">
            Username
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              disabled={!isEditing}
            />
            {errors.username && (
              <div className="text-danger">{errors.username}</div>
            )}{" "}
          </label>

          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <label className="form-label-custom" style={{ flex: 1 }}>
              DOB
              {isEditing ? (
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  placeholderText="Date of Birth"
                  className="form-control w-100"
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                />
              ) : (
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}
                  readOnly
                  className="form-control bg-light-grey"
                />
              )}
              {errors.dob && <div className="text-danger">{errors.dob}</div>}{" "}
            </label>

            <label className="form-label-custom" style={{ flex: 1 }}>
              Gender
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select"
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                  }}
                >
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  readOnly
                  className="form-control bg-light-grey"
                />
              )}
            </label>
          </div>

          <label className="form-label-custom">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}{" "}
          </label>

          <label className="form-label-custom">
            Phone
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
            />
            {errors.phone && <div className="text-danger">{errors.phone}</div>}
          </label>

          {isEditing && (
            <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
              <button onClick={handleSave} className="btn btn-success">
                Save
              </button>
              <button onClick={handleCancel} className="btn btn-danger">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}











// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./CustomDatePicker.css";
// import {
//   validateName,
//   validateUsername,
//   validatePhone,
//   validateDOB,
//   validateEmail,
// } from "./Validations";

// export default function Profile(props) {
//   let { userProfileInfo } = props;
//   const navigate = useNavigate();
//   const [isEditing, setIsEditing] = useState(false);

//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");

//   const [formData, setFormData] = useState({
//     fullname: userProfileInfo.fullname || "",
//     username: userProfileInfo.username || "",
//     dob: userProfileInfo.dob || "",
//     gender: userProfileInfo.gender || "",
//     email: userProfileInfo.email || "",
//     phone: userProfileInfo.phone || "",
//   });

//   // New state to manage the Date object for the DatePicker
//   const [selectedDate, setSelectedDate] = useState(null);

//   useEffect(() => {
//     setFormData({
//       fullname: userProfileInfo.fullname || "",
//       username: userProfileInfo.username || "",
//       dob: userProfileInfo.dob || "",
//       gender: userProfileInfo.gender || "",
//       email: userProfileInfo.email || "",
//       phone: userProfileInfo.phone || "",
//     });
//     // Set the selectedDate state based on userProfileInfo.dob
//     if (userProfileInfo.dob) {
//       setSelectedDate(new Date(userProfileInfo.dob));
//     } else {
//       setSelectedDate(null);
//     }
//   }, [userProfileInfo]);

//   function clearMessage() {
//     setMessage("");
//   }

//   function handleChange(e) {
//     clearMessage();
//     const { name, value } = e.target;
//     let error = "";
//     let validValue = value;

//     if (name === "fullname") {
//       const result = validateName(value);
//       error = result.error;
//       validValue = result.value;
//     } else if (name === "email") {
//       const result = validateEmail(value);
//       error = result.error;
//       validValue = result.value;
//     } else if (name === "phone") {
//       const cleaned = value.replace(/\D/g, "");
//       if (cleaned.length > 0 && cleaned.length !== 10) {
//         error = "Phone number must be exactly 10 digits.";
//       }
//       validValue = cleaned;
//     } else if (name === "dob") {
//       // The handleChange function will not be used for the DatePicker,
//       // so this block is not strictly needed for the DatePicker itself,
//       // but it's good to keep it consistent.
//       const result = validateDOB(value);
//       error = result.error;
//       validValue = result.value;
//     } else if (name === "username") {
//       const result = validateUsername(value);
//       error = result.error;
//       validValue = result.newValue;
//     }

//     setFormData((prev) => ({ ...prev, [name]: validValue }));
//     setErrors((prev) => ({ ...prev, [name]: error }));
//   }

//   // New function to handle date changes from the DatePicker
//   const handleDateChange = (date) => {
//     clearMessage();
//     setSelectedDate(date);
//     const formattedDate = date ? formatDate(date) : "";
//     const dobValidation = validateDOB(formattedDate);
//     setFormData((prev) => ({ ...prev, dob: formattedDate }));
//     setErrors((prev) => ({ ...prev, dob: dobValidation.error }));
//   };

//   const validateFormOnSubmit = () => {
//     const newErrors = {};
//     const nameValidation = validateName(formData.fullname);

//     if (!nameValidation.isValid) newErrors.fullname = nameValidation.error;
//     const usernameValidation = validateUsername(formData.username);

//     if (usernameValidation.error) newErrors.username = usernameValidation.error;

//     const phoneValidation = validatePhone(formData.phone);
//     if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error;

//     const dobValidation = validateDOB(formData.dob);
//     if (!dobValidation.isValid) newErrors.dob = dobValidation.error;

//     const emailValidation = validateEmail(formData.email);
//     if (!emailValidation.isValid) newErrors.email = emailValidation.error;

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSave = () => {
//     clearMessage();
//     if (validateFormOnSubmit()) {
//       console.log("Saved:", formData);
//       setIsEditing(false);
//       setMessage("Profile updated successfully!");
//     } else {
//       setMessage("❌ Please correct the errors before saving.");
//     }
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setErrors({});
//     setMessage("");
//     setFormData({
//       fullname: userProfileInfo.fullname || "",
//       username: userProfileInfo.username || "",
//       dob: userProfileInfo.dob || "",
//       gender: userProfileInfo.gender || "",
//       email: userProfileInfo.email || "",
//       phone: userProfileInfo.phone || "",
//     });
//     if (userProfileInfo.dob) {
//       setSelectedDate(new Date(userProfileInfo.dob));
//     } else {
//       setSelectedDate(null);
//     }
//   };

//   // Helper function to format the date in 'YYYY-MM-DD' format
//   const formatDate = (date) => {
//     if (!date) return "";
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   return (
//     <div>
//       <div
//         className="profile-page"
//         style={{
//           width: "100vw",
//           minHeight: "100vh",
//           padding: "20px",
//           boxSizing: "border-box",
//         }}
//       >
//         <div
//           style={{
//             width: "100%",
//             margin: "0 auto",
//             position: "relative",
//             padding: "10px",
//           }}
//         >
//           {!isEditing && (
//             <div
//               className="bi bi-arrow-left-circle"
//               style={{
//                 fontSize: "1.8rem",
//                 cursor: "pointer",
//                 position: "absolute",
//                 top: "10px",
//                 left: "10px",
//               }}
//               onClick={() => navigate("/chatpage")}
//               title="Back"
//             ></div>
//           )}
//           <div
//             className="bi bi-pencil-square"
//             style={{
//               fontSize: "1.8rem",
//               cursor: "pointer",
//               position: "absolute",
//               top: "10px",
//               right: "10px",
//             }}
//             onClick={() => setIsEditing(true)}
//             title="Edit"
//           ></div>
//         </div>

//         {message && (
//           <div className="text-center mb-4 text-danger">
//             <em>{message}</em>
//           </div>
//         )}

//         <div style={{ textAlign: "center", marginBottom: "20px" }}>
//           <img
//             src="/images/good_baby_pfp.jpeg"
//             alt="Profile"
//             style={{
//               width: "150px",
//               height: "150px",
//               borderRadius: "50%",
//               objectFit: "cover",
//             }}
//           />
//         </div>

//         <div
//           className="form-wrapper"
//           style={{
//             width: "400px",
//             margin: "0 auto",
//             display: "flex",
//             flexDirection: "column",
//             gap: "15px",
//             alignItems: "center",
//           }}
//         >
//           <label className="form-label-custom">
//             Name
//             <input
//               type="text"
//               name="fullname"
//               value={formData.fullname}
//               onChange={handleChange}
//               className="form-control"
//               disabled={!isEditing}
//             />
//             {errors.fullname && (
//               <div className="text-danger">{errors.fullname}</div>
//             )}{" "}
//           </label>

//           <label className="form-label-custom">
//             Username
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               className="form-control"
//               disabled={!isEditing}
//             />
//             {errors.username && (
//               <div className="text-danger">{errors.username}</div>
//             )}{" "}
//           </label>

//           <div style={{ display: "flex", gap: "10px", width: "100%" }}>
//             <label className="form-label-custom" style={{ flex: 1 }}>
//               DOB
//               {isEditing ? (
//                 <DatePicker
//                   selected={selectedDate}
//                   onChange={handleDateChange}
//                   onKeyDown={(e) => {
//                     e.preventDefault();
//                   }}
//                   placeholderText="Date of Birth"
//                   className="form-control w-100"
//                   dateFormat="yyyy-MM-dd"
//                   maxDate={new Date()}
//                   showMonthDropdown
//                   showYearDropdown
//                   scrollableYearDropdown
//                   yearDropdownItemNumber={100}
//                 />
//               ) : (
//                 <input
//                   type="text"
//                   name="dob"
//                   value={formData.dob}
//                   readOnly
//                   className="form-control bg-light-grey"
//                 />
//               )}
//               {errors.dob && <div className="text-danger">{errors.dob}</div>}{" "}
//             </label>

//             <label className="form-label-custom" style={{ flex: 1 }}>
//               Gender
//               {isEditing ? (
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   className="form-select"
//                   style={{
//                     appearance: "none",
//                     WebkitAppearance: "none",
//                     MozAppearance: "none",
//                   }}
//                 >
//                   <option value="">Select</option>
//                   <option value="Female">Female</option>
//                   <option value="Male">Male</option>
//                   <option value="Other">Other</option>
//                 </select>
//               ) : (
//                 <input
//                   type="text"
//                   name="gender"
//                   value={formData.gender}
//                   readOnly
//                   className="form-control bg-light-grey"
//                 />
//               )}
//             </label>
//           </div>

//           <label className="form-label-custom">
//             Email
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               disabled={!isEditing}
//               className="form-control"
//             />
//             {errors.email && <div className="text-danger">{errors.email}</div>}{" "}
//           </label>

//           <label className="form-label-custom">
//             Phone
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               disabled={!isEditing}
//               className="form-control"
//             />
//             {errors.phone && <div className="text-danger">{errors.phone}</div>}
//           </label>

//           {isEditing && (
//             <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
//               <button onClick={handleSave} className="btn btn-success">
//                 Save
//               </button>
//               <button onClick={handleCancel} className="btn btn-danger">
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }










//mostrecent working code

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./CustomDatePicker.css";
// import {
//   validateName,
//   validateUsername,
//   validatePhone,
//   validateDOB,
//   validateEmail,
// } from "./Validations";

// export default function Profile(props) {
//   let { userProfileInfo } = props;
//   const navigate = useNavigate();
//   const [isEditing, setIsEditing] = useState(false);

//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");

//   const [formData, setFormData] = useState({
//     fullname: userProfileInfo.fullname || "",
//     username: userProfileInfo.username || "",
//     dob: userProfileInfo.dob || "",
//     gender: userProfileInfo.gender || "",
//     email: userProfileInfo.email || "",
//     phone: userProfileInfo.phone || "",
//   });

//   // New state to manage the Date object for the DatePicker
//   const [selectedDate, setSelectedDate] = useState(null);

//   useEffect(() => {
//     setFormData({
//       fullname: userProfileInfo.fullname || "",
//       username: userProfileInfo.username || "",
//       dob: userProfileInfo.dob || "",
//       gender: userProfileInfo.gender || "",
//       email: userProfileInfo.email || "",
//       phone: userProfileInfo.phone || "",
//     });
//     // Set the selectedDate state based on userProfileInfo.dob
//     if (userProfileInfo.dob) {
//       setSelectedDate(new Date(userProfileInfo.dob));
//     } else {
//       setSelectedDate(null);
//     }
//   }, [userProfileInfo]);

//   function clearMessage() {
//     setMessage("");
//   }

//   function handleChange(e) {
//     clearMessage();
//     const { name, value } = e.target;
//     let error = "";
//     let validValue = value;

//     if (name === "fullname") {
//       const result = validateName(value);
//       error = result.error;
//       validValue = result.value;
//     } else if (name === "email") {
//       const result = validateEmail(value);
//       error = result.error;
//       validValue = result.value;
//     } else if (name === "phone") {
//       const cleaned = value.replace(/\D/g, "");
//       if (cleaned.length > 0 && cleaned.length !== 10) {
//         error = "Phone number must be exactly 10 digits.";
//       }
//       validValue = cleaned;
//     } else if (name === "dob") {
//       // The handleChange function will not be used for the DatePicker,
//       // so this block is not strictly needed for the DatePicker itself,
//       // but it's good to keep it consistent.
//       const result = validateDOB(value);
//       error = result.error;
//       validValue = result.value;
//     } else if (name === "username") {
//       const result = validateUsername(value);
//       error = result.error;
//       validValue = result.newValue;
//     }

//     setFormData((prev) => ({ ...prev, [name]: validValue }));
//     setErrors((prev) => ({ ...prev, [name]: error }));
//   }

//   // New function to handle date changes from the DatePicker
//   const handleDateChange = (date) => {
//     clearMessage();
//     setSelectedDate(date);
//     const formattedDate = date ? formatDate(date) : "";
//     const dobValidation = validateDOB(formattedDate);
//     setFormData((prev) => ({ ...prev, dob: formattedDate }));
//     setErrors((prev) => ({ ...prev, dob: dobValidation.error }));
//   };

//   const validateFormOnSubmit = () => {
//     const newErrors = {};
//     const nameValidation = validateName(formData.fullname);

//     if (!nameValidation.isValid) newErrors.fullname = nameValidation.error;
//     const usernameValidation = validateUsername(formData.username);

//     if (usernameValidation.error) newErrors.username = usernameValidation.error;

//     const phoneValidation = validatePhone(formData.phone);
//     if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error;

//     const dobValidation = validateDOB(formData.dob);
//     if (!dobValidation.isValid) newErrors.dob = dobValidation.error;

//     const emailValidation = validateEmail(formData.email);
//     if (!emailValidation.isValid) newErrors.email = emailValidation.error;

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSave = () => {
//     clearMessage();
//     if (validateFormOnSubmit()) {
//       console.log("Saved:", formData);
//       setIsEditing(false);
//       setMessage("Profile updated successfully!");
//     } else {
//       setMessage("❌ Please correct the errors before saving.");
//     }
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setErrors({});
//     setMessage("");
//     setFormData({
//       fullname: userProfileInfo.fullname || "",
//       username: userProfileInfo.username || "",
//       dob: userProfileInfo.dob || "",
//       gender: userProfileInfo.gender || "",
//       email: userProfileInfo.email || "",
//       phone: userProfileInfo.phone || "",
//     });
//     if (userProfileInfo.dob) {
//       setSelectedDate(new Date(userProfileInfo.dob));
//     } else {
//       setSelectedDate(null);
//     }
//   };

//   // Helper function to format the date in 'YYYY-MM-DD' format
//   const formatDate = (date) => {
//     if (!date) return "";
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   return (
//     <div>
//       <div
//         className="profile-page"
//         style={{
//           width: "100vw",
//           minHeight: "100vh",
//           padding: "20px",
//           boxSizing: "border-box",
//         }}
//       >
//         <div
//           style={{
//             width: "100%",
//             margin: "0 auto",
//             position: "relative",
//             padding: "10px",
//           }}
//         >
//           {!isEditing && (
//             <div
//               className="bi bi-arrow-left-circle"
//               style={{
//                 fontSize: "1.8rem",
//                 cursor: "pointer",
//                 position: "absolute",
//                 top: "10px",
//                 left: "10px",
//               }}
//               onClick={() => navigate("/chatpage")}
//               title="Back"
//             ></div>
//           )}
//           <div
//             className="bi bi-pencil-square"
//             style={{
//               fontSize: "1.8rem",
//               cursor: "pointer",
//               position: "absolute",
//               top: "10px",
//               right: "10px",
//             }}
//             onClick={() => setIsEditing(true)}
//             title="Edit"
//           ></div>
//         </div>

//         {message && (
//           <div className="text-center mb-4 text-danger">
//             <em>{message}</em>
//           </div>
//         )}

//         <div style={{ textAlign: "center", marginBottom: "20px" }}>
//           <img
//             src="/images/good_baby_pfp.jpeg"
//             alt="Profile"
//             style={{
//               width: "150px",
//               height: "150px",
//               borderRadius: "50%",
//               objectFit: "cover",
//             }}
//           />
//         </div>

//         <div
//           className="form-wrapper"
//           style={{
//             width: "400px",
//             margin: "0 auto",
//             display: "flex",
//             flexDirection: "column",
//             gap: "15px",
//             alignItems: "center",
//           }}
//         >
//           <label className="form-label-custom">
//             Name
//             <input
//               type="text"
//               name="fullname"
//               value={formData.fullname}
//               onChange={handleChange}
//               className="form-control"
//               disabled={!isEditing}
//             />
//             {errors.fullname && (
//               <div className="text-danger">{errors.fullname}</div>
//             )}{" "}
//           </label>

//           <label className="form-label-custom">
//             Username
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               className="form-control"
//               disabled={!isEditing}
//             />
//             {errors.username && (
//               <div className="text-danger">{errors.username}</div>
//             )}{" "}
//           </label>

//           <div style={{ display: "flex", gap: "10px", width: "100%" }}>
//             <label className="form-label-custom" style={{ flex: 1 }}>
//               DOB
//               {isEditing ? (
//                 <DatePicker
//                   selected={selectedDate}
//                   onChange={handleDateChange}
//                   onKeyDown={(e) => {
//                     e.preventDefault();
//                   }}
//                   placeholderText="Date of Birth"
//                   className="form-control w-100"
//                   dateFormat="yyyy-MM-dd"
//                   maxDate={new Date()}
//                   showMonthDropdown
//                   showYearDropdown
//                   scrollableYearDropdown
//                   yearDropdownItemNumber={100}
//                 />
//               ) : (
//                 <input
//                   type="text"
//                   name="dob"
//                   value={formData.dob}
//                   readOnly
//                   className="form-control bg-light-grey"
//                 />
//               )}
//               {errors.dob && <div className="text-danger">{errors.dob}</div>}{" "}
//             </label>

//             <label className="form-label-custom" style={{ flex: 1 }}>
//               Gender
//               {isEditing ? (
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   className="form-select"
//                   style={{
//                     appearance: "none",
//                     WebkitAppearance: "none",
//                     MozAppearance: "none",
//                   }}
//                 >
//                   <option value="">Select</option>
//                   <option value="Female">Female</option>
//                   <option value="Male">Male</option>
//                   <option value="Other">Other</option>
//                 </select>
//               ) : (
//                 <input
//                   type="text"
//                   name="gender"
//                   value={formData.gender}
//                   readOnly
//                   className="form-control bg-light-grey"
//                 />
//               )}
//             </label>
//           </div>

//           <label className="form-label-custom">
//             Email
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               disabled={!isEditing}
//               className="form-control"
//             />
//             {errors.email && <div className="text-danger">{errors.email}</div>}{" "}
//           </label>

//           <label className="form-label-custom">
//             Phone
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               disabled={!isEditing}
//               className="form-control"
//             />
//             {errors.phone && <div className="text-danger">{errors.phone}</div>}
//           </label>

//           {isEditing && (
//             <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
//               <button onClick={handleSave} className="btn btn-success">
//                 Save
//               </button>
//               <button onClick={handleCancel} className="btn btn-danger">
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }







