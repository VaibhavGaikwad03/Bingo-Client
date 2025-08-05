import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Profileedit from "./Profileedit"; // Profileedit is not used in the provided JSX
// import Chatpage from "./Chatpage"; // Chatpage is not used in the provided JSX

export default function Profile(props) {
  let { userProfileInfo } = props;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullname: userProfileInfo.fullname || "",
    username: userProfileInfo.username || "",
    dob: userProfileInfo.dob || "",
    gender: userProfileInfo.gender || "",
    email: userProfileInfo.email || "",
    phone: userProfileInfo.phone || "",
  });

  useEffect(() => {
    setFormData({
      fullname: userProfileInfo.fullname || "",
      username: userProfileInfo.username || "",
      dob: userProfileInfo.dob || "",
      gender: userProfileInfo.gender || "",
      email: userProfileInfo.email || "",
      phone: userProfileInfo.phone || "",
    });
  }, [userProfileInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saved:", formData);
    setIsEditing(false);
  };

  return (
    <div>
      <div
        className="profile-page" // Add this class to your CSS for base styling
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
                fontSize: "2rem",
                cursor: "pointer",
                position: "absolute",
                top: "10px",
                left: "10px",
                fontSize: "1.8rem",
              }}
              onClick={() => navigate("/chatpage")}
              title="Back"
            ></div>
          )}

          <div
            className="bi bi-pencil-square"
            style={{
              fontSize: "2rem",
              cursor: "pointer",
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "1.8rem",
            }}
            onClick={() => setIsEditing(true)}
            title="Edit"
          ></div>
        </div>

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
          className="form-wrapper" // Add a class for your form wrapper
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
              className="form-control" // Use Bootstrap's form-control class
              disabled={!isEditing}
            />
          </label>

          <label className="form-label-custom">
            Username
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control" // Use Bootstrap's form-control class
              disabled={!isEditing}
            />
          </label>

          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <label className="form-label-custom" style={{ flex: 1 }}>
              DOB
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="form-control" // Use Bootstrap's form-control class
                disabled={!isEditing}
              />
            </label>

            <label className="form-label-custom" style={{ flex: 1 }}>
              Gender
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select" // Use Bootstrap's form-select class
                  style={{ appearance: "none", WebkitAppearance: "none", MozAppearance: "none" }}
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
                  className="form-control bg-light-grey" // Use Bootstrap and your custom bg-light-grey for disabled state
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
              className="form-control" // Use Bootstrap's form-control class
            />
          </label>

          <label className="form-label-custom">
            Phone
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-control" // Use Bootstrap's form-control class
            />
          </label>

          {isEditing && (
            <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
              <button
                onClick={() => {
                  handleSave();
                  setIsEditing(false);
                }}
                className="btn btn-success" // Use Bootstrap's btn-success for Save
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-danger" // Use Bootstrap's btn-danger for Cancel
              >
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

// export default function Profile(props) {
//   let { userProfileInfo } = props;
//   const navigate = useNavigate();
//   const [isEditing, setIsEditing] = useState(false);

//   const [formData, setFormData] = useState({
//     fullname: userProfileInfo.fullname || "",
//     username: userProfileInfo.username || "",
//     dob: userProfileInfo.dob || "",
//     gender: userProfileInfo.gender || "",
//     email: userProfileInfo.email || "",
//     phone: userProfileInfo.phone || "",
//   });

//   useEffect(() => {
//     setFormData({
//       fullname: userProfileInfo.fullname || "",
//       username: userProfileInfo.username || "",
//       dob: userProfileInfo.dob || "",
//       gender: userProfileInfo.gender || "",
//       email: userProfileInfo.email || "",
//       phone: userProfileInfo.phone || "",
//     });
//   }, [userProfileInfo]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = () => {
//     console.log("Saved:", formData);
//     setIsEditing(false);
//   };

//   const pageStyle = {
//     width: "100vw",
//     minHeight: "100vh",
//     backgroundColor: "#fff",
//     padding: "20px",
//     boxSizing: "border-box",
//   };

//   const formWrapper = {
//     width: "400px",
//     margin: "0 auto",
//     display: "flex",
//     flexDirection: "column",
//     gap: "15px",
//     alignItems: "center",
//   };

//   const inputStyle = {
//     padding: "10px 12px",
//     border: "1px solid black",
//     borderRadius: "10px",
//     fontSize: "14px",
//     backgroundColor: "#fff",
//     color: "#000",
//     width: "100%",
//   };

//   const labelStyle = {
//     display: "flex",
//     flexDirection: "column",
//     fontSize: "13px",
//     color: "#000",
//     width: "100%",
//   };

//   const btn = {
//     padding: "8px 20px",
//     borderRadius: "8px",
//     border: "1px solid",
//     fontWeight: "bold",
//     cursor: "pointer",
//   };

//   return (
//     <div>
//       <div className="profile-page" style={pageStyle}>
//         <div
//           style={{
//             width: "100%",
//             margin: "0 auto",
//             position: "relative", // ✅ for positioning child icons
//             padding: "10px",
//           }}
//         >
//           {!isEditing && (
//             <div
//               className="bi bi-arrow-left-circle"
//               style={{
//                 fontSize: "2rem",
//                 cursor: "pointer",
//                 position: "absolute",
//                 top: "10px",
//                 left: "10px",
//                 fontSize: "1.8rem",
//               }}
//               onClick={() => navigate("/chatpage")}
//               // onClick={() => setIsEditing(false)}
//               title="Back"
//             ></div>
//           )}

//           <div
//             className="bi bi-pencil-square"
//             style={{
//               fontSize: "2rem",
//               cursor: "pointer",
//               position: "absolute",
//               top: "10px",
//               right: "10px",
//               fontSize: "1.8rem",
//             }}
//             // onClick={() => setProfileView("profile_edit")}
//             onClick={() => setIsEditing(true)}
//             title="Edit"
//           ></div>
//         </div>

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

//         <div style={formWrapper}>
//           <label style={labelStyle}>
//             Name
//             <input
//               type="text"
//               name="fullname"
//               value={formData.fullname}
//               onChange={handleChange}
//               style={inputStyle}
//               disabled={!isEditing}
//             />
//           </label>

//           <label style={labelStyle}>
//             Username
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               style={inputStyle}
//               disabled={!isEditing}
//             />
//           </label>

//           <div style={{ display: "flex", gap: "10px", width: "100%" }}>
//             <label style={{ ...labelStyle, flex: 1 }}>
//               DOB
//               <input
//                 type="date"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 style={inputStyle}
//                 disabled={!isEditing}
//               />
//             </label>

//             <label style={{ ...labelStyle, flex: 1 }}>
//               Gender
//               {isEditing ? (
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   style={{
//                     ...inputStyle,
//                     appearance: "none", // optional: removes default arrow styles
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
//                   style={{ ...inputStyle, backgroundColor: "#f0f0f0" }}
//                 />
//               )}
//             </label>
//           </div>

//           <label style={labelStyle}>
//             Email
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               disabled={!isEditing}
//               style={inputStyle}
//             />
//           </label>

//           <label style={labelStyle}>
//             Phone
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               disabled={!isEditing}
//               style={inputStyle}
//             />
//           </label>

//           {isEditing && (
//             <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
//               <button
//                 onClick={() => {
//                   handleSave(), setIsEditing(false);
//                 }}
//                 style={{
//                   ...btn,
//                   backgroundColor: "#b5f5b5",
//                   borderColor: "green",
//                   color: "green",
//                 }}
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 style={{
//                   ...btn,
//                   backgroundColor: "#ffd4d4",
//                   borderColor: "red",
//                   color: "red",
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }











// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import Profileedit from "./Profileedit";

// // export default function Profile(props) {
// //   let { userProfileInfo } = props;
// //   let [profileView, setProfileView] = useState("profile");
// //   const navigate = useNavigate();

// //   return (
// //     <>
// //       {profileView == "profile" && (
// //         <>
// //           <div
// //             className="profile-page"
// //             style={{
// //               width: "100vw",
// //               height: "100vh",
// //               backgroundColor: "white",
// //               padding: "20px",
// //               boxSizing: "border-box",
// //             }}
// //           >
// //             <div
// //               style={{
// //                 display: "flex",
// //                 justifyContent: "space-between",
// //                 alignItems: "center",
// //                 marginBottom: "20px",
// //               }}
// //             >
// //               <div
// //                 className="bi bi-arrow-left-circle"
// //                 style={{ fontSize: "2rem", cursor: "pointer" }}
// //                 onClick={() => navigate("/chatpage")}
// //               ></div>

// //               <div
// //                 className="bi bi-pencil-square"
// //                 style={{ fontSize: "2rem", cursor: "pointer" }}
// //                 onClick={() => setProfileView("profile_edit")}
// //               ></div>
// //             </div>

// //             <div style={{ textAlign: "center", marginBottom: "20px" }}>
// //               <img
// //                 className="circular-image"
// //                 src="/images/icons/user.png"
// //                 alt="Profile"
// //                 style={{
// //                   width: "150px",
// //                   height: "150px",
// //                   borderRadius: "50%",
// //                   objectFit: "cover",
// //                 }}
// //               />
// //             </div>

// //             <div style={{ textAlign: "center", marginBottom: "10px" }}>
// //               <h4>Username</h4>
// //               <div
// //                 style={{
// //                   display: "inline-block",
// //                   padding: "5px 15px",
// //                   border: "1px solid black",
// //                   width: "250px",
// //                   textAlign: "center",
// //                 }}
// //               >
// //                 {userProfileInfo.username}
// //               </div>
// //             </div>

// //             <div style={{ textAlign: "center", marginBottom: "10px" }}>
// //               <h4>Name</h4>
// //               <div
// //                 style={{
// //                   display: "inline-block",
// //                   padding: "5px 15px",
// //                   border: "1px solid black",
// //                   width: "250px",
// //                   textAlign: "center",
// //                 }}
// //               >
// //                 {userProfileInfo.fullname}
// //               </div>
// //             </div>

// //             <div
// //               style={{
// //                 display: "flex",
// //                 justifyContent: "center",
// //                 gap: "20px",
// //                 marginBottom: "20px",
// //               }}
// //             >
// //               <div style={{ textAlign: "center" }}>
// //                 <h4>DOB</h4>
// //                 <div
// //                   style={{
// //                     padding: "5px 10px",
// //                     border: "1px solid black",
// //                     width: "100px",
// //                   }}
// //                 >
// //                   {userProfileInfo.dob || "N/A"}
// //                 </div>
// //               </div>
// //               <div style={{ textAlign: "center" }}>
// //                 <h4>Gender</h4>
// //                 <div
// //                   style={{
// //                     padding: "5px 10px",
// //                     border: "1px solid black",
// //                     width: "100px",
// //                   }}
// //                 >
// //                   {userProfileInfo.gender || "N/A"}
// //                 </div>
// //               </div>
// //             </div>

// //             <div style={{ textAlign: "center", marginTop: "20px" }}>
// //               <h4>Bio</h4>
// //               <div
// //                 style={{
// //                   display: "inline-block",
// //                   padding: "5px 15px",
// //                   border: "1px solid black",
// //                   maxWidth: "80%",
// //                 }}
// //               >
// //                 {userProfileInfo.bio || "No bio added yet."}
// //               </div>
// //             </div>
// //           </div>
// //         </>
// //       )}
// //       {
// //         profileView == "profile_edit" && (
// //           <Profileedit userProfileInfo={userProfileInfo}
// //           setProfileView = {setProfileView}
// //           />
// //         )
// //       }
// //     </>
// //   );
// // }
