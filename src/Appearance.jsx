import { useState } from "react";
import { X } from "lucide-react"; 

export default function Appearance({ currentUser, onclose }) {
  const [mode, setMode] = useState("");

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
        className="bg-white p-4 shadow rounded-4 border position-relative"
        style={{
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <button
          onClick={onclose}
          className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2"
        >
          ✕
        </button>

        <h5 className="mb-3 fw-bold text-center">Appearance Settings</h5>

        <form>
          <div className="mb-3">
            <label className="form-label fw-bold">Select Mode</label>
            <select
              className="form-select mt-1"
              name="mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="">-- Choose --</option>
              <option value="Dark">Dark Mode</option>
              <option value="Light">Light Mode</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
}























// // import { useState, useRef , useEffect } from "react";
// // // import { X , ChevronDown } from "lucide-react"; 

// // // export default function Appearance({ currentUser, onclose }) {
// // //   const [mode, setMode] = useState(() => {
// // //     const savedMode = localStorage.getItem('themeMode');
// // //     if (savedMode) {
// // //       return savedMode;
// // //     }
// // //     return 'system'; 
// // //   });

// // //   useEffect(() => {
// // //     const root = document.documentElement; 
    
// // //     // Function to apply the class based on a given theme
// // //     const applyThemeClass = (currentMode) => {
// // //       root.classList.remove('dark-mode', 'light-mode'); // Clear existing classes
// // //       if (currentMode === 'dark') {
// // //         root.classList.add('dark-mode');
// // //       } else if (currentMode === 'light') {
// // //         root.classList.add('light-mode');
// // //       } else { // 'system' mode
// // //         if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
// // //           root.classList.add('dark-mode');
// // //         } else {
// // //           root.classList.add('light-mode');
// // //         }
// // //       }
// // //     };

// // //     applyThemeClass(mode); // Apply theme on mode change

// // //     // Save the selected mode to localStorage
// // //     localStorage.setItem('themeMode', mode);

// // //   }, [mode]); // Re-run this effect whenever the 'mode' state changes

// // //   // Effect to listen for system theme changes (if 'system' mode is active)
// // //   useEffect(() => {
// // //     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
// // //     const handleSystemChange = (event) => {
// // //       if (mode === 'system') {
// // //         const root = document.documentElement;
// // //         root.classList.remove('dark-mode', 'light-mode');
// // //         if (event.matches) { // System switched to dark
// // //           root.classList.add('dark-mode');
// // //         } else { // System switched to light
// // //           root.classList.add('light-mode');
// // //         }
// // //       }
// // //     };

// // //     mediaQuery.addEventListener('change', handleSystemChange);

// // //     // Cleanup listener on component unmount
// // //     return () => {
// // //       mediaQuery.removeEventListener('change', handleSystemChange);
// // //     };
// // //   }, [mode]); // Re-run if 'mode' changes to/from 'system'

// // //   const handleModeChange = (e) => {
// // //     setMode(e.target.value);
// // //   };

// // //   return (
// // //     <div
// // //       className="position-fixed"
// // //       style={{
// // //         top: 0,
// // //         left: "300px", 
// // //         right: 0,
// // //         bottom: 0,
// // //         display: "flex",
// // //         alignItems: "center",
// // //         justifyContent: "center",
// // //         // Use a CSS variable for background color for theme consistency
// // //         backgroundColor: "var(--overlay-background-color)", 
// // //         padding: "20px",
// // //         zIndex: 1000,
// // //       }}
// // //     >
// // //       <div
// // //         className="p-4 shadow rounded-4 border position-relative"
// // //         style={{
// // //           width: "100%",
// // //           maxWidth: "400px",
// // //           // Use CSS variables for consistent theming
// // //           backgroundColor: "var(--modal-background-color)", 
// // //           color: "var(--text-color)",
// // //         }}
// // //       >
// // //         <button
// // //           onClick={onclose}
// // //           className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2"
// // //         >
// // //           <X size={18} /> {/* Using the Lucide-React X icon */}
// // //         </button>

// // //         <h5 className="mb-3 fw-bold text-center">Appearance Settings</h5>

// // //         <form>
// // //           <div className="mb-3">
// // //             <label className="form-label fw-bold">Select Mode</label>
// // //             <select
// // //               className="form-select mt-1"
// // //               name="mode"
// // //               value={mode}
// // //               onChange={handleModeChange}
// // //             >
// // //               <option value="system">System Default</option> {/* Added System option */}
// // //               <option value="light">Light Mode</option>
// // //               <option value="dark">Dark Mode</option>
// // //             </select>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }


















// // import { useState , useEffect } from "react";
// // import { X  } from "lucide-react"; 

// // export default function Appearance({ currentUser, onclose }) {
// //   const [mode, setMode] = useState("");

// //   useEffect(() => {
// //     const savedMode = localStorage.getItem("appMode");
// //     if (savedMode) {
// //       setMode(savedMode); 
// //       document.body.setAttribute("data-theme", savedMode.toLowerCase());
// //     }
// //   }, []);

// //   useEffect(() => {
// //     if (mode) {
// //       document.body.setAttribute("data-theme", mode.toLowerCase());
// //       localStorage.setItem("appMode", mode);
// //     }
// //   }, [mode]); 

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
// //         className="bg-white p-4 shadow rounded-4 border position-relative"
// //         style={{
// //           width: "100%",
// //           maxWidth: "400px",
// //         }}
// //       >
// //         <button
// //           onClick={onclose}
// //           className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2"
// //         >
// //           ✕
// //         </button>

// //         <h5 className="mb-3 fw-bold text-center">Appearance Settings</h5>

// //         <form>
// //           <div className="mb-3">
// //             <label className="form-label fw-bold">Select Mode</label>
// //             <select
// //               className="form-select mt-1"
// //               name="mode"
// //               value={mode}
// //               onChange={(e) => setMode(e.target.value)}
// //             >
// //               <option value="">-- Choose --</option>
// //               <option value="Dark">Dark Mode</option>
// //               <option value="Light">Light Mode</option>
// //             </select>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }















// import { useState, useEffect } from "react";
// import { X } from "lucide-react";

// export default function Appearance({ currentUser, onclose }) {
//   const [mode, setMode] = useState("");

//   useEffect(() => {
//     const savedMode = localStorage.getItem("appMode");
//     if (savedMode) {
//       setMode(savedMode);
//       document.body.setAttribute("data-theme", savedMode.toLowerCase());
//     }
//   }, []);

//   useEffect(() => {
//     if (mode) {
//       document.body.setAttribute("data-theme", mode.toLowerCase());
//       localStorage.setItem("appMode", mode);
//     }
//   }, [mode]);

//   return (
//     <div
//       className="position-fixed appearance-overlay" // Added a new class 'appearance-overlay'
//       style={{
//         top: 0,
//         left: "300px",
//         right: 0,
//         bottom: 0,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         // REMOVED: backgroundColor: "#f8f9fa", // This was making it always white
//         padding: "20px",
//         zIndex: 1000,
//       }}
//     >
//       <div
//         className="bg-white p-4 shadow rounded-4 border position-relative appearance-modal" // Added 'appearance-modal'
//         style={{
//           width: "100%",
//           maxWidth: "400px",
//         }}
//       >
//         <button
//           onClick={onclose}
//           className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2"
//         >
//           <X size={18} />
//         </button>

//         <h5 className="mb-3 fw-bold text-center">Appearance Settings</h5>

//         <form>
//           <div className="mb-3">
//             <label className="form-label fw-bold">Select Mode</label>
//             <select
//               className="form-select mt-1"
//               name="mode"
//               value={mode}
//               onChange={(e) => setMode(e.target.value)}
//             >
//               <option value="">-- Choose --</option>
//               <option value="Dark">Dark Mode</option>
//               <option value="Light">Light Mode</option>
//             </select>
//           </div>
//         </form>
//       </div>

//     </div>
//   );
// }