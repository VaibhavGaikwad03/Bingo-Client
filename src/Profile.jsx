import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile(props) {
  let {userProfileInfo} = props;
  const [profileview, setprofileview] = useState("");
  const navigate = useNavigate();

  function handleprofileedit() {
    setprofileview("profileedit");
  }

  return (
    <div
      className="profile-page"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "white",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Header with back and edit buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div
          className="bi bi-arrow-left-circle"
          style={{ fontSize: "2rem", cursor: "pointer" }}
          onClick={() => navigate("/chatpage")}
        ></div>

        <div
          className="bi bi-pencil-square"
          style={{ fontSize: "2rem", cursor: "pointer" }}
          onClick={handleprofileedit}
        ></div>
      </div>

      {/* Profile Image */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          className="circular-image"
          src="/images/pp.jpg"
          alt="Profile"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Username and Name */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h4>Username</h4>
     
        <div
          style={{
            display: "inline-block",
            padding: "5px 15px",
            border: "1px solid black",
          }}
        >
          {userProfileInfo.username}
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h4>Name</h4>
        <div
          style={{
            display: "inline-block",
            padding: "5px 15px",
            border: "1px solid black",
          }}
        >
          {userProfileInfo.fullname}
        </div>
      </div>

      {/* Friends Section */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h4>Friends:</h4>
        {/* Add dynamic list of friends here if needed */}
      </div>

      {/* DOB and Gender */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "30px",
          textAlign: "center",
        }}
      >
        <div>
          <h4>DOB</h4>
          <p>{userProfileInfo.dob}</p>
        </div>
        <div>
          <h4>Gender</h4>
          <p>{userProfileInfo.gender}</p>
        </div>
      </div>

      {/* Bio */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h4>Bio</h4>
        <p>Write your bio here...</p>
      </div>
    </div>
  );
}
