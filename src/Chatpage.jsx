import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MessageTypes } from "./Status_MessageTypes";


export default function Chatpage(props) {
    let {socket} = props;
    let {requestingUser} = props;
    let {suggestions}= props;
  const navigate = useNavigate();
  let [chatMessage, setChatMessage] = useState({});
  let [searchView, setSearchView] = useState("icon");
  // let [suggestions, setSuggestions] = useState([]);
  let [allUsers, setAllUsers] = useState([]);

//   const mockSearchResponse = {
//     message_type: "SEARCH_USER_RESPONSE",
//     count: 2,
//     users: [
//       {
//         user_id: "21",
//         username: "vaibhav.g",
//         username: "Vaibhav Gaikwad"
//       },
//       {
//         user_id: "3",
//         username: "test",
//         username: "test user"
//       },
      
//       {
//         user_id: "36",
//         username: "vibha",
//         username: "vibhav user"
//       },
//       {
//         user_id: "31",
//         username: "vaibh",
//         username: "Vaibhav"
//       }
//     ]
//   };

//   useEffect(() => {
//     if (mockSearchResponse.message_type === "SEARCH_USER_RESPONSE") {
//       setAllUsers(mockSearchResponse.users);
//     }
//   }, []);

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
    requested_by : requestingUser
};

      // console.log(chatData);
      socket.send(JSON.stringify(chatData));

    // socket.send(JSON.stringify(chatMessage))
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
  //     username: user.username,
  //     user_id: user.user_id
  //   });
  //   setSuggestions([]);
  // }

  return (
    <div className="position-fixed top-0 start-0 w-100 pt-4 p-3 ps-5 pe-5 z-3" >
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
          {suggestions.length > 0 && (
            <ul className="list-group position-absolute w-100 mt-1 shadow ">
              {suggestions.map((user) => (
                <li
                  key={user.user_id}
                  className="list-group-item list-group-item-action"
                  // onClick={() => handleSuggestionClick(user)}
                  style={{ cursor: "pointer" }}
                >
                  <h5 className="">{user.username}</h5>
                  <em className="fs-6 ms-1">{user.username}</em>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

