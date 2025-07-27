import { useState } from "react";
import ChangePassword from "./ChangePassword";
import Appearance from "./Appearance"

export default function Settings({ onClose, currentUser }) {
  const [setting, setSetting] = useState("");

  return (
    <>
      <div className="settings-sidebar">
        <div>
          <i className="bi bi-x-lg settings-close-icon" onClick={onClose}></i>
          <h5 className="mb-4 mt-2"></h5>

          <ul className="list-group list-group-flush">
            <li
              className="list-group-item"
              onClick={() => setSetting("change_password")}
            >
              Change Password
            </li>

            <li
              className="list-group-item"
              onClick={() => setSetting("appearance")}
            >
              Appearance
            </li>
            <li className="list-group-item">Option 2</li>
            <li className="list-group-item">Option 3</li>
          </ul>
        </div>
      </div>

      {setting === "change_password" && (
        <div className="change-password-overlay">
          <ChangePassword
            currentUser={currentUser}
            onclose={() => setSetting("")}
          />
        </div>
      )}

      {setting === "appearance" && (
        <div className="change-password-overlay">
          <Appearance
            currentUser={currentUser}
            onclose={() => setSetting("")}
          />
        </div>
      )}
    </>
  );
}

// import { useState } from "react";
// import ChangePassword from "./ChangePassword";

// export default function Settings({ onClose, currentUser }) {
//   const [setting, setSetting] = useState("");

//   return (
//     <>
//      <div className="settings-sidebar">
//         <div>
//           <i className="bi bi-x-lg settings-close-icon" onClick={onClose}></i>
//           <h5 className="mb-4 mt-2"></h5>

//           <ul className="list-group list-group-flush">
//             <li
//               className="list-group-item"
//               onClick={() => setSetting("change_password")}
//             >
//               Change Password
//             </li>

//             <li className="list-group-item">Option 1</li>
//             <li className="list-group-item">Option 2</li>
//             <li className="list-group-item">Option 3</li>
//           </ul>
//         </div>
//       </div>

//       {setting === "change_password" && (
//         <div className="change-password-overlay">
//           <ChangePassword currentUser={currentUser} onclose={() => setSetting("")} />
//         </div>
//       )}
//     </>
//   );
// }

// // import { useState } from "react";
// // import ChangePassword from "./ChangePassword";

// // export default function Settings({ onClose, currentUser }) {
// //   const [setting, setSetting] = useState("");

// //   return (
// //     <>
// //       <div className="settings-sidebar">
// //         <div>
// //           <i className="bi bi-x-lg settings-close-icon" onClick={onClose}></i>
// //           <h5 className="mb-4 mt-2"></h5>

// //           <ul className="list-group list-group-flush">
// //             <li
// //               className="list-group-item"
// //               onClick={() => setSetting("change_password")}
// //             >
// //               Change Password
// //             </li>

// //             <li className="list-group-item">Option 1</li>
// //             <li className="list-group-item">Option 2</li>
// //             <li className="list-group-item">Option 3</li>
// //           </ul>
// //         </div>
// //       </div>

// //       {setting === "change_password" && (
// //         <div className="change-password-overlay">
// //           <ChangePassword currentUser={currentUser} />
// //         </div>
// //       )}
// //     </>
// //   );
// // }
