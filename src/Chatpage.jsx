import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MessageTypes } from "./Status_MessageTypes";
import { FriendshipStatus } from "./FriendshipStatus";
import { i } from "framer-motion/client";
import SidebarFriendRequests from "./SidebarFriendRequests.jsx";
import Profile from "./Profile.jsx";
import SettingsSidebar from "./SettingsSidebar.jsx";
import { toast } from "react-toastify";

export default function Chatpage(props) {
  let { socket, message, setMessage } = props;
  let { friendRequest } = props;
  let { theme, setTheme } = props;
  let { currentUsername } = props;
  let { setFriendRequest, currentUserId, currentNameOfUser, timestamp } = props;
  let { setSuggestions } = props;
  let { suggestions } = props;
  const navigate = useNavigate();
  let [chatMessage, setChatMessage] = useState({});
  let [searchView, setSearchView] = useState("icon");
  let [chatView, setChatView] = useState("none");
  let [showSidebar, setShowSidebar] = useState(false);
  // const friendReqList = friendRequest.flat();

  function handleSearchIconButtonClick() {
    setSearchView("search_bar");
  }

  function handleTextChange(event) {
    const { name, value } = event.target;

    const updatedMessage = { ...chatMessage, [name]: value };

    const chatData = {
      message_type: MessageTypes.SEARCH_USER_REQUEST,
      ...updatedMessage,
      requested_by: currentUsername,
    };
    setChatMessage(chatData);

    console.log(JSON.stringify(chatData));
    socket.send(JSON.stringify(chatData));
  }

  function handleAddFriendButtonClick(user) {
    // alert("Friend Request Sent to " + user.display_name);
    toast.info(`Friend request sent to  ${user.username}`);
    if (socket && socket.readyState === WebSocket.OPEN) {
      const req = {
        message_type: MessageTypes.FRIEND_REQ_REQUEST,
        sender_id: currentUserId,
        sender: currentUsername,
        name_of_sender: currentNameOfUser,
        receiver_id: user.user_id,
        receiver: user.username,
        name_of_receiver: user.display_name,
        timestamp,
      };
      // const searchUserRequest = {
      //   message_type: MessageTypes.SEARCH_USER_REQUEST,
      //   username : chatMessage
      // }
      console.log(req, "req");
      socket.send(JSON.stringify(req));
      socket.send(JSON.stringify(chatMessage));
    } else {
      console.log("WebSocket not connected:", socket?.readyState);
    }
  }

  // function handleLogoutButtonClick(){
  //   props.onLogoutButtonClick()
  // }

  const dummyChats = [
    {
      id: 1,
      name: "Rutuja Dabhade",
      lastMessage: "Hey, what's up?",
      time: "10:45 AM",
      profilePic: "/images/good_baby_pfp.jpeg",
    },
    {
      id: 2,
      name: "Sakshi Chavan",
      lastMessage: "Let's meet tomorrow",
      time: "9:20 AM",
      profilePic: "/images/good_baby_pfp.jpeg",
    },
    {
      id: 3,
      name: "Chetana Patil",
      lastMessage: "Sure, I'll check",
      time: "Yesterday",
      profilePic: "/images/good_baby_pfp.jpeg",
    },
  ];

  const messages = [
    { text: "Hey, what's up?", timestamp: "10:00 AM", isSent: false },
    {
      text: "Not much, just working. You?",
      timestamp: "10:01 AM",
      isSent: true,
    },
    {
      text: "Same here. Any plans for the weekend?",
      timestamp: "10:05 AM",
      isSent: false,
    },
    {
      text: "Thinking of going to the beach. Wanna join?",
      timestamp: "10:06 AM",
      isSent: true,
    },
    {
      text: "Sounds great! Let me know the details.",
      timestamp: "10:07 AM",
      isSent: false,
    },
  ];
  // }

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex overflow-hidden">
      {/* Left side */}

      {searchView != "settings" && (
        <div
          className="chat-sidebar bg-white border-end"
          style={{ width: "650px", overflowY: "auto", flexShrink: 0 }}
          >
          {/* 📌 WhatsApp-style Sidebar Header */}
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h4
              className="m-0 fw-bold"
              style={{ fontFamily: "'Lilita One', sans-serif" }}
            >
              Bingo
            </h4>
            <div className="dropdown">
              <i
                className="bi bi-three-dots-vertical"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></i>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#">
                    New Group
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    New Broadcast
                  </a>
                </li>
                {/* <li>
                  <a className="dropdown-item" href="#">
                    Option 3
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Option 4
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
          {/* {searchView === "search_bar" ? ( */}
          <div className="p-3 position-relative">
            <input
              type="text"
              name="username"
              autoComplete="off"
              className="form-control form-control-lg"
              placeholder="Search username"
              // value={chatMessage.username || ""}
              // onChange={handleTextChange}
              autoFocus
            />
            {/* <i
              className="bi bi-x-circle-fill text-danger position-absolute"
              style={{
                top: "15px",
                right: "15px",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
              onClick={() => {
                setChatMessage({});
                setSuggestions([]);
                setSearchView("icon");
              }}
            ></i> */}

            {suggestions.length > 0 && (
              <ul className="list-group mt-3">
                {suggestions.map((user) => (
                  <li
                    key={user.user_id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6>{user.display_name}</h6>
                      <small>{user.username}</small>
                    </div>
                    {user.friendship_status === FriendshipStatus.NOT_FRIEND && (
                      <img
                        src="/images/icons/add_friend.png"
                        alt="add_friend"
                        onClick={() => handleAddFriendButtonClick(user)}
                        className="chatpage-icon"
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ) : ( */}
          {/* <div className="p-3">
            <h5 className="mb-3">Friends</h5>
            {friendRequest.length === 0 ? (
              <p>No friends added yet.</p>
            ) : (
              <ul className="list-group">
                {friendRequest.map((user) => (
                  <li
                    key={user.user_id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>{user.username}</span>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        console.log("Open chat with", user.username)
                      }
                    >
                      Chat
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div> */}

          <div className="p-3">
            <h5 className="mb-3">Chats</h5>
            <ul className="list-group">
              {dummyChats.map((chat) => (
                <li
                  key={chat.id}
                  className="list-group-item d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => setChatView("chat")}
                >
                  <img
                    src={chat.profilePic}
                    alt={chat.name}
                    className="rounded-circle me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <strong>{chat.name}</strong>
                      <small className="text-muted">{chat.time}</small>
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                      {chat.lastMessage}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* )} */}
        </div>
      )}

      {/* {searchView != "settings" && (
        <div
          className="chat-sidebar bg-white border-end"
          style={{ width: "350px", overflowY: "auto" }}
        >
          <div className="p-3 position-relative">
            <input
              type="text"
              name="username"
              autoComplete="off"
              className="form-control form-control-lg"
              placeholder="Search username"
              value={chatMessage.username || ""}
              onChange={handleTextChange}
              autoFocus
            />
            
            {suggestions.length > 0 && (
              <ul className="list-group mt-3">
                {suggestions.map((user) => (
                  <li
                    key={user.user_id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6>{user.display_name}</h6>
                      <small>{user.username}</small>
                    </div>
                    {user.friendship_status === FriendshipStatus.NOT_FRIEND && (
                      <img
                        src="/images/icons/add_friend.png"
                        alt="add_friend"
                        onClick={() => handleAddFriendButtonClick(user)}
                        className="chatpage-icon"
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-3">
            <h5 className="mb-3">Friends</h5>
            {friendRequest.length === 0 ? (
              <p>No friends added yet.</p>
            ) : (
              <ul className="list-group">
                {friendRequest.map((user) => (
                  <li
                    key={user.user_id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>{user.username}</span>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        console.log("Open chat with", user.username)
                      }
                    >
                      Chat
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )} */}

      {/* Right side */}
      {chatView == "none" && (
        <div
          className="flex-grow-1 d-flex flex-column p-3"
          style={{ overflowY: "auto", background: "white"  }}
        >
          {searchView === "icon" && (
            <div className="d-flex justify-content-end align-items-center mb-3 me-3">
              <img
                src="/images/icons/search.png"
                alt="search_logo"
                className="me-4"
                style={{ width: "40px", height: "40px", cursor: "pointer" }}
                onClick={handleSearchIconButtonClick}
              />
              <div
                className="position-relative me-4"
                style={{ width: "40px", height: "40px", cursor: "pointer" }}
              >
                <img
                  src="/images/icons/friend-request.png"
                  alt="friend_req_logo"
                  className="w-100 h-100"
                  onClick={() => setShowSidebar(true)}
                />
                <span
                  className="position-absolute bottom-0 end-0 badge rounded-circle bg-danger"
                  style={{ transform: "translate(15%, 15%)" }}
                  onClick={() => setShowSidebar(true)}
                >
                  {friendRequest.length}
                </span>
              </div>

              <img
                src="/images/icons/user.png"
                alt="user_logo"
                className="me-3"
                style={{ width: "40px", height: "40px", cursor: "pointer" }}
                onClick={() => navigate("/profile")}
              />
              <i
                className="bi bi-three-dots-vertical mb-2 me-3"
                style={{ fontSize: "2rem", cursor: "pointer" }}
                onClick={() => setSearchView("settings")}
              ></i>
            </div>
          )}

          {searchView === "search_bar" && (
            <div className="position-relative">
              <input
                type="text"
                name="username"
                autoComplete="off"
                className="form-control form-control-lg"
                placeholder="Search username"
                value={chatMessage.username || ""}
                onChange={handleTextChange}
                autoFocus
              />
              <i
                className="bi bi-x-circle-fill text-danger position-absolute"
                style={{
                  top: "50%",
                  right: "15px",
                  transform: "translateY(-50%)",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setChatMessage({});
                  setSuggestions([]);
                  setSearchView("icon");
                }}
              ></i>

              {suggestions.length > 0 && (
                <ul className="suggestion-list list-group position-absolute w-100 mt-1 shadow">
                  {suggestions.map((user) => (
                    <li
                      key={user.user_id}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer" }}
                    >
                      <div>
                        <h5 className="">{user.display_name}</h5>
                        <em className="fs-6 ms-1">{user.username}</em>
                      </div>

                      {user.friendship_status ===
                        FriendshipStatus.NOT_FRIEND && (
                        <img
                          src="/images/icons/add_friend.png"
                          alt="add_friend"
                          onClick={() => handleAddFriendButtonClick(user)}
                          className="chatpage-icon"
                        />
                      )}
                      {user.friendship_status === FriendshipStatus.PENDING && (
                        <img
                          src="/images/icons/pending.png"
                          alt="Pending"
                          className="chatpage-icon"
                        />
                      )}
                      {user.friendship_status === FriendshipStatus.FRIEND && (
                        <img
                          src="/images/icons/friend.png"
                          alt="friend"
                          className="chatpage-icon"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {showSidebar && (
            <SidebarFriendRequests
              setShowSidebar={setShowSidebar}
              setFriendRequest={setFriendRequest}
              friendRequest={friendRequest}
              socket={socket}
              onAccept={(user) => console.log("Accepted:", user)}
              onDecline={(user) => console.log("Declined:", user)}
            />
          )}

          {searchView === "settings" && (
            <SettingsSidebar
              message={message}
              setMessage={setMessage}
              theme={theme}
              setTheme={setTheme}
              currentUserId={currentUserId}
              currentUsername={currentUsername}
              socket={socket}
              onClose={() => setSearchView("icon")}
            />
          )}
        </div>
      )}

      {chatView == "chat" &&
        <div
          className="flex-grow-1 d-flex flex-column p-3"
          style={{ overflowY: "auto", background: "white" }}
        >
          <div
            className="d-flex align-items-center p-3 border-bottom"
            style={{
              backgroundColor: "white",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <button
              className="btn btn-link text-secondary me-2"
              onClick={() => console.log("Back clicked!")}
              style={{ fontSize: "1.25rem" }}
              aria-label="Back"
            >
              <i className="bi bi-arrow-left" onClick={() => setChatView("none")}></i>
            </button>
            {/* Profile picture */}
            <img
              src="/images/good_baby_pfp.jpeg"
              alt="Profile"
              className="rounded-circle me-3"
              style={{ width: 40, height: 40, objectFit: "cover" }}
            />

            {/* Name and status */}
            <div className="flex-grow-1">
              <div className="fw-bold" style={{ fontSize: "1.1rem" }}>
                Contact Name
              </div>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                online
              </div>
            </div>

            {/* Icons on right */}
            <div className="d-flex gap-3">
              <button className="btn btn-link text-secondary" title="Menu">
                <div className="dropdown">
                  <i
                    className="bi bi-three-dots-vertical"
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></i>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a className="dropdown-item" href="#">
                        Clear chat
                      </a>
                    </li>
                  </ul>
                </div>
              </button>
            </div>
          </div>

          {/* Messages list (your existing code) */}
          <div
            className="flex-grow-1 d-flex flex-column p-3"
            style={{ overflowY: "auto", background: "white" }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`d-flex ${
                  message.isSent
                    ? "justify-content-end"
                    : "justify-content-start"
                } mb-2`}
              >
                <div
                  className={`p-2 rounded-3 text-white ${
                    message.isSent ? "bg-primary" : "bg-secondary"
                  }`}
                  style={{ maxWidth: "75%" }}
                >
                  <div>{message.text}</div>
                  <div
                    className="text-end text-white-50 small mt-1"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
}
