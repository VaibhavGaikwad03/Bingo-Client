import React from "react";

export default function AboutUs() {
  return (
    <div
      className="about-us-page d-flex flex-column min-vh-100"
      style={{
        fontFamily: "Arial, sans-serif",
        background:
          "linear-gradient(to right, #ffdee9, #ff87a2, #7fa9c9, #4ca1af)",
      }}
    >
      <div
        className="about-us-content container py-5 px-3"
        style={{
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        <h1
          className="text-center mb-4"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            color: "#2e2e2e",
          }}
        >
          About Bingo Chat
        </h1>

        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
            lineHeight: "1.8",
            color: "#444",
            textAlign: "justify",
          }}
        >
          Welcome to <strong>Bingo Chat</strong> - where conversations come alive!
          Our platform is built with the vision to make real-time chatting
          seamless, secure, and fun.
        </p>

        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
            lineHeight: "1.8",
            color: "#444",
            marginTop: "1rem",
            textAlign: "justify",
          }}
        >
          Whether you're connecting with friends, family, or colleagues, Bingo
          Chat gives you a clean and fast user experience. We believe
          communication should be easy and enjoyable - and that's what we deliver.
        </p>

        <h2
          className="mt-4"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: "#2e2e2e",
          }}
        >
          Our Mission
        </h2>

        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
            lineHeight: "1.8",
            color: "#444",
          }}
        >
          To provide a reliable and user-friendly chat platform that connects
          people across the globe, enabling them to share, collaborate, and
          build communities.
        </p>

        <h2
          className="mt-4"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: "#2e2e2e",
          }}
        >
          Why Bingo Chat?
        </h2>

        <ul
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
            color: "#444",
            lineHeight: "1.8",
            paddingLeft: "1.5rem",
          }}
        >
          <li>💬 Real-time messaging</li>
          <li>🔒 Privacy-focused design</li>
          <li>🎨 Simple, intuitive interface</li>
          <li>🌐 Connects people across distances</li>
        </ul>
      </div>

    </div>
  );
}
