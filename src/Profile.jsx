import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./css/CustomDatePicker.css";
import {
  validateName,
  validateUsername,
  validatePhone,
  validateDOB,
  validateEmail,
} from "./js_files/Validations";
import { useTranslation } from "react-i18next";
import { MessageTypes } from "./js_files/Status_MessageTypes";
import { toast } from "react-toastify";
import "./css/Profile.css";
import { useIsMobile } from "./hooks/use-mobile";
import ProfilePhoto from "./ProfilePhoto";
import { useRef } from "react";

export default function Profile(props) {
  const {
    navigate,
    userProfileInfo,
    // eslint-disable-next-line no-unused-vars
    currentUserId,
    socket,
    message,
    setMessage,
    setShowImageModal,
    showImageModal,
  } = props;

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const { t } = useTranslation();
  const isMobile = useIsMobile(); // Use the hook

  const [profileImage, setProfileImage] = useState(
    userProfileInfo.profileImage || "/images/good_baby_pfp.jpeg"
  );

  const [formData, setFormData] = useState({
    fullname: userProfileInfo.fullname || "",
    username: userProfileInfo.username || "",
    dob: userProfileInfo.dob || "",
    gender: userProfileInfo.gender || "",
    email: userProfileInfo.email || "",
    phone: userProfileInfo.phone || "",
  });

  // References for file inputs or camera
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [showDesktopCamera, setShowDesktopCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  const modalImageName = formData.fullname;
  const modalImageSrc = profileImage;

  //delete if other is working
  // useEffect(() => {
  //   if (userProfileInfo.fullname) {
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
  //   }
  // }, [userProfileInfo]);

  useEffect(() => {
    if (!userProfileInfo) return;
    const { fullname, username, dob, gender, email, phone } = userProfileInfo;
    setFormData({ fullname, username, dob, gender, email, phone });
    setSelectedDate(dob ? new Date(dob) : null);
    setProfileImage(
      userProfileInfo.profileImage || "/images/good_baby_pfp.jpeg"
    );
  }, [userProfileInfo]);

  function handleChange(e) {
    clearMessage();
    const { name, value } = e.target;
    let error = "";
    let validValue = value;

    switch (name) {
      case "fullname": {
        const { value: v, error: e } = validateName(value);
        validValue = v;
        error = e;
        break;
      }
      case "username": {
        const { newValue, error: e } = validateUsername(value);
        validValue = newValue;
        error = e;
        break;
      }
      case "email": {
        const { error: e } = validateEmail(value);
        error = e;
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
          message_type: MessageTypes.UPDATE_PROFILE_REQUEST, // Use a constant for message type
          ...formData,
        };
        socket.send(JSON.stringify(updateData));
        console.log("Sent update request:", updateData);
        toast.success("Profile update request sent to the server ");
        setIsEditing(false);
      } else {
        toast.error("Unable to connect to the server ❌");
      }
    } else {
      toast.warning("Please correct the errors before saving ⚠️");
    }
  };

  function clearMessage() {
    setMessage("");
  }

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setMessage("");
    const { fullname, username, dob, gender, email, phone } = userProfileInfo;
    setFormData({ fullname, username, dob, gender, email, phone });
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }
    setProfileImage(URL.createObjectURL(file));
  };

  const handleGallery = () => {
    galleryRef.current.click();
  };

  const openDesktopCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setCameraStream(stream);
      setShowDesktopCamera(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Camera access denied");
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setProfileImage(canvas.toDataURL("image/png"));
    stopCamera();
  };

  const stopCamera = () => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setShowDesktopCamera(false);
  };

  const handleCamera = () => {
    if (isMobile) {
      cameraRef.current.value = "";
      cameraRef.current.click(); // Mobile
    } else {
      openDesktopCamera(); // Desktop
    }
  };

  return (
    <div>
      <div className={`profile-page ${isMobile ? "mobile" : ""}`}>
        <div
          className={`container ${isMobile ? "mobile" : ""}`}
          style={{
            width: "100%",
            margin: "0 auto",
            position: "relative",
            padding: "10px",
          }}
        >
          {!isEditing && (
            <div
              className={`bi bi-arrow-left-circle back-arrow ${
                isMobile ? "mobile" : ""
              }`}
              onClick={() => navigate("/chatpage")}
              title="Back"
            ></div>
          )}
          <div
            className={`bi bi-pencil-square edit ${isMobile ? "mobile" : ""}`}
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
          <input
            type="file"
            accept="image/*"
            ref={galleryRef}
            onChange={handleImageChange}
            hidden
          />

          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraRef}
            onChange={handleImageChange}
            hidden
          />
          <img
            src={profileImage}
            alt="Profile"
            className={`profile-image ${isMobile ? "mobile" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (isEditing) {
                const modal = new window.bootstrap.Modal(
                  document.getElementById("photoModal")
                );
                modal.show();
              } else {
                setShowImageModal(true);
              }
            }}
          />
          {showDesktopCamera && (
            <div className="modal show d-block">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-3 text-center">
                  <h5>Take Photo</h5>

                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-100 rounded"
                  />

                  <canvas ref={canvasRef} hidden />

                  <div className="mt-3">
                    <button
                      className="btn btn-success me-2"
                      onClick={capturePhoto}
                    >
                      Capture
                    </button>
                    <button className="btn btn-danger" onClick={stopCamera}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="modal fade" id="photoModal">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content text-center p-3">
                <h5>Choose Photo</h5>

                <button
                  className="btn btn-outline-primary my-2"
                  onClick={() => {
                    const modal = window.bootstrap.Modal.getInstance(
                      document.getElementById("photoModal")
                    );
                    handleCamera();
                    modal.hide();
                  }}
                >
                  📷 Take Photo
                </button>

                <button
                  className="btn btn-outline-secondary my-2"
                  onClick={() => {
                    const modal = window.bootstrap.Modal.getInstance(
                      document.getElementById("photoModal")
                    );
                    handleGallery();
                    modal.hide();
                  }}
                >
                  🖼️ Choose from Gallery
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`form-wrapper ${isMobile ? "mobile" : ""}`}>
          {/* Name fields row - becomes vertical on mobile */}
          <div className={`name-fields-row ${isMobile ? "mobile" : ""}`}>
            <label className="form-label-custom">
              <span className="inline-flex">
                Full Name <span className="required-star">*</span>
              </span>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-control"
                required
              />
              {errors.fullname && (
                <div className="text-danger">{errors.fullname}</div>
              )}
            </label>
          </div>

          {/* Rest of your form fields remain exactly the same */}
          <label className="form-label-custom">
            <span className="inline-flex">
              {t("username")}
              <span className="required-star">*</span>
            </span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              disabled={!isEditing}
              required
            />
            {errors.username && (
              <div className="text-danger">{errors.username}</div>
            )}
          </label>

          {/* DOB and Gender row - becomes vertical on mobile */}
          <div className={`dob-gender-row ${isMobile ? "mobile" : ""}`}>
            <label className="form-label-custom">
              <span className="inline-flex">
                {t("dob")}
                <span className="required-star">*</span>
              </span>
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
                  required
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
              {errors.dob && <div className="text-danger">{errors.dob}</div>}
            </label>

            <label className="form-label-custom">
              <span className="inline-flex">
                {t("gender")}
                <span className="required-star">*</span>
              </span>
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
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Female">{t("female")}</option>
                  <option value="Male">{t("male")}</option>
                  <option value="Other">{t("other")}</option>
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
              {errors.gender && (
                <div className="text-danger">{errors.gender}</div>
              )}
            </label>
          </div>

          <label className="form-label-custom">
            <span className="inline-flex">
              {t("email")}
              <span className="required-star">*</span>
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
              required
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </label>

          <label className="form-label-custom">
            <span className="inline-flex">
              {t("phone")}
              <span className="required-star">*</span>
            </span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control"
              required
            />
            {errors.phone && <div className="text-danger">{errors.phone}</div>}
          </label>

          {isEditing && (
            <div className={`button-row ${isMobile ? "mobile" : ""}`}>
              <button onClick={handleSave} className="btn btn-success">
                Save
              </button>
              <button onClick={handleCancel} className="btn btn-danger">
                {t("cancel")}
              </button>
            </div>
          )}

          {showImageModal && (
            <ProfilePhoto
              setShowImageModal={setShowImageModal}
              modalImageName={modalImageName}
              modalImageSrc={modalImageSrc}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./css/CustomDatePicker.css";
// import {
//   validateName,
//   validateUsername,
//   validatePhone,
//   validateDOB,
//   validateEmail,
// } from "./js_files/Validations";
// import { useTranslation } from "react-i18next";
// import { MessageTypes } from "./js_files/Status_MessageTypes";
// import { toast } from "react-toastify";
// import "./css/Profile.css";
// import { useIsMobile } from "./hooks/use-mobile";
// import ProfilePhoto from "./ProfilePhoto";
// import { useRef } from "react";

// export default function Profile(props) {
//   const {
//     navigate,
//     userProfileInfo,
//     currentUserId,
//     socket,
//     message,
//     setMessage,
//     setShowImageModal,
//     showImageModal,
//   } = props;
//   const [isEditing, setIsEditing] = useState(false);
//   const { t } = useTranslation();
//   const [errors, setErrors] = useState({});
//   const [selectedDate, setSelectedDate] = useState(null);
//   const isMobile = useIsMobile(); // Use the hook

//   const [profileImage, setProfileImage] = useState(
//     userProfileInfo.profileImage || "/images/good_baby_pfp.jpeg"
//   );

//   const fileInputRef = useRef(null);

//   const [formData, setFormData] = useState({
//     fullname: userProfileInfo.fullname || "",
//     username: userProfileInfo.username || "",
//     dob: userProfileInfo.dob || "",
//     gender: userProfileInfo.gender || "",
//     email: userProfileInfo.email || "",
//     phone: userProfileInfo.phone || "",
//   });

//   const modalImageName = formData.fullname;
//   const modalImageSrc = profileImage;

//   useEffect(() => {
//     if (userProfileInfo.fullname) {
//       setFormData({
//         fullname: userProfileInfo.fullname || "",
//         username: userProfileInfo.username || "",
//         dob: userProfileInfo.dob || "",
//         gender: userProfileInfo.gender || "",
//         email: userProfileInfo.email || "",
//         phone: userProfileInfo.phone || "",
//       });
//       if (userProfileInfo.dob) {
//         setSelectedDate(new Date(userProfileInfo.dob));
//       } else {
//         setSelectedDate(null);
//       }
//     }
//   }, [userProfileInfo]);

//   function handleChange(e) {
//     clearMessage();
//     const { name, value } = e.target;
//     let error = "";
//     let validValue = value;

//     switch (name) {
//       case "fullname": {
//         const { value: validatedValue, error: validationError } =
//           validateName(value);
//         validValue = validatedValue;
//         error = validationError;
//         break;
//       }
//       case "username": {
//         const { newValue, error: validationError } = validateUsername(value);
//         validValue = newValue;
//         error = validationError;
//         break;
//       }
//       case "email": {
//         const { error: validationError } = validateEmail(value);
//         error = validationError;
//         break;
//       }
//       case "phone": {
//         const cleaned = value.replace(/\D/g, "");
//         validValue = cleaned;
//         if (cleaned.length > 0 && cleaned.length !== 10) {
//           error = "Phone number must be exactly 10 digits.";
//         } else {
//           error = "";
//         }
//         break;
//       }
//       case "gender": {
//         validValue = value;
//         break;
//       }
//       default:
//         break;
//     }

//     setFormData((prev) => ({ ...prev, [name]: validValue }));
//     setErrors((prev) => ({ ...prev, [name]: error }));
//   }

//   const handleDateChange = (date) => {
//     clearMessage();
//     setSelectedDate(date);
//     const formattedDate = date ? formatDate(date) : "";
//     const { error } = validateDOB(formattedDate);
//     setFormData((prev) => ({ ...prev, dob: formattedDate }));
//     setErrors((prev) => ({ ...prev, dob: error }));
//   };

//   const validateFormOnSubmit = () => {
//     const newErrors = {};

//     const nameValidation = validateName(formData.fullname);
//     if (nameValidation.error) newErrors.fullname = nameValidation.error;

//     const usernameValidation = validateUsername(formData.username);
//     if (usernameValidation.error) newErrors.username = usernameValidation.error;

//     const phoneValidation = validatePhone(formData.phone);
//     if (phoneValidation.error) newErrors.phone = phoneValidation.error;

//     const dobValidation = validateDOB(formData.dob);
//     if (dobValidation.error) newErrors.dob = dobValidation.error;

//     const emailValidation = validateEmail(formData.email);
//     if (emailValidation.error) newErrors.email = emailValidation.error;

//     const hasGender = !!formData.gender;
//     if (!hasGender) {
//       setMessage("Please select a gender.");
//       return false;
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSave = () => {
//     clearMessage();
//     if (validateFormOnSubmit()) {
//       if (socket && socket.readyState === WebSocket.OPEN) {
//         const updateData = {
//           message_type: MessageTypes.UPDATE_PROFILE_REQUEST, // Use a constant for message type
//           user_id: currentUserId,
//           fullname: formData.fullname,
//           username: formData.username,
//           dob: formData.dob,
//           gender: formData.gender,
//           email: formData.email,
//           phone: formData.phone,
//         };
//         socket.send(JSON.stringify(updateData));
//         console.log("Sent update request:", updateData);
//         toast.success("Profile update request sent to the server ");
//         setIsEditing(false);
//       } else {
//         console.log("WebSocket not connected:", socket?.readyState);
//         toast.error("Unable to connect to the server ❌");
//       }
//     } else {
//       toast.warning("Please correct the errors before saving ⚠️");
//     }
//   };

//   function clearMessage() {
//     setMessage("");
//   }

//   const handleCancel = () => {
//     setIsEditing(false);
//     setErrors({});
//     setMessage("");
//     setFormData({
//       user_id: userProfileInfo.user_id || "",
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

//   const formatDate = (date) => {
//     if (!date) return "";
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select a valid image");
//       return;
//     }
//     const imageURL = URL.createObjectURL(file);
//     setProfileImage(imageURL);
//   };

//   return (
//     <div>
//       <div className={`profile-page ${isMobile ? "mobile" : ""}`}>
//         <div
//           className={`container ${isMobile ? "mobile" : ""}`}
//           style={{
//             width: "100%",
//             margin: "0 auto",
//             position: "relative",
//             padding: "10px",
//           }}
//         >
//           {!isEditing && (
//             <div
//               className={`bi bi-arrow-left-circle back-arrow ${
//                 isMobile ? "mobile" : ""
//               }`}
//               onClick={() => navigate("/chatpage")}
//               title="Back"
//             ></div>
//           )}
//           <div
//             className={`bi bi-pencil-square edit ${isMobile ? "mobile" : ""}`}
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
//           <input
//             type="file"
//             accept="image/*"
//             ref={fileInputRef}
//             style={{ display: "none" }}
//             onChange={handleImageChange}
//           />
//           <img
//             src={profileImage}
//             alt="Profile"
//             className={`profile-image ${isMobile ? "mobile" : ""}`}
//             style={{ cursor: "pointer" }}
//             onClick={() => {
//               if (isEditing) fileInputRef.current.click();
//               else setShowImageModal(true);
//             }}
//           />
//         </div>

//         <div className={`form-wrapper ${isMobile ? "mobile" : ""}`}>
//           {/* Name fields row - becomes vertical on mobile */}
//           <div className={`name-fields-row ${isMobile ? "mobile" : ""}`}>
//             <label className="form-label-custom">
//               <span className="inline-flex">
//                 Full Name <span className="required-star">*</span>
//               </span>
//               <input
//                 type="text"
//                 name="fullname"
//                 value={formData.fullname}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="form-control"
//                 required
//               />
//               {errors.fullname && (
//                 <div className="text-danger">{errors.fullname}</div>
//               )}
//             </label>
//           </div>

//           {/* Rest of your form fields remain exactly the same */}
//           <label className="form-label-custom">
//             <span className="inline-flex">
//               {t("username")}
//               <span className="required-star">*</span>
//             </span>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               className="form-control"
//               disabled={!isEditing}
//               required
//             />
//             {errors.username && (
//               <div className="text-danger">{errors.username}</div>
//             )}
//           </label>

//           {/* DOB and Gender row - becomes vertical on mobile */}
//           <div className={`dob-gender-row ${isMobile ? "mobile" : ""}`}>
//             <label className="form-label-custom">
//               <span className="inline-flex">
//                 {t("dob")}
//                 <span className="required-star">*</span>
//               </span>
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
//                   required
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
//               {errors.dob && <div className="text-danger">{errors.dob}</div>}
//             </label>

//             <label className="form-label-custom">
//               <span className="inline-flex">
//                 {t("gender")}
//                 <span className="required-star">*</span>
//               </span>
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
//                   required
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Female">{t("female")}</option>
//                   <option value="Male">{t("male")}</option>
//                   <option value="Other">{t("other")}</option>
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
//               {errors.gender && (
//                 <div className="text-danger">{errors.gender}</div>
//               )}
//             </label>
//           </div>

//           <label className="form-label-custom">
//             <span className="inline-flex">
//               {t("email")}
//               <span className="required-star">*</span>
//             </span>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               disabled={!isEditing}
//               className="form-control"
//               required
//             />
//             {errors.email && <div className="text-danger">{errors.email}</div>}
//           </label>

//           <label className="form-label-custom">
//             <span className="inline-flex">
//               {t("phone")}
//               <span className="required-star">*</span>
//             </span>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               disabled={!isEditing}
//               className="form-control"
//               required
//             />
//             {errors.phone && <div className="text-danger">{errors.phone}</div>}
//           </label>

//           {isEditing && (
//             <div className={`button-row ${isMobile ? "mobile" : ""}`}>
//               <button onClick={handleSave} className="btn btn-success">
//                 Save
//               </button>
//               <button onClick={handleCancel} className="btn btn-danger">
//                 {t("cancel")}
//               </button>
//             </div>
//           )}

//           {showImageModal && (
//             <ProfilePhoto
//               setShowImageModal={setShowImageModal}
//               modalImageName={modalImageName}
//               modalImageSrc={modalImageSrc}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
