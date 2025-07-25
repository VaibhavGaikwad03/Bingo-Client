import { useState } from "react";

export default function ChangePassword({ currentUser, onclose }) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const isFormFilled = oldPass !== "" && newPass !== "" && confirmPass !== "";

  const isValidPassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasNoSpaces = !/\s/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasNoSpaces && hasSpecialChar;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parseUser = currentUser;

    // if (oldPass !== parseUser.password) {
    //   setError("❌ Old password is incorrect.");
    //   setSuccess("");
    //   return;
    // }

    if (!isValidPassword(newPass)) {
      setError(
        "❌ Password must be at least 8 characters, contain a special character, and have no spaces."
      );
      setSuccess("");
      return;
    }

    if (newPass !== confirmPass) {
      setError("❌ Passwords do not match.");
      setSuccess("");
      return;
    }

    setSuccess("✅ Password updated successfully.");
    setError("");
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
  };

  return (
    <div
      className="position-fixed"
      style={{
        top: 0,
        left: "300px",
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <div
        className="bg-white p-4 shadow rounded-4 border"
        style={{
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h4 className="mb-3 text-center">Change Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative">
            <label className="form-label fw-bold">Old Password</label>
            <input
              type={showOldPass ? "text" : "password"}
              className="form-control"
              style={{ paddingRight: "40px" }}
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
            />
            <i
              className={`bi ${
                showOldPass ? "bi-eye" : "bi-eye-slash"
              } position-absolute end-0 me-3`}
              style={{
                right: "10px",
                cursor: "pointer",
                top: "75%",
                transform: "translateY(-50%)",
              }}
              onClick={() => setShowOldPass(!showOldPass)}
            ></i>
          </div>
          <div className="mb-3 position-relative">
            <label className="form-label fw-bold">New Password</label>
            <input
              type={showNewPass ? "text" : "password"}
              className="form-control"
              style={{ paddingRight: "40px" }}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <i
              className={`bi ${
                showNewPass ? "bi-eye" : "bi-eye-slash"
              } position-absolute end-0 me-3`}
              style={{
                right: "10px",
                cursor: "pointer",
                top: "75%",
                transform: "translateY(-50%)",
              }}
              onClick={() => setShowNewPass(!showNewPass)}
            ></i>
          </div>
          <div className="mb-3 position-relative">
            <label className="form-label fw-bold">Confirm Password</label>
            <input
              type={showConfirmPass ? "text" : "password"}
              className="form-control"
              style={{ paddingRight: "40px" }}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <i
              className={`bi ${
                showConfirmPass ? "bi-eye" : "bi-eye-slash"
              } position-absolute end-0 me-3`}
              style={{
                right: "10px",
                cursor: "pointer",
                top: "75%",
                transform: "translateY(-50%)",
              }}
              onClick={() => setShowConfirmPass(!showConfirmPass)}
            ></i>
          </div>

          {error && <div className="text-danger mb-2">{error}</div>}
          {success && <div className="text-success mb-2">{success}</div>}

          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4 me-2" disabled={!isFormFilled}>
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary px-4"
              onClick={onclose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}










// import { useState } from "react";

// export default function ChangePassword({ currentUser,onclose }) {
//   const [oldPass, setOldPass] = useState("");
//   const [newPass, setNewPass] = useState("");
//   const [confirmPass, setConfirmPass] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const parseUser = currentUser;

//     // if (oldPass !== parseUser.password) {
//     //   setError("❌ Old password is incorrect.");
//     //   setSuccess("");
//     //   return;
//     // }

//     if (newPass.length < 4) {
//       setError("❌ New password must be at least 4 characters.");
//       setSuccess("");
//       return;
//     }

//     if (newPass !== confirmPass) {
//       setError("❌ Passwords do not match.");
//       setSuccess("");
//       return;
//     }

//     setSuccess("✅ Password updated successfully.");
//     setError("");
//     setOldPass("");
//     setNewPass("");
//     setConfirmPass("");
//   };

//   return (
//     <div
//       className="position-fixed"
//       style={{
//         top: 0,
//         left: "300px", 
//         right: 0,
//         bottom: 0,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "#f8f9fa",
//         padding: "20px",
//         zIndex: 1000,
//       }}
//     >
//       <div
//         className="bg-white p-4 shadow rounded-4 border"
//         style={{
//           width: "100%",
//           maxWidth: "500px",
//         }}
//       >
//         <h4 className="mb-3 text-center">Change Password</h4>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label fw-bold">Old Password</label>
//             <input
//               type="password"
//               className="form-control"
//               value={oldPass}
//               onChange={(e) => setOldPass(e.target.value)}
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label fw-bold">New Password</label>
//             <input
//               type="password"
//               className="form-control"
//               value={newPass}
//               onChange={(e) => setNewPass(e.target.value)}
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label fw-bold">Confirm Password</label>
//             <input
//               type="password"
//               className="form-control"
//               value={confirmPass}
//               onChange={(e) => setConfirmPass(e.target.value)}
//             />
//           </div>

//           {error && <div className="text-danger mb-2">{error}</div>}
//           {success && <div className="text-success mb-2">{success}</div>}

//           <div className="text-center">
//             <button type="submit" className="btn btn-primary px-4 me-2">
//               Submit
//             </button>
//             <button type="button" className="btn btn-secondary px-4" onClick={onclose}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

















// // / import { useState } from "react";

// // export default function ChangePassword({ currentUser }) {
// //   const [oldPass, setOldPass] = useState("");
// //   const [newPass, setNewPass] = useState("");
// //   const [confirmPass, setConfirmPass] = useState("");
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     const parseUser = currentUser;

// //     if (oldPass !== parseUser.password) {
// //       setError("❌ Old password is incorrect.");
// //       setSuccess("");
// //       return;
// //     }

// //     if (newPass.length < 4) {
// //       setError("❌ New password must be at least 4 characters.");
// //       setSuccess("");
// //       return;
// //     }

// //     if (newPass !== confirmPass) {
// //       setError("❌ Passwords do not match.");
// //       setSuccess("");
// //       return;
// //     }

// //     setSuccess("✅ Password updated successfully.");
// //     setError("");
// //     setOldPass("");
// //     setNewPass("");
// //     setConfirmPass("");
// //   };

// //   return (
// //     <div
// //       className="position-fixed"
// //       style={{
// //         top: 0,
// //         left: "300px", 
// //         right: 0,
// //         bottom: 0,
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         backgroundColor: "#f8f9fa",
// //         padding: "20px",
// //         zIndex: 1000,
// //       }}
// //     >
// //       <div
// //         className="bg-white p-4 shadow rounded-4 border"
// //         style={{
// //           width: "100%",
// //           maxWidth: "500px",
// //         }}
// //       >
// //         <h4 className="mb-3 text-center">Change Password</h4>
// //         <form onSubmit={handleSubmit}>
// //           <div className="mb-3">
// //             <label className="form-label fw-bold">Old Password</label>
// //             <input
// //               type="password"
// //               className="form-control"
// //               value={oldPass}
// //               onChange={(e) => setOldPass(e.target.value)}
// //             />
// //           </div>
// //           <div className="mb-3">
// //             <label className="form-label fw-bold">New Password</label>
// //             <input
// //               type="password"
// //               className="form-control"
// //               value={newPass}
// //               onChange={(e) => setNewPass(e.target.value)}
// //             />
// //           </div>
// //           <div className="mb-3">
// //             <label className="form-label fw-bold">Confirm Password</label>
// //             <input
// //               type="password"
// //               className="form-control"
// //               value={confirmPass}
// //               onChange={(e) => setConfirmPass(e.target.value)}
// //             />
// //           </div>

// //           {error && <div className="text-danger mb-2">{error}</div>}
// //           {success && <div className="text-success mb-2">{success}</div>}

// //           <div className="text-center">
// //             <button type="submit" className="btn btn-primary px-4 me-2">
// //               Submit
// //             </button>
// //             <button type="button" className="btn btn-secondary px-4">
// //               Cancel
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

