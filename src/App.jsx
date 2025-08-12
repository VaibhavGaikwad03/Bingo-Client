import "./App.css";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Homepage from "./Homepage.jsx";
import Login from "./Login";
import Signup from "./Signup";
import Chatpage from "./Chatpage.jsx";
import { useEffect, useState, useRef } from "react";
import { Status, MessageTypes } from "./Status_MessageTypes";
import {
  LoginErrorCodes,
  SignupErrorCodes,
  ChangePasswordErrorCodes,
} from "./ErrorCodes";
import AboutUs from "./AboutUs.jsx";
import Profile from "./Profile.jsx";
import Settings from "./Settings.jsx";
import CustomAlertModal from "./CustomAlertModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RequireAuth({ isAuth, children }) {
  return isAuth ? children : <Navigate to="/login" replace />;
}

function App() {
  const newSocket = useRef(null);

  const [socket, setSocket] = useState(null);

  const [currentUserId, setCurrentUserId] = useState(
    () => parseInt(sessionStorage.getItem("currentUserId"),10) || -1
  );
  const [currentUsername, setCurrentUsername] = useState(
    () => sessionStorage.getItem("currentUsername") || ""
  );
  const [currentNameOfUser, setCurrentNameOfUser] = useState(
    sessionStorage.getItem("currentNameOfUser") || ""
  );

  const [socketMessage, setSocketMessage] = useState("");
  // let [friendRequest, setFriendRequest] = useState([]);

  let [friendRequest, setFriendRequest] = useState(() => {
    const storedFriendRequest = sessionStorage.getItem("friendRequest");
    return storedFriendRequest ? JSON.parse(storedFriendRequest) : [];
  });

  const [message, setMessage] = useState("");

  // const [isAuth, setIsAuth] = useState(false);
  const [isAuth, setIsAuth] = useState(
    () => sessionStorage.getItem("isAuth") === "true"
  );

  // const [userProfileInfo, setUserProfileInfo] = useState({});
  const [userProfileInfo, setUserProfileInfo] = useState(() => {
    const storedUserProfileInfo = sessionStorage.getItem("userProfileInfo");
    return storedUserProfileInfo ? JSON.parse(storedUserProfileInfo) : {};
  });

  let [suggestions, setSuggestions] = useState([]);

  const [showAlertErrorModal, setShowAlertErrorModal] = useState(false);
  const [modalAlertErrorMessage, setModalAlerErrorMessage] = useState("");
  // const [isAuth, setIsAuth] = useState(sessionStorage.getItem("isAuth") === "true");        change it later

  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem("theme") || "light";
  });
  
  useEffect(() => {
    document.body.className = theme; 
    sessionStorage.setItem("theme", theme); 
  }, [theme]); 

  const navigate = useNavigate();
  const timestamp = new Date().toISOString();

  function clearMessage() {
    setTimeout(() => setMessage(""), 2000);
  }

  const handleCloseErrorModal = () => {
    setShowAlertErrorModal(false);
    setModalAlerErrorMessage("");
  };

  useEffect(() => {
    sessionStorage.setItem("currentUserId", currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    sessionStorage.setItem("currentUsername", currentUsername);
  }, [currentUsername]);

  useEffect(() => {
    sessionStorage.setItem("currentNameOfUser", currentNameOfUser);
  }, [currentNameOfUser]);

  // useEffect(() => {
  //   sessionStorage.setItem("userProfileInfo", userProfileInfo);
  // }, [userProfileInfo]);

  // useEffect(() => {
  //   sessionStorage.setItem("friendRequest", friendRequest);
  // }, [friendRequest]);
  useEffect(() => {
    sessionStorage.setItem("userProfileInfo", JSON.stringify(userProfileInfo));
  }, [userProfileInfo]);

  useEffect(() => {
    sessionStorage.setItem("friendRequest", JSON.stringify(friendRequest));
  }, [friendRequest]);



  useEffect(() => {
    console.log("in useEffect");
    // newSocket.current = new WebSocket("https://2fb35f9bd8fd.ngrok-free.app/");
    newSocket.current = new WebSocket("ws://localhost:2121");
    console.log("in useeffect ");

    newSocket.current.onopen = () => {
      setSocketMessage("Connected!");
      console.log("Connected to server");
    };

    newSocket.current.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      console.log("Received from Server:", parsedData);

      switch (parsedData.message_type) {
        case MessageTypes.LOGIN_RESPONSE:
          {
            if (parsedData.status === Status.SUCCESS) {
              console.log("Received from Server:", parsedData);
              setCurrentUserId(parsedData.user_id);
              setMessage("Login Successfull");
              setIsAuth(true);
              sessionStorage.setItem("isAuth", "true");
              // setTheme("dark");
              // setRequestingUser(parsedData);
              // sessionStorage.setItem("isAuth", "true");      //we will change it later
              clearMessage();
              navigate("/chatpage");
            } else if (parsedData.status === Status.ERROR) {
              if (
                parsedData.error_code === LoginErrorCodes.USERNAME_NOT_FOUND
              ) {
                setMessage("Username does not Exist");
              } else if (
                parsedData.error_code === LoginErrorCodes.PASSWORD_IS_INCORRECT
              ) {
                setMessage("Incorrect Password");
              }
              // clearMessage();
            }
          }
          break;

        case MessageTypes.SIGN_UP_RESPONSE:
          {
            if (parsedData.status === Status.SUCCESS) {
              setMessage("Signup Successfull");
              setTimeout(() => {
                navigate("/login");
                setMessage("");
              }, 2000);
            } else if (parsedData.status === Status.ERROR) {
              if (
                parsedData.error_code ===
                SignupErrorCodes.USERNAME_ALREADY_EXISTS
              ) {
                setMessage("Username already exists!");
              } else if (
                parsedData.error_code === SignupErrorCodes.EMAIL_ALREADY_EXISTS
              ) {
                setMessage("Email already exists!");
              } else if (
                parsedData.error_code === SignupErrorCodes.PHONE_ALREADY_EXISTS
              ) {
                setMessage("Phone already exists!");
              }
              // clearMessage();
            }
          }
          break;

        case MessageTypes.LOGOUT_RESPONSE:
          {
            console.log(parsedData, "Logout response");
            if (parsedData.status === Status.SUCCESS) {
              setCurrentUserId("");
              setCurrentUsername("");
              setCurrentNameOfUser("");
              setSocketMessage("");
              setFriendRequest([]);
              setMessage("");

              setIsAuth(false);
              sessionStorage.removeItem("isAuth");
              sessionStorage.removeItem("currentUserId");
              sessionStorage.removeItem("currentUsername");
              sessionStorage.removeItem("currentNameOfUser");
              sessionStorage.removeItem("friendRequest");
              sessionStorage.removeItem("userProfileInfo");

              setUserProfileInfo({});
              setSuggestions([]);
              setShowAlertErrorModal(false);
              setModalAlerErrorMessage("");
              setTheme("light");
              navigate("/");
            } else if (parsedData.status === Status.ERROR) {
              setModalAlerErrorMessage(
                "An error occurred while logging out. Please try again."
              );
              setShowAlertErrorModal(true);
            }
          }
          break;

        case MessageTypes.SEARCH_USER_RESPONSE:
          {
            //  parsedData.users.username[]
            console.log(parsedData);
            console.log(parsedData.users);
            setSuggestions(parsedData.users.slice(0, 30));
          }
          break;

        case MessageTypes.FRIEND_REQ_REQUEST:
          {
            console.log(parsedData, "friend req request");

            // setFriendRequest((prev) => {
            //   const isAlreadyThere = prev.some(
            //     (req) => req.sender_id === parsedData.sender_id
            //   );
            //   if (isAlreadyThere) return prev;
            //   return [...prev, parsedData];
            // });


            // setFriendRequest((prev) => [...prev, parsedData]);


            setFriendRequest((prev) => {
              const isAlreadyThere = prev.some(
                (req) => req.sender_id === parsedData.sender_id
              );
              if (isAlreadyThere) {
                console.log("Friend request already exists, not adding duplicate.");
                return prev; // Return the previous state without modification
              }
              // If not already there, add the new request by creating a new array
              return [...prev, parsedData];
            });
          }
          break;

        case MessageTypes.USER_PROFILE_INFORMATION:
          {
            console.log(parsedData, "user profile info");
            setCurrentNameOfUser(parsedData.fullname);
            setUserProfileInfo(parsedData);
          }
          break;

        case MessageTypes.USER_FRIENDS_LIST:
          {
            console.log(parsedData, "user friend list");
          }
          break;

        case MessageTypes.USER_PENDING_FRIEND_REQUESTS_LIST:
          {
            console.log(parsedData, "user pending friend reqs list");
            setFriendRequest(parsedData.pending_friend_requests_list);
          }
          break;

        case MessageTypes.USER_MESSAGE_HISTORY:
          {
            console.log(parsedData, "user msg history");
          }
          break;

        case MessageTypes.CHANGE_PASSWORD_RESPONSE:
          {
            console.log(parsedData, "Change password response");
            if (parsedData.status == Status.SUCCESS) {
              setMessage("Password changed successfully!");
            } else if (parsedData.status == Status.ERROR) {
              if (
                parsedData.error_code == ChangePasswordErrorCodes.NEW_PASSWORD_MUST_BE_DIFFERENT
              ) {
                setMessage("New Password must be Different!");
              }
            }
          }
          break;

        default:
          {
            console.log("Invalid Message Type");
          }
          break;
      }
    };

    newSocket.current.onclose = () => {
      setSocketMessage("Disconnected!");
      console.log("Connection closed");
    };

    newSocket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setSocketMessage("Disconnected!");
    };

    setSocket(newSocket.current);

    return () => {
      if (newSocket.current)
        newSocket.current.close();
    };
  }, []);

  // function handleSignupFormSubmit(signupform) {
  //   if (socket && socket.readyState === WebSocket.OPEN) {
  //     const signupData = {
  //       message_type: MessageTypes.SIGN_UP_REQUEST,
  //       ...signupform,
  //       timestamp,
  //     };
  //     socket.send(JSON.stringify(signupData));
  //   } else {
  //     console.log("WebSocket not connected:", socket?.readyState);
  //   }
  // }

  return (
    <>
      {socketMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            padding: "6px 12px",
            borderRadius: 30,
            background:
              socketMessage === "Connected!"
                ? "rgba(0, 255, 0, 0.15)"
                : "rgba(255, 0, 0, 0.15)",
            color: socketMessage === "Connected!" ? "#00FF00" : "#FF0000",
            fontWeight: 600,
            fontSize: "0.75rem",
            boxShadow: `0 0 6px ${
              socketMessage === "Connected!" ? "#00FF00" : "#FF0000"
            }`,
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <span style={{ fontSize: "0.65rem", marginRight: 6 }}>
            {socketMessage === "Connected!" ? "🟢" : "🔴"}
          </span>
          {socketMessage}
        </div>
      )}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/login"
          element={
            <Login
              setMessage={setMessage}
              message={message}
              setCurrentUsername={setCurrentUsername}
              socket={socket}
              timestamp={timestamp}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup
              // onSignupFormSubmit={handleSignupFormSubmit}
              message={message}
              setMessage={setMessage}
              socket={socket}
              timestamp={timestamp}
            />
          }
        />
        <Route
          path="/chatpage"
          element={
            <RequireAuth isAuth={isAuth}>
              <Chatpage
                socket={socket}
                friendRequest={friendRequest}
                currentNameOfUser={currentNameOfUser}
                setFriendRequest={setFriendRequest}
                setSuggestions={setSuggestions}
                currentUsername={currentUsername}
                suggestions={suggestions}
                currentUserId={currentUserId}
                timestamp={timestamp}
                message={message}
                setMessage={setMessage}
                theme={theme} setTheme={setTheme}
                // onLogoutButtonClick = {handleLogoutButtonClick}
              />
            </RequireAuth>
          }
        />
        <Route path="/about_us" element={<AboutUs />} />
        <Route
          path="/profile"
          element={
            <RequireAuth isAuth={isAuth}>
              <Profile userProfileInfo={userProfileInfo} />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth isAuth={isAuth}>
              <Settings theme={theme} setTheme={setTheme} />
            </RequireAuth>
          }
        />
      </Routes>

      {showAlertErrorModal && (
        <CustomAlertModal
          title="Logout Error"
          message={modalAlertErrorMessage}
          onClose={handleCloseErrorModal}
        />
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}
export default App;
