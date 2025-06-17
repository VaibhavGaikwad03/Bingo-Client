import { useState } from "react";

export default function Signup(props){
    let {message} = props;

    let[signupform , setSignupform] = useState("");

    function handleButtonCancel(){
        props.onButtonCancel();
    }

    function handleButtonLogin(){
        props.onButtonLogin();
    }

    function handleSignupFormSubmit(event){
        event.preventDefault();
        console.log(signupform);
        props.onSignupFormSubmit(signupform);
    }

    function handleTextChange(event) {
        let name = event.target.name;
        setSignupform({ ...signupform, [name]: event.target.value });
      }

    return (
        <>
        <div className="container-fluid vh-100 vw-100 " style={{
  background: "radial-gradient(circle at center, #a8dbe5 0%, #4ca1af 40%, #2f6d7a 100%)"
}}
>
            <div className="container-fluid row h-100 w-100 m-1 " >
                <div className="col-3"></div>
                <div
              className="col-md-6 d-flex flex-column justify-content-center align-items-center"
              style={{
                background: "transparent",
              }}
            >
              <div
                className="w-75 p-5"
                style={{
                  background:
                    "linear-gradient(to bottom right, #2c3e50, #4ca1af)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                }}
              >
                <h3 className="text-center text-primary mb-4">SIGNUP</h3>
                <div className="text-center mb-4 "><em>{message}</em></div>
                <form action="accept()" method="post" 
                 onSubmit={handleSignupFormSubmit}
                >
                  <div className="mb-4 d-flex align-items-center border-bottom pb-1">
                    <i className="bi bi-person-circle me-3 fs-4"></i>
                    <input
                      className="form-control border-0"
                      type="text"
                      name="username"
                      onChange={handleTextChange}
                      placeholder="Username" required
                    />
                  </div>

                  <div className="mb-4 d-flex align-items-center border-bottom pb-2">
                    <i className="bi bi-lock-fill me-3 fs-4"></i>
                    <input
                      className="form-control border-0"
                      type="password"
                      onChange={handleTextChange}
                      name="password"
                      placeholder="Password" required
                    />
                  </div>

                  <div className="mb-4 d-flex align-items-center border-bottom pb-2">
                    <i className="bi-person-vcard-fill me-3 fs-4"></i>
                    <input
                      className="form-control border-0"
                      type="text"
                      onChange={handleTextChange}
                      name="fullname"
                      placeholder="Enter your Full name"
                      required
                    />
                  </div>

                  <div className="mb-4 d-flex align-items-center border-bottom pb-2">
                    <i className="bi bi-calendar-date me-3 fs-4"></i>
                    <input
                      className="form-control border-0"
                      type="date"
                      onChange={handleTextChange}
                      name="dob"
                      placeholder="Date of Birth" required
                    />
                  </div>

                  <div className="mb-4 d-flex align-items-center border-bottom pb-2">
                    <i className="bi bi-envelope-at-fill me-3 fs-4"></i>
                    <input
                      className="form-control border-0"
                      type="email"
                      onChange={handleTextChange}
                      name="email"
                      placeholder="Email-id"
                    />
                  </div>

                  <div className="mb-4 d-flex align-items-center border-bottom pb-2">
                    <i className="bi bi-telephone-fill me-3 fs-4"></i>
                    <input
                      className="form-control border-0"
                      type="tel"
                      onChange={handleTextChange}
                      name="phone"
                      pattern="[0-9]{10}" 
                      maxLength="10"
                      placeholder="Mobile number"
                    />
                  </div>

                  <div className="mb-4 d-flex ps-5 ms-4 align-items-center me-1 fw-bold"><label className="m-1">
                    Gender : 
                    <input onChange={handleTextChange} className="m-1" type="radio" name="gender" value="M" required />
                    Male
                    </label>
                    <br />
                    <label className="m-1">
                    <input onChange={handleTextChange} type="radio" className="m-1" name="gender" value="F" />
                    Female
                    </label>
                    <br />
                    <label className="m-1">
                    <input onChange={handleTextChange} type="radio" className="m-1" name="gender" value="O" />
                     Other
                    </label>
                    </div>

                  <div className="text-center">
                    <input
                      type="submit"
                      value="Signup"
                      className="btn btn-success me-3"
                    />
                    <input type="button" value="Cancel"  className="btn btn-danger" onClick={handleButtonCancel} />
                  </div>

                  <div className="mt-3 text-center">
                    Already have an account? 
                    <a
                      className="text-info text-decoration-underline fw-bold"
                      href="#"
                      onClick={handleButtonLogin}
                    >
                      Login
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-3"></div>
            </div>
        </div>
        </>
    );
}