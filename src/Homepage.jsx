import { useEffect , useState } from "react";
import Navbar from "./Navbar"
import Login from "./Login";
import Signup from "./Signup";
import axios from "axios";


export default function Homepage(){
    let[view , setView] = useState("Homepage");
    let [message , setMessage] = useState([]);
    const [socket , setSocket] = useState(null);
    const timestamp = new Date().toISOString();

    useEffect(() => {
      const newSocket = new WebSocket('ws://localhost:3001');
    
      newSocket.onopen = () => {
        console.log("Connected to server");
      };
    
      newSocket.onmessage = (event) => {
        console.log("Received from Server:", event.data);
        let parsedData = JSON.parse(event.data);
        if(parsedData.message_type == "login_response"){
          if(parsedData.status == "success" && parsedData.error_code == 0 && parsedData.user_id != -1){
            console.log("Login Successfull");
          }
          else if(parsedData.status == "error"){
            console.log("Error Logging in");
            if(parsedData.error_code == 101){
              console.log("Username does not Exist");
            }
            else if(parsedData.error_code == 102){
              console.log("Incorrect Password");
            }
          }
        }
        else if(parsedData.message_type == "signup_response" ){
          if(parsedData.status == "success" && parsedData.error_code == 0 && parsedData.user_id != -1){
            console.log("Signup Successfull");
          }
          else if(parsedData.status == "error"){
            console.log("Error Signing in");
            if(parsedData.error_code == 201){
              console.log("User already exists!");
            }
          }
        }
        
      };
    
      
      newSocket.onclose = () => {
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
          setMessage(""); // Clear message from React state
        }, 2000);
      }


    function handleSignupFormSubmit(signupform) {
      // console.log(signupform);
      if (socket && socket.readyState === WebSocket.OPEN) {
        let newSigninform = {
          message_type : "signup_request",
          ...signupform ,
          "timestamp" : timestamp
        }
        socket.send(JSON.stringify(newSigninform));
        console.log(newSigninform);
      } else {
        console.log("WebSocket not connected yet : " , socket.readyState);
      }
    }

    function handleLoginFormSubmit(loginform) {
      // console.log(loginform);
      if (socket && socket.readyState === WebSocket.OPEN) {       
        let newLoginform = {
          message_type : "login_request",
          ...loginform ,
          "timestamp" : timestamp
        }
        socket.send(JSON.stringify(newLoginform));
      } else {
        console.log("WebSocket not connected yet : " , socket.readyState);
      }
    }

    function handleButtonSignup() {
        setView("signup");
    }

    function handleButtonLogin() {
        setView("login");
    }

    function handleButtonCancel(){
        setView("Homepage");
    }

    return (
        <>
        {view == "Homepage" && (
            <div className="row p-2 mt-0 align-items-center fixed-top"> 
            <Navbar 
                onButtonLogin={handleButtonLogin}
                onButtonSignup={handleButtonSignup}
            />
        </div>
        )

        }

        {view == "login" && (
            <Login message={message}
             onButtonSignup={handleButtonSignup}
            onButtonCancel={handleButtonCancel}
            onLoginFormSubmit={handleLoginFormSubmit}/>
        )}

        {view == "signup" && (
            <Signup message={message}
             onButtonLogin={handleButtonLogin}
            onButtonCancel={handleButtonCancel}
            onSignupFormSubmit={handleSignupFormSubmit}/>
        )}
        
        </>
    )
}