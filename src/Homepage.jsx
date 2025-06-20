import { useEffect, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

import Navbar from "./Navbar";
import Login from "./Login";
import Signup from "./Signup";
import { div } from "framer-motion/client";
// import SplashCursor from "./SplashCursor";

export default function Homepage() {
  const [view, setView] = useState("Homepage");
  const [message] = useState([]);
  const [socket, setSocket] = useState(null);
  const [socketMessage, setSocketMessage] = useState([]);
  const timestamp = new Date().toISOString();

  useEffect(() => {
    const newSocket = new WebSocket("https://6d0f-2401-4900-561f-9965-169c-6094-ca7f-1378.ngrok-free.app/");

    newSocket.onopen = () => {
      setSocketMessage("Connected!");
      console.log("Connected to server");
    };

    newSocket.onmessage = (event) => {
      console.log("Received from Server:", event.data);
      let parsedData = JSON.parse(event.data);
      if (parsedData.message_type == 102) {   // msg_type -> 102 = login_response
        if (parsedData.status == 0) {
          console.log("Login Successfull");
        } else if (parsedData.status == 1) {
          console.log("Error Logging in");
          if (parsedData.error_code == 1001) {
            console.log("Username does not Exist");
          } else if (parsedData.error_code == 1002) {
            console.log("Incorrect Password");
          }
        }
      } else if (parsedData.message_type == 104) {  // msg_type -> 104 = signup_response
        if (parsedData.status == 0 ) {   //status -> 0 = success
          console.log("Signup Successfull");
        } else if (parsedData.status == 1) {   // status -> 1 = error
          console.log("Error Signing in");
          if (parsedData.error_code == 2001) {
            console.log("Username already exists!");
          }
          else if(parsedData.error_code == 2002) {
            console.log("Email already exists!");
          }
          else if (parsedData.error_code == 2003) {
            console.log("Phone already exists!");
          }
        }
      }
    };

    newSocket.onclose = () => {
      setSocketMessage("Disconnected!");
      console.log("Connection closed");
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(newSocket);

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, []);

  function clearMessage() {
    setTimeout(() => {
      setMessage("");
    }, 2000);
  }

  function handleSignupFormSubmit(signupform) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      let newSigninform = {
        message_type : 103,
        ...signupform 
        ,"timestamp" : timestamp
      }
      socket.send(JSON.stringify(newSigninform));
      console.log(newSigninform);
    } else {
      console.log("WebSocket not connected yet : " , socket.readyState);
    }
  }


  function handleLoginFormSubmit(loginform) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      let newLoginform = {
        message_type: 101 ,
        ...loginform
        ,"timestamp": timestamp,
      };
      socket.send(JSON.stringify(newLoginform));
    } else {
      console.log("WebSocket not connected yet : ", socket.readyState);
    }
  }

  function handleButtonSignup() {
    setView("signup");
  }

  function handleButtonLogin() {
    setView("login");
  }

  function handleButtonCancel() {
    setView("Homepage");
  }

  const hero = useAnimation();
  const NAV_HEIGHT = 350; // adjust if your navbar is taller

  useEffect(() => {
    if (view !== "Homepage") return;

    (async () => {
      // pulse in
      await hero.start({ scale: 1.08, transition: { duration: 0.7 } });
      // slight out
      await hero.start({ scale: 0.96, transition: { duration: 0.6 } });
      // slight in
      await hero.start({ scale: 1.02, transition: { duration: 0.5 } });
      // expand to banner
      await hero.start({
        width: "100%",
        height: "60vh",
        left: 0,
        top: NAV_HEIGHT,
        x: 0,
        y: 0,
        scale: 1,
        transition: { duration: 0.9, ease: "easeInOut" },
      });
    })();
  }, [hero, view, NAV_HEIGHT]);

  return (
    <div
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {socketMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            padding: "10px 20px",
            borderRadius: 50,
            background:
              socketMessage === "Connected!"
                ? "rgba(0, 255, 0, 0.2)"
                : "rgba(255, 0, 0, 0.2)",
            color: socketMessage === "Connected!" ? "#00FF00" : "#FF0000",
            fontWeight: "bold",
            boxShadow: `0 0 10px ${
              socketMessage === "Connected!" ? "#00FF00" : "#FF0000"
            }`,
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <span
            className="mt-2 mb-0"
            style={{
              marginRight: "10px",
              fontSize: "1.5rem",
            }}
          >
            {socketMessage === "Connected!" ? "🟢" : "🔴"}
          </span>
          {socketMessage}
        </div>
      )}

      {/* <SplashCursor /> */}

      {view === "Homepage" && (
        <div className="row p-2 mt-0 align-items-center fixed-top">
          <Navbar
            socketMessage={socketMessage}
            onButtonLogin={handleButtonLogin}
            onButtonSignup={handleButtonSignup}
          />
        </div>
      )}

      {view === "Homepage" && (
        <>
          <AnimatePresence>
            <motion.section
              key="hero"
              initial={{
                width: 320,
                height: 320,
                left: "50%",
                top: "50%",
                x: "-50%",
                y: "-50%",
                scale: 1,
              }}
              animate={hero}
              style={{
                position: "fixed",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
              }}
            >
              <motion.img
                src="/images/cute_chat.jpeg"
                alt="img"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  inset: 0,
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 2.4, duration: 0.8 },
                }}
                style={{
                  position: "relative",
                  zIndex: 2,
                  textAlign: "center",
                  color: "#b30000",
                  fontFamily: "serif",
                }}
              >
                <div
                  style={{
                    fontSize: 25,
                    letterSpacing: 1,
                    marginBottom: 6,
                    color: "black",
                  }}
                >
                  mail: bingo@gmail.com
                </div>
                <h1
                  style={{
                    fontSize: "6vw",
                    fontWeight: 600,
                    margin: 0,
                    letterSpacing: 12,
                  }}
                >
                  BINGO
                </h1>
              </motion.div>
            </motion.section>
          </AnimatePresence>
          
        </>
      )}

      

{view === "login" && (
        <Login
          message={message}
          onButtonSignup={handleButtonSignup}
          onButtonCancel={handleButtonCancel}
          onLoginFormSubmit={handleLoginFormSubmit}
        />
      )}

      {view === "signup" && (
        <Signup
          message={message}
          onButtonLogin={handleButtonLogin}
          onButtonCancel={handleButtonCancel}
          onSignupFormSubmit={handleSignupFormSubmit}
        />
      )}

    </div>
  );
}
