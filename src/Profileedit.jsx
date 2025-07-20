import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profileedit(props) {
  let { userProfileInfo } = props;
  let {setProfileView} = props;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: userProfileInfo.name,
    fullname : userProfileInfo.fullname,
    username: userProfileInfo.username,
    dob: userProfileInfo.dob,
    gender: userProfileInfo.gender,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // navigate("/profile", { state: formData });
    setProfileView("profile")
    console.log("Saved:", formData);
  };

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
          onClick={() => setProfileView("profile")}
        ></div>
      </div>

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

      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h4>Username</h4>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          style={{
            display: "inline-block",
            padding: "5px 15px",
            border: "1px solid black",
            borderRadius: "4px",
            textAlign: "center",
          }}
        />
      </div>

      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h4>Name</h4>
        <input
          type="text"
          name="name"
          value={formData.fullname}
          onChange={handleChange}
          style={{
            display: "inline-block",
            padding: "5px 15px",
            border: "1px solid black",
            borderRadius: "4px",
            textAlign: "center",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          marginBottom: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h4>DOB</h4>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            style={{
              padding: "5px 10px",
              borderRadius: "4px",
              border: "1px solid black",
            }}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <h4>Gender</h4>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{
              padding: "5px 10px",
              borderRadius: "4px",
              border: "1px solid black",
            }}
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        {/* <h4>Bio</h4>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          style={{
            display: "inline-block",
            padding: "5px 15px",
            border: "1px solid black",
            borderRadius: "4px",
            textAlign: "center",
          }}
        /> */}

        <div className="text-center">
          <button
            onClick={() => setProfileView("profile")}
            className="btn btn-danger mt-3"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="btn btn-success mt-3"
            style={{ marginLeft: "10px" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}