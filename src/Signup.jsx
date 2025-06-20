import { useState } from "react";

export default function Signup(props) {
    let { message } = props;
    let [signupform, setSignupform] = useState("");

    function handleButtonCancel() {
        props.onButtonCancel();
    }

    function handleButtonLogin() {
        props.onButtonLogin();
    }

    function handleSignupFormSubmit(event) {
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
            <div 
                className="d-flex flex-column justify-content-center align-items-center"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "linear-gradient(to right, #ffdee9, #ff87a2, #7fa9c9, #4ca1af)",
                    margin: 0,
                    overflow: "auto",
                }}
            >
                <div className="mb-3">
                    <img src="./images/BingoLogo.png" style={{ width: "120px" }} alt="Logo" />
                </div>

                <div 
                    className="p-4 form-container"
                    style={{
                        width: "90%",
                        maxWidth: "500px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "15px",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.18)",
                    }}
                >
                    <h3 className="text-center text-primary mb-4">SIGNUP</h3>
                    <div className="text-center mb-4"><em>{message}</em></div>

                    <form onSubmit={handleSignupFormSubmit}>
                        <div className="mb-4 d-flex align-items-center border-bottom pb-1">
                            <i className="bi bi-person-circle me-3 fs-4"></i>
                            <input className="form-control border-0" type="text" name="username" onChange={handleTextChange} placeholder="Username" required />
                        </div>

                        <div className="mb-4 d-flex align-items-center border-bottom pb-2">
                            <i className="bi bi-lock-fill me-3 fs-4"></i>
                            <input className="form-control border-0" type="password" name="password" onChange={handleTextChange} placeholder="Password" required />
                        </div>

                        <div className="mb-4 d-flex align-items-center border-bottom pb-2">
                            <i className="bi bi-person-vcard-fill me-3 fs-4"></i>
                            <input className="form-control border-0" type="text" name="fullname" onChange={handleTextChange} placeholder="Enter your Full name" required />
                        </div>

                        <div className="mb-4 d-flex align-items-center border-bottom pb-2">
                            <i className="bi bi-calendar-date me-3 fs-4"></i>
                            <input className="form-control border-0" type="date" name="dob" onChange={handleTextChange} required />
                        </div>

                        <div className="mb-4 d-flex align-items-center border-bottom pb-2">
                            <i className="bi bi-envelope-at-fill me-3 fs-4"></i>
                            <input className="form-control border-0" type="email" name="email" onChange={handleTextChange} placeholder="Email-id" />
                        </div>

                        <div className="mb-4 d-flex align-items-center border-bottom pb-2">
                            <i className="bi bi-telephone-fill me-3 fs-4"></i>
                            <input className="form-control border-0" type="tel" name="phone" pattern="[0-9]{10}" maxLength="10" onChange={handleTextChange} placeholder="Mobile number" />
                        </div>

                        <div className="mb-4 d-flex ps-5 ms-4 align-items-center me-1 fw-bold flex-wrap">
                            <label className="m-1">Gender :
                                <input onChange={handleTextChange} className="m-1" type="radio" name="gender" value="Male" required /> Male
                            </label>
                            <label className="m-1">
                                <input onChange={handleTextChange} className="m-1" type="radio" name="gender" value="Female" /> Female
                            </label>
                            <label className="m-1">
                                <input onChange={handleTextChange} className="m-1" type="radio" name="gender" value="Other" /> Other
                            </label>
                        </div>

                        <div className="text-center">
                            <input type="submit" value="Signup" className="btn btn-success me-3" />
                            <input type="button" value="Cancel" className="btn btn-danger" onClick={handleButtonCancel} />
                        </div>

                        <div className="mt-3 text-center">
                            Already have an account?
                            <a className="text-primary text-decoration-underline fw-bold" href="#" onClick={handleButtonLogin}> Login </a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}