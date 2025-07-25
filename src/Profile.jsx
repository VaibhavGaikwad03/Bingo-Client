import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profileedit from "./Profileedit";

export default function Profile(props) {
  let { userProfileInfo } = props;
  let [profileView, setProfileView] = useState("profile");
  const navigate = useNavigate();

  return (
    <>
      {profileView == "profile" && (
        <>
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
                onClick={() => navigate("/chatpage")}
              ></div>

              <div
                className="bi bi-pencil-square"
                style={{ fontSize: "2rem", cursor: "pointer" }}
                onClick={() => setProfileView("profile_edit")}
              ></div>
            </div>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                className="circular-image"
                src="/images/icons/user.png"
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
              <div
                style={{
                  display: "inline-block",
                  padding: "5px 15px",
                  border: "1px solid black",
                  width: "250px",
                  textAlign: "center",
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
                  width: "250px",
                  textAlign: "center",
                }}
              >
                {userProfileInfo.fullname}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <h4>DOB</h4>
                <div
                  style={{
                    padding: "5px 10px",
                    border: "1px solid black",
                    width: "100px",
                  }}
                >
                  {userProfileInfo.dob || "N/A"}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <h4>Gender</h4>
                <div
                  style={{
                    padding: "5px 10px",
                    border: "1px solid black",
                    width: "100px",
                  }}
                >
                  {userProfileInfo.gender || "N/A"}
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <h4>Bio</h4>
              <div
                style={{
                  display: "inline-block",
                  padding: "5px 15px",
                  border: "1px solid black",
                  maxWidth: "80%",
                }}
              >
                {userProfileInfo.bio || "No bio added yet."}
              </div>
            </div>
          </div>
        </>
      )}
      {
        profileView == "profile_edit" && (
          <Profileedit userProfileInfo={userProfileInfo}
          setProfileView = {setProfileView}
          />
        )
      }
    </>
  );
}
