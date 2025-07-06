import "./App.css";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Homepage from "./Homepage.jsx";
import Login from "./Login";
import Signup from "./Signup";
import Chatpage from "./Chatpage.jsx";
import { useEffect, useState, useRef } from "react";
import { Status, MessageTypes } from "./Status_MessageTypes";
import { LoginErrorCodes, SignupErrorCodes } from "./ErrorCodes";
import AboutUs from "./AboutUs.jsx";

function RequireAuth({ isAuth, children }) {
  return isAuth ? children : <Navigate to="/login" replace />;
}

function App() {
  const newSocket = useRef(null);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [socketMessage, setSocketMessage] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [requestingUser, setRequestingUser] = useState({});
  const [currentUserId , setCurrentUserId] = useState("");
  let [suggestions, setSuggestions] = useState([]);
  // const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") === "true");        change it later

  const navigate = useNavigate();
  const timestamp = new Date().toISOString();

  function clearMessage() 
  {
    setMessage("");
  }

  useEffect(() => {
    console.log("in useEffect");
    newSocket.current = new WebSocket(
      "ws://localhost:2121"
    );
    // newSocket.current = new WebSocket("ws://localhost:3001");
    console.log("in useeffect ");

    newSocket.current.onopen = () => {
      setSocketMessage("Connected!");
      console.log("Connected to server");
    };

    newSocket.current.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      console.log("Received from Server:", parsedData);
      // console.log(parsedData.users);

      if (parsedData.message_type === MessageTypes.LOGIN_RESPONSE) {
        if (parsedData.status === Status.SUCCESS) {
          console.log("Received from Server:", parsedData);
          setCurrentUserId(parsedData.user_id);
          setMessage("Login Successfull");
          setIsAuth(true);
          // setRequestingUser(parsedData);
          // localStorage.setItem("isAuth", "true");      //we will change it later
          //clearMessage();
          navigate("/chatpage");
        } else if (parsedData.status === Status.ERROR) {
          if (parsedData.error_code === LoginErrorCodes.USERNAME_NOT_FOUND) {
            setMessage("Username does not Exist");
          } else if (
            parsedData.error_code === LoginErrorCodes.PASSWORD_IS_INCORRECT
          ) {
            setMessage("Incorrect Password");
          }
          //clearMessage();
        }
      } else if (parsedData.message_type === MessageTypes.SIGN_UP_RESPONSE) {
        if (parsedData.status === Status.SUCCESS) {
          setMessage("Signup Successfull");
          setTimeout(() => {
            navigate("/login");
            setMessage("");
          }, 2000);
        } else if (parsedData.status === Status.ERROR) {
          if (
            parsedData.error_code === SignupErrorCodes.USERNAME_ALREADY_EXISTS
          ) {
            setMessage("Username already exists!");
          } else if (
            parsedData.error_code === SignupErrorCodes.EMAIL_ALREADY_EXISTS) {
            setMessage("Email already exists!");
          } else if (parsedData.error_code === SignupErrorCodes.PHONE_ALREADY_EXISTS) {
            setMessage("Phone already exists!");
          }
          //clearMessage();
        }
      } else if (parsedData.message_type === MessageTypes.CHAT_MESSAGE) {
        //check docs once
      } else if (
        parsedData.message_type === MessageTypes.SEARCH_USER_RESPONSE
      ) {
        //  parsedData.users.username[]
        console.log(parsedData);
        console.log(parsedData.users);
        setSuggestions(parsedData.users);
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
      if (newSocket.current.readyState === WebSocket.OPEN)
        newSocket.current.close();
    };
  }, []);

  function handleLoginFormSubmit(loginform) {
     setRequestingUser(loginform.username);
    if (socket && socket.readyState === WebSocket.OPEN) {
      const loginData = {
        message_type: MessageTypes.LOGIN_REQUEST,
        ...loginform,
        timestamp,
      };
      socket.send(JSON.stringify(loginData));
    } else {
      console.log("WebSocket not connected:", socket?.readyState);
    }
  }

  function handleSignupFormSubmit(signupform) {
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

  function handleAddFriendButtonClick(user) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const req = {
        message_type: MessageTypes.FRIEND_REQ_REQUEST,
        sender_id: currentUserId,
        sender: requestingUser,
        receiver_id: user.user_id,
        receiver: user.username,
        timestamp,
      };
      console.log(req, "req");
      socket.send(JSON.stringify(req));
    } else {
      console.log("WebSocket not connected:", socket?.readyState);
    }
  }

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
            boxShadow: `0 0 6px ${socketMessage === "Connected!" ? "#00FF00" : "#FF0000"
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
              onLoginFormSubmit={handleLoginFormSubmit}
              message={message}
              setMessage={setMessage}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup
              onSignupFormSubmit={handleSignupFormSubmit}
              message={message}
            />
          }
        />
        <Route
          path="/chatpage"
          element={
            <RequireAuth isAuth={isAuth}>
              <Chatpage
                socket={socket}
                requestingUser={requestingUser}
                suggestions={suggestions}
                onAddFriendButtonClick={handleAddFriendButtonClick}
              />
            </RequireAuth>
          }
        />
        <Route path="/about_us" element={<AboutUs />} />
      </Routes>
    </>
  );
}

export default App;
