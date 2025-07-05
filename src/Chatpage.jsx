import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MessageTypes } from "./Status_MessageTypes";
import { FriendshipStatus } from "./FriendshipStatus";
import { i } from "framer-motion/client";

export default function Chatpage(props) {
  let { socket } = props;
  let { requestingUser } = props;
   let {suggestions}= props;
  const navigate = useNavigate();
  let [chatMessage, setChatMessage] = useState({});
  let [searchView, setSearchView] = useState("icon");
  let [friendRequest, setFriendRequest] = useState();

  // let [suggestions, setSuggestions] = useState([]);

  let [allUsers, setAllUsers] = useState([]);

  // const mockSearchResponse = {
  //   message_type: "SEARCH_USER_RESPONSE",
  //   count: 2,
  //   users: [
  //     {
  //       user_id: "21",
  //       username: "vaibhav.g",
  //       display_name: "Vaibhav Gaikwad",
  //       friendship_status: "FRIEND",
  //     },
  //     {
  //       user_id: "3",
  //       username: "test",
  //       display_name: "test user",
  //       friendship_status: "FRIEND",
  //     },

  //     {
  //       user_id: "36",
  //       username: "vibha",
  //       display_name: "vibhav user",
  //       friendship_status: "PENDING",
  //     },
  //     {
  //       user_id: "31",
  //       username: "vaibh",
  //       display_name: "Vaibhav",
  //       friendship_status: "NOT_FRIEND",
  //     },
  //   ],
  // };

  // useEffect(() => {
  //   if (mockSearchResponse.message_type === "SEARCH_USER_RESPONSE") {
  //     setAllUsers(mockSearchResponse.users);
  //   }
  // }, []);

  function handleSearchIconButtonClick() {
    setSearchView("search_bar");
  }

  function handleTextChange(event) {
    const { name, value } = event.target;
    const updatedMessage = { ...chatMessage, [name]: value };
    setChatMessage(updatedMessage);

    const chatData = {
      message_type: MessageTypes.SEARCH_USER_REQUEST,
      ...updatedMessage,
      requested_by: requestingUser,
    };

    console.log(JSON.stringify(chatData));
    socket.send(JSON.stringify(chatData));

    //comment the part under this
    // socket.send(JSON.stringify(chatMessage));
    // if (value.trim() === "") {
    //   setSuggestions([]);
    // } else {
    //   const filtered = allUsers.filter((user) =>
    //     user.username.toLowerCase().startsWith(value.toLowerCase())
    //   );
    //   setSuggestions(filtered);
    // }

  }

  // function handleSuggestionClick(user) {
  //   setChatMessage({
  //     ...chatMessage,
  //     username: user.username,
  //     display_name: user.display_name,
  //     user_id: user.user_id,
  //   });
  //   setSuggestions([]);
  // }

  // end of comment

  function handleAddFriendButtonClick(user) {
    alert("Friend Request Sent to " + user.display_name);
    props.onAddFriendButtonClick(user);
  }

  return (
    <div className="position-fixed top-0 start-0 w-100 pt-4 p-3 ps-5 pe-5 z-3">
      {searchView == "icon" && (
        <div className="d-flex justify-content-end me-4">
          <i
            className="bi bi-search"
            style={{ fontSize: "2rem", cursor: "pointer" }}
            onClick={handleSearchIconButtonClick}
          ></i>
        </div>
      )}

      {searchView == "search_bar" && (
        <div className="position-relative">
          <input
            type="text"
            name="username"
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
              // setSuggestions([]);
              setSearchView("icon");
            }}
          ></i>

          {suggestions.length > 0 && (
            <ul className="list-group position-absolute w-100 mt-1 shadow ">
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
                      src="/images/add_friend.png"
                      alt="add_friend"
                      onClick={() => handleAddFriendButtonClick(user)}
                      style={{
                        width: "3.5rem",
                        height: "3.5rem",
                        cursor: "pointer",
                        marginRight: "0.2rem",
                      }}
                    />
                  )}

                  {user.friendship_status == FriendshipStatus.PENDING && (
                    <img
                      src="/images/pending.png"
                      alt="Pending"
                      onClick={() => console.log("Pending clicked")}
                      style={{
                        width: "3.5rem",
                        height: "3.5rem",
                        cursor: "pointer",
                        marginRight: "0.2rem",
                      }}
                    />
                  )}

                  {user.friendship_status === FriendshipStatus.FRIEND && (
                    <img
                      src="/images/friend.png"
                      alt="friend"
                      onClick={() => console.log("Already a friend")}
                      style={{
                        width: "3.5rem",
                        height: "3.5rem",
                        cursor: "pointer",
                        marginRight: "0.2rem",
                      }}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
