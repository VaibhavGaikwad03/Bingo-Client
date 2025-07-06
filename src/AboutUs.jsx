import React from "react";
import Footer from "./Footer";

export default function AboutUs() {
  return (
    <div
      className="about-us-page row h-100 w-100 m-0 container-fluid vh-100 vw-100 m-0 p-0 bi-text-left"
      style={{
        fontFamily: "Arial, sans-serif",
        background:
          "linear-gradient(to right, #ffdee9, #ff87a2, #7fa9c9, #4ca1af)",
      }}
    >
      {/* <div><img className="img-fluid" src="./images/chatphoto2.png" alt="" /></div> */}
      <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "auto" }}>
        <h1
          style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#2e2e2e" }}
        >
          About Bingo Chat
        </h1>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#444" }}>
          Welcome to <strong>Bingo Chat</strong> – where conversations come
          alive! Our platform is built with the vision to make real-time
          chatting seamless, secure, and fun.
        </p>

        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: "1.8",
            color: "#444",
            marginTop: "15px",
          }}
        >
          Whether you're connecting with friends, family, or colleagues, Bingo
          Chat gives you a clean and fast user experience. We believe
          communication should be easy and enjoyable – and that’s what we
          deliver.
        </p>

        <h2 style={{ marginTop: "30px", color: "#2e2e2e" }}>Our Mission</h2>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#444" }}>
          To provide a reliable and user-friendly chat platform that connects
          people across the globe, enabling them to share, collaborate, and
          build communities.
        </p>

        <h2 style={{ marginTop: "30px", color: "#2e2e2e" }}>Why Bingo Chat?</h2>
        <ul style={{ fontSize: "1.1rem", color: "#444", lineHeight: "1.8" }}>
          <li>💬 Real-time messaging</li>
          <li>🔒 Privacy-focused design</li>
          <li>🎨 Simple, intuitive interface</li>
          <li>🌐 Connects people across distances</li>
        </ul>
      </div>

      <Footer />
    </div>
  );
}