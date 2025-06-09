import { useEffect , useState } from "react";
import Navbar from "./Navbar"
import Login from "./Login";
import Signup from "./Signup";
import axios from "axios";


export default function Homepage(){
    let[view , setView] = useState("Homepage");
    let [siteUsers, setSiteUsers] = useState([]);
    let [siteUsers1, setSiteUsers1] = useState([]);
    let [message , setMessage] = useState([]);

    function clearMessage() {
        setTimeout(() => {
          setMessage(""); // Clear message from React state
        }, 2000);
      }

    function handleSignupFormSubmit(signupform){
        let userFound = false;
        siteUsers1.forEach((e,index) => {
            if(signupform.email == e.email){
                userFound = true;
                setMessage("User Already Exists");
                clearMessage();
            }
        });

        if(!userFound){
            async function addDataToServer1(siteUsers1){
                let response = await axios.post(
                    "http://localhost:3000/users1",
                    signupform
                );

                let sUsers = [...siteUsers1];
                sUsers.push(response.data);
                setSiteUsers1(sUsers);
            }
            addDataToServer1(siteUsers1);
            setMessage("Signed up successfully!..You can Login now");
            clearMessage();
        } else{
            return;
        }
    }

    function handleLoginFormSubmit(loginform) {
    let userFound = false;
    //console.log(signupform);
    siteUsers.forEach((e, index) => {
      if (loginform.username_email == e.username_email) {
        userFound = true;
        setMessage("User Already Exists");
        clearMessage();
      }
      
    });
    if (!userFound) {
      async function addDataToServer(siteUsers) {
        let response = await axios.post(
          "http://localhost:3000/users",
          loginform
        );
        
        let sUsers = [...siteUsers];
        sUsers.push(response.data);
        console.log(sUsers);
        setSiteUsers(sUsers);
      }
      addDataToServer(siteUsers);
      setMessage("Login successfull!");
      clearMessage();
      
    } else {
      return;
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