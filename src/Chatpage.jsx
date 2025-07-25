import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MessageTypes } from "./Status_MessageTypes";
import { FriendshipStatus } from "./FriendshipStatus";
import { i } from "framer-motion/client";
import SidebarFriendRequests from "./SidebarFriendRequests.jsx";
import Profile from "./Profile.jsx";
import SettingsSidebar from "./SettingsSidebar.jsx";

export default function Chatpage(props) {
  let { socket } = props;
  let { friendRequest } = props;
  let { currentUsername } = props;
  let { setFriendRequest ,currentUserId ,currentNameOfUser, timestamp} = props;
  let { setSuggestions } = props;
  let { suggestions } = props;
  const navigate = useNavigate();
  let [chatMessage, setChatMessage] = useState({});
  let [searchView, setSearchView] = useState("icon");
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
    alert("Friend Request Sent to " + user.display_name);
    if (socket && socket.readyState === WebSocket.OPEN) {
      const req = {
        message_type: MessageTypes.FRIEND_REQ_REQUEST,
        sender_id: currentUserId,
        sender: currentUsername,
        name_of_sender: currentNameOfUser,
        receiver_id: user.user_id,
        receiver: user.username,
        name_of_receiver : user.display_name ,
        timestamp,
      };
      // const searchUserRequest = {
      //   message_type: MessageTypes.SEARCH_USER_REQUEST,
      //   username : chatMessage
      // }
      console.log(req, "req");
      socket.send(JSON.stringify(req));
      // socket.send(JSON.stringify(chatMessage));
    } else {
      console.log("WebSocket not connected:", socket?.readyState);
    }
  }

  // function handleLogoutButtonClick(){
  //   props.onLogoutButtonClick()
  // }

  return (
    <div className="position-fixed chatpg-container chatpg-white  top-0 start-0 w-100 pt-4 p-3 ps-5 pe-4 z-3">
      {searchView == "icon" && (
        <div className="d-flex justify-content-end   me-3">
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
            {/* {friendRequest.length > 0 && ( */}
              <span
                className="position-absolute bottom-0 end-0 badge rounded-circle bg-danger"
                style={{ transform: "translate(15%, 15%)" }}
                onClick={() => setShowSidebar(true)}
              >
                {friendRequest.length}
              </span>
            {/* )} */}
          </div>

          <img
            src="/images/icons/user.png"
            alt="user_logo"
            className="me-3"
            style={{ width: "40px", height: "40px", cursor: "pointer" }}
            onClick={() =>
              // setSearchView("profile")
              navigate("/profile")
            }
          />
          <i
            className="bi bi-three-dots-vertical mb-2 me-3"
            style={{ fontSize: "2rem", cursor: "pointer" }}
            onClick={() => setSearchView("settings")}
          ></i>
        </div>
      )}

      {searchView == "search_bar" && (
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
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center "
                  // onClick={() => handleSuggestionClick(user)}
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <h5 className="">{user.display_name}</h5>
                    <em className="fs-6 ms-1">{user.username}</em>
                  </div>

                  {user.friendship_status == FriendshipStatus.NOT_FRIEND && (
                    <img
                      src="/images/icons/add_friend.png"
                      alt="add_friend"
                      onClick={() => handleAddFriendButtonClick(user)}
                      className="chatpage-icon"
                    />
                  )}

                  {user.friendship_status == FriendshipStatus.PENDING && (
                    <img
                      src="/images/icons/pending.png"
                      alt="Pending"
                      onClick={() => console.log("Pending clicked")}
                      className="chatpage-icon"
                    />
                  )}

                  {user.friendship_status === FriendshipStatus.FRIEND && (
                    <img
                      src="/images/icons/friend.png"
                      alt="friend"
                      onClick={() => console.log("Already a friend")}
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

      {/* <Routes>
      <Route path="/" element={<Chatpage />} />
      <Route path="/profile" element={<Profile />} />
      </Routes> */}

      {searchView == "settings" && (
        <SettingsSidebar currentUserId = {currentUserId} currentUsername = {currentUsername} socket= {socket} onClose={() => setSearchView("icon")} />
      )}
    </div>
  );
}
