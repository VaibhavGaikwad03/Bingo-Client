import "./css/Chatpage.css";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { MessageTypes } from "./js_files/Status_MessageTypes";
import { FriendshipStatus } from "./js_files/FriendshipStatus";
import SidebarFriendRequests from "./SidebarFriendRequests";
import SettingsSidebar from "./SettingsSidebar";
import FriendsProfile from "./FriendsProfile";
import { toast } from "react-toastify";
import { useIsMobile } from "./hooks/use-mobile";
import FriendsList from "./FriendsList";

export default function Chatpage(props) {
  let {
    socket,
    message,
    setMessage,
    currentNameOfUser,
    currentUsername,
    currentUserId,
    timestamp,
    theme,
    setTheme,
    userFriendsList,
    setUserFriendsList,
    friendRequest,
    setFriendRequest,
    suggestions,
    setSuggestions,
    navigate,
  } = props;

  const isMobile = useIsMobile();

  let [searchView, setSearchView] = useState("icon");
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showRightSidebarFriendList, setShowRightSidebarFriendList] = useState(false);

  // refs to detect clicks inside the chat sidebar or the messages area
  const chatSidebarRef = useRef(null);
  const messagesRef = useRef(null);

  //local friend search
  const [sidebarSearchFriend, setSidebarSearchFriend] = useState("");

  // for selecting chats list from left side of chatpage
  const [isSelectingChats, setIsSelectingChats] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);

  // for selecting messages from right side of chatpage
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isSelectingMessages, setIsSelectingMessages] = useState(false);

  //for performing show hide
  let [chatView, setChatView] = useState(isMobile ? "mobile_home" : "none");
  let [showProfileSidebar, setShowProfileSidebar] = useState(false);
  let [showImageModal, setShowImageModal] = useState(false);
  let [showSidebar, setShowSidebar] = useState(false);

  // for chat img & name
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [modalImageName, setModalImageName] = useState("");

  // variable for translating words according to users choice
  const { t } = useTranslation();

  // usestate for chat input
  let [inputMessage, setInputMessage] = useState("");
  // send button enable toggle
  let [sendEnabled, setSendEnabled] = useState(false);

  // the persons chat selected by user
  let [selectedFriend, setSelectedFriend] = useState(null);

  let [searchUserReq, setSearchUserReq] = useState({});
  let [refreshList, setRefreshList] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);

  // Mobile specific states
  const [showChatList, setShowChatList] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      // only clear chat selection when click is completely outside the chat sidebar
      if (isSelectingChats) {
        if (
          !chatSidebarRef.current ||
          !chatSidebarRef.current.contains(e.target)
        ) {
          setSelectedChats([]);
          setIsSelectingChats(false);
        }
      }

      // only clear message selection when click is completely outside the messages area
      if (isSelectingMessages) {
        if (!messagesRef.current || !messagesRef.current.contains(e.target)) {
          setSelectedMessages([]);
          setIsSelectingMessages(false);
        }
      }
    }

    // Attach listener always (it will check containment before clearing)
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isSelectingChats, isSelectingMessages]);

  // Reset views when switching between mobile and desktop
  useEffect(() => {
    if (isMobile) {
      if (chatView === "none") {
        setChatView("mobile_home");
      }
    } else {
      if (chatView === "mobile_home") {
        setChatView("none");
      }
      setShowChatList(false);
    }
  }, [isMobile]);

  // for deleting the selected chats
  function deleteSelectedChats(e) {
    if (e) e.stopPropagation();
    toast.success(`${selectedChats.length} chats deleted`);
    setUserFriendsList((prev) =>
      prev.filter((chat, idx) => {
        const key = getChatKey(chat, idx);
        return !selectedChats.includes(key);
      })
    );
    setSelectedChats([]);
    setIsSelectingChats(false);
  }

  function getChatKey(chat, index) {
    // stable frontend-only key: prefer chat.id, then chat.user_id, else index
    return chat.id ?? chat.user_id ?? index;
  }

  // for selecting all chats present in chatlist from left side of chatpage
  function selectAllChats(e) {
    if (e) e.stopPropagation();
    const allKeys = (
      userFriendsList && userFriendsList.length ? userFriendsList : dummyChats
    ).map((chat, idx) => getChatKey(chat, idx));
    // toggle all / none
    if (selectedChats.length === allKeys.length && allKeys.length > 0) {
      setSelectedChats([]);
      setIsSelectingChats(false);
    } else {
      setSelectedChats(allKeys);
      setIsSelectingChats(true);
    }
  }

  function toggleChatSelection(chatKey) {
    setSelectedChats((prev) => {
      const exists = prev.includes(chatKey);
      const newSelection = exists
        ? prev.filter((k) => k !== chatKey)
        : [...prev, chatKey];
      setIsSelectingChats(newSelection.length > 0);
      return newSelection;
    });
  }

  const filteredFriends = userFriendsList.filter((friend) => {
    const query = sidebarSearchFriend.toLowerCase();
    return (
      friend.fullname?.toLowerCase().includes(query) ||
      friend.username?.toLowerCase().includes(query)
    );
  });

  //now changed
  function handleSearchIconButtonClick() {
    if (isMobile) {
      // On mobile, switch to search view and hide the mobile home
      setSearchView("search_bar");
      setChatView("search"); // Add this new view state
    } else {
      setSearchView("search_bar");
    }
  }

  function handleTextChange(event) {
    const { name, value } = event.target;

    const updatedMessage = { ...searchUserReq, [name]: value };

    const chatData = {
      message_type: MessageTypes.SEARCH_USER_REQUEST,
      ...updatedMessage,
      username: value.trimStart(),
      requested_by: currentUsername,
    };
    setSearchUserReq(chatData);
    setRefreshList(chatData);

    console.log(JSON.stringify(chatData));
    socket.send(JSON.stringify(chatData));
  }

  function handleAddFriendButtonClick(user) {
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

      console.log(req, "req");
      socket.send(JSON.stringify(req));
      socket.send(JSON.stringify(refreshList));
    } else {
      console.log("WebSocket not connected:", socket?.readyState);
    }
  }

  // for deleting the selected messages from chat
  function deleteSelectedMessages(indices = null) {
    // indices is an array of message indexes to delete.
    const toDelete = indices ?? selectedMessages;
    if (!toDelete || toDelete.length === 0) {
      toast.info("No messages selected");
      return;
    }
    setMessagesState((prev) =>
      prev.filter((m, idx) => !toDelete.includes(idx))
    );
    toast.success(
      `${toDelete.length} message${toDelete.length > 1 ? "s" : ""} deleted`
    );
    setSelectedMessages([]);
    setIsSelectingMessages(false);
  }

  // dummy messages
  const [messagesState, setMessagesState] = useState([
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
  ]);

  function selectAllMessages() {
    if (!messagesState || messagesState.length === 0) return;
    if (selectedMessages.length === messagesState.length) {
      setSelectedMessages([]);
      setIsSelectingMessages(false);
    } else {
      // Otherwise select all
      const allIndices = messagesState.map((_, idx) => idx);
      setSelectedMessages(allIndices);
      setIsSelectingMessages(true);
    }
  }

  function toggleMessageSelection(index) {
    setSelectedMessages((prev) => {
      const newSelection = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index];
      setIsSelectingMessages(newSelection.length > 0);
      return newSelection;
    });
  }

  // temporary dropdown function toast notifications
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
    setActiveMenu(null);
  };

  const handleDeleteFromMenu = (index) => {
    setSelectedMessages([index]);
    setIsSelectingMessages(true);
    setActiveMenu(null);
  };

  const handleForward = (msg) => {
    toast.info("Forward feature coming soon!");
    setActiveMenu(null);
  };

  const handlePin = (index) => {
    toast.info("Pinned!");
    setActiveMenu(null);
  };

  const handleStar = (index) => {
    toast.info("Starred!");
    setActiveMenu(null);
  };

  //mobile
  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend);
    setShowSidebar(false);
    setShowRightSidebar(false);
    setShowRightSidebarFriendList(false);
    // Close search bar automatically when chat is selected
    setSearchView("icon");
    setSearchUserReq({});
    setSuggestions([]);

    if (isMobile) {
      setChatView("chat");
      setShowChatList(false);
      // Update URL
      navigate(`/chatpage?chat=${friend.user_id}`, { replace: true });
    } else {
      setChatView("chat");
    }
  };

  const handleBackFromChat = () => {
    if (isMobile) {
      setChatView("chat_list");
      setShowProfileSidebar(false);
      setShowChatList(true); // Added this to show the chat list
      // Update URL
      navigate("/chatpage?view=chats", { replace: true });
    } else {
      setChatView("none");
      setShowProfileSidebar(false);
    }
  };

  // function pinSelectedChats(e) {
  //   if (e) e.stopPropagation();
  //   setUserFriendsList((prev) => {
  //     let updated = prev.map((chat, idx) => {
  //       const key = getChatKey(chat, idx);
  //       // Toggle pin: if already pinned, unpin; else, pin it
  //       if (selectedChats.includes(key)) {
  //         return { ...chat, pinned: !chat.pinned };
  //       }
  //       return chat;
  //     });
  //     // Sort: pinned chats first, then others
  //     updated.sort((a, b) => {
  //       if (a.pinned === b.pinned) return 0;
  //       return a.pinned ? -1 : 1;
  //     });
  //     return updated;
  //   });
  //   toast.success(`${selectedChats.length} chat(s) ${"pinned/unpinned"}`);
  //   setSelectedChats([]);
  //   setIsSelectingChats(false);
  // }

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex overflow-hidden">
      {/* desktop left side */}
      {!isMobile && searchView != "settings" && (
        <div
          ref={chatSidebarRef}
          className={`chat-sidebar border-end ${
            theme === "dark" ? "bg-dark text-light" : "bg-white"
          }`}
        >
          {/* WhatsApp-style Sidebar Header */}
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h4
              className="m-0 fw-bold"
              style={{ fontFamily: "Lilita One, sans-serif" }}
            >
              Bingo
            </h4>

            <div className="dropdown">
              <i
                className="bi bi-three-dots-vertical font_size_cursor"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></i>

              {/* menu */}
              <ul className="dropdown-menu ">
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <img
                      src="./images/icons/group.png"
                      alt="group_logo"
                      className="me-2 icon-20"
                      style={{
                        filter:
                          theme === "dark" ? "invert(1) brightness(2)" : "none",
                      }}
                    />
                    <span
                      style={{
                        color: theme === "dark" ? "#ffffff" : "#000000",
                      }}
                    >
                      {t("newGroup")}{" "}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <img
                      src="./images/icons/broadcast.png"
                      alt="broadcast_logo"
                      className="me-2 icon-20"
                    />
                    <span
                      style={{
                        color: theme === "dark" ? "#ffffff" : "#000000",
                      }}
                    >
                      {t("newBroadcast")}{" "}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3 position-relative">
            <input
              type="text"
              name="username"
              autoComplete="off"
              className={`form-control form-control-lg ${
                theme === "dark"
                  ? "bg-secondary text-light border-secondary"
                  : ""
              }`}
              placeholder={t("searchUser")}
              value={sidebarSearchFriend}
              onChange={(e) => setSidebarSearchFriend(e.target.value)}
              autoFocus
            />
          </div>

          <div className="p-3">
            <h5 className="mb-3">{t("chats")}</h5>
            {isSelectingChats && selectedChats.length > 0 && (
              <div className="d-flex justify-content-between align-items-center p-2 bg-light border-bottom">
                <span>{selectedChats.length} selected</span>
                <div>
                  {/* <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={pinSelectedChats}
                  >
                    <i className="bi bi-pin-angle"></i>
                    {pinnedChats &&
                    selectedChats.every((id) => pinnedChats.includes(id))
                      ? " Unpin"
                      : " Pin"}
                  </button> */}
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={deleteSelectedChats}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={selectAllChats}
                  >
                    {selectedChats.length === userFriendsList.length
                      ? "Unselect All"
                      : "Select All"}
                  </button>
                </div>
              </div>
            )}

            <ul className="list-group">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((chat, index) => {
                  const idKey = getChatKey(chat, index);
                  const isSelected = selectedChats.includes(idKey);

                  return (
                    <li
                      key={idKey}
                      className={`list-group-item d-flex align-items-center clickable ${
                        theme === "dark" ? "bg-dark text-light" : "bg-white"
                      } ${isSelected ? "bg-info-subtle" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSelectingChats) {
                          toggleChatSelection(idKey);
                        } else {
                          // setSelectedFriend(chat);
                          // setChatView("chat");
                          // setShowProfileSidebar(false);
                          // setShowRightSidebar(false);
                          // handleFriendSelect(chat);
                          handleFriendSelect(chat);
                        }
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        toggleChatSelection(idKey);
                      }}
                    >
                      {isSelectingChats && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleChatSelection(idKey);
                          }}
                          className="me-2"
                        />
                      )}

                      <img
                        src={chat.profilePic || "/images/good_baby_pfp.jpeg"}
                        alt={chat.fullname}
                        className="rounded-circle me-3 img_icon_logo"
                        style={{
                          objectFit: "cover",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalImageSrc(
                            chat.profilePic || "/images/good_baby_pfp.jpeg"
                          );
                          setModalImageName(chat.fullname);
                          setShowImageModal(true);
                        }}
                      />

                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <strong>{chat.fullname}</strong>
                          <small className="text-muted">11:11 pm</small>
                        </div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.9rem" }}
                        >
                          Helloo
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="list-group-item text-center text-muted">
                  No friends found
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {isMobile && showChatList && (
        <div
          ref={chatSidebarRef}
          className={`chat-sidebar border-end w-100 ${
            theme === "dark" ? "bg-dark text-light" : "bg-white"
          }`}
        >
          {/* Back Button Header */}
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <button
              className="btn btn-link text-secondary p-0"
              onClick={() => {
                setChatView("mobile_home");
                setShowChatList(false);
                navigate("/chatpage", { replace: true });
              }}
              style={{ fontSize: "1.25rem", width: "24px" }}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <h4
              className="m-0 fw-bold"
              style={{ fontFamily: "Lilita One, sans-serif" }}
            >
              Bingo
            </h4>

            {/* Right: Three Dots Dropdown for mobile*/}
            <div className="dropdown">
              <i
                className="bi bi-three-dots-vertical font_size_cursor"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></i>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <img
                      src="./images/icons/group.png"
                      alt="group_logo"
                      className="me-2 icon-20"
                      style={{
                        filter:
                          theme === "dark" ? "invert(1) brightness(2)" : "none",
                      }}
                    />
                    <span
                      style={{
                        color: theme === "dark" ? "#ffffff" : "#000000",
                      }}
                    >
                      {t("newGroup")}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <img
                      src="./images/icons/broadcast.png"
                      alt="broadcast_logo"
                      className="me-2 icon-20"
                    />
                    <span
                      style={{
                        color: theme === "dark" ? "#ffffff" : "#000000",
                      }}
                    >
                      {t("newBroadcast")}{" "}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3 position-relative">
            <input
              type="text"
              name="username"
              autoComplete="off"
              className={`form-control form-control-lg ${
                theme === "dark"
                  ? "bg-secondary text-light border-secondary"
                  : ""
              }`}
              placeholder={t("searchUser")}
              value={sidebarSearchFriend}
              onChange={(e) => setSidebarSearchFriend(e.target.value)}
            />
          </div>

          <div className="p-3">
            <h5 className="mb-3">{t("chats")}</h5>
            <ul className="list-group">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((chat, index) => {
                  const idKey = getChatKey(chat, index);

                  return (
                    <li
                      key={idKey}
                      className={`list-group-item d-flex align-items-center clickable ${
                        theme === "dark" ? "bg-dark text-light" : "bg-white"
                      }`}
                      onClick={() => handleFriendSelect(chat)}
                    >
                      <img
                        src={chat.profilePic || "/images/good_baby_pfp.jpeg"}
                        alt={chat.fullname}
                        className="rounded-circle me-3 img_icon_logo"
                        style={{ objectFit: "cover" }}
                      />

                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <strong>{chat.fullname}</strong>
                          <small className="text-muted">11:11 pm</small>
                        </div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.9rem" }}
                        >
                          Helloo
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="list-group-item text-center text-muted">
                  No friends found
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Mobile Home Screen */}
      {isMobile && chatView === "mobile_home" && (
        <div
          className="flex-grow-1 d-flex flex-column"
          style={{
            background: theme === "dark" ? "#121212" : "white",
            height: "100vh",
          }}
        >
          <div className="d-flex justify-content-end align-items-center p-3 border-bottom">
            <div className="d-flex align-items-center gap-3">
              <img
                src="/images/icons/chat.png"
                alt="chat_logo"
                className="me-1 img_icon_logo"
                onClick={() => {
                  if (isMobile) {
                    setShowChatList(true);
                    setChatView("chat_list");
                    setShowSidebar(false);
                    navigate("/chatpage?view=chats", { replace: true });
                  }
                }}
                style={{ cursor: "pointer" }}
              />
              <img
                src="/images/icons/search.png"
                alt="search_logo"
                className="img_icon_logo"
                title="Search"
                onClick={handleSearchIconButtonClick}
              />
              <img src="/images/icons/user.png" alt="profile"
              title="Profile"
              className="img_icon_logo"
              onClick={()=> navigate("/profile")}
              />
              <div className="position-relative">
                <img
                  src="/images/icons/friend-request.png"
                  alt="friend_req_logo"
                  title={t("friendRequests")}
                  className="img_icon_logo"
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
              {/* <img
                src="/images/icons/bff.png"
                alt="friend_list"
                className="img_icon_logo me-2"
                title="FriendList"
                onClick={() => setShowRightSidebarFriendList(true)}
              /> */}
              <i
                className="bi bi-three-dots-vertical clickable"
                title="More"
                style={{ fontSize: "1.5rem" }}
                onClick={() => setShowRightSidebar(true)}
              ></i>
            </div>
          </div>
          {/* content for mobile screen */}
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center p-3">
            <img
              className="img-fluid"
              src="./images/BingoLogo.png"
              alt="chatlogo"
              style={{
                maxHeight: "100px",
                filter: "drop-shadow(0 0 15px #ff00ff)",
                animation: "floatLogo 4s ease-in-out infinite",
              }}
            />
            <h4 className="mb-2">Welcome to Bingo</h4>
          </div>
        </div>
      )}

      {/* Search View */}
      {searchView === "search_bar" && (
        <div
          className={`flex-grow-1 d-flex flex-column ${
            isMobile ? "w-100" : "w-100"
          }`}
          style={{
            overflowY: "auto",
            background: theme === "dark" ? "#121212" : "white",
            height: isMobile ? "100vh" : "100vh", // Full height on both
          }}
        >
          <div className={`position-relative ${isMobile ? "p-3" : "p-3"}`}>
            <input
              type="text"
              name="username"
              autoComplete="off"
              className={`form-control form-control-lg ${
                theme === "dark"
                  ? "bg-secondary text-light border-secondary"
                  : ""
              }`}
              value={searchUserReq.username || ""}
              placeholder={t("searchUser")}
              onChange={handleTextChange}
              autoFocus
            />
            <i
              className="bi bi-x-circle-fill text-danger position-absolute font_size_cursor"
              style={{
                top: "50%",
                right: "25px",
                transform: "translateY(-50%)",
              }}
              onClick={() => {
                setSearchUserReq({});
                setSuggestions([]);
                setSearchView("icon");
                if (isMobile) {
                  setChatView("mobile_home");
                }
              }}
            ></i>
          </div>

          {suggestions.length > 0 && (
            <div className={isMobile ? "px-3" : "px-3"}>
              <ul
                className={`suggestion-list list-group ${
                  isMobile ? "w-100" : "w-100 px-3"
                } shadow`}
              >
                {suggestions.map((user) => (
                  <li
                    key={user.user_id}
                    className={`list-group-item list-group-item-action clickable d-flex justify-content-between align-items-center ${
                      theme === "dark" ? "bg-dark text-light" : "bg-white"
                    }`}
                  >
                    <div>
                      <h5 className="">{user.display_name}</h5>
                      <em className="fs-6 ms-1">{user.username}</em>
                    </div>

                    {user.friendship_status === FriendshipStatus.NOT_FRIEND && (
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
            </div>
          )}

          {/* Show empty state when no suggestions */}
          {suggestions.length === 0 && (
            <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center p-3">
              <p className="text-muted">Search for users to add as friends</p>
            </div>
          )}
        </div>
      )}

      {/* Chat view- right side */}
      {chatView == "chat" && (
        <div className={`d-flex flex-grow-1 ${isMobile ? "w-100" : ""}`}>
          <div
            className="flex-grow-1 d-flex flex-column"
            style={{
              overflowY: "auto",
              background: theme === "dark" ? "#121212" : "white",
              height: "100vh",
            }}
          >
            {/* chat header */}
            <div
              className="d-flex align-items-center p-3 border-bottom"
              style={{
                backgroundColor: theme === "dark" ? "#1e1e1e" : "white",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
            >
              <button
                className="btn btn-link text-secondary me-2"
                onClick={handleBackFromChat}
                style={{ fontSize: "1.25rem" }}
                aria-label="Back"
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <img
                src={selectedFriend?.profilePic || "/images/good_baby_pfp.jpeg"}
                alt={selectedFriend?.fullname || "Profile"}
                className="rounded-circle me-3 img_icon_logo"
                style={{ objectFit: "cover" }}
                onClick={() => setShowProfileSidebar(true)}
              />

              <div
                className="flex-grow-1"
                onClick={() => setShowProfileSidebar(true)}
              >
                <div
                  className="fw-bold"
                  style={{
                    fontSize: "1.1rem",
                    color: theme === "dark" ? "#ffffff" : "#000000",
                  }}
                >
                  {selectedFriend?.fullname || "Contact Name"}
                </div>
                <div
                  className="text-muted"
                  style={{
                    fontSize: "0.85rem",
                    color: theme === "dark" ? "#adb5bd" : "#6c757d",
                  }}
                >
                  online
                </div>
              </div>

              <div className="d-flex align-items-center gap-3">
                <img
                  src="./images/icons/video_call.png"
                  alt="video_call_logo"
                  title="Video Call"
                  style={{
                    width: "30px",
                    height: "30px",
                    filter:
                      theme === "dark" ? "invert(1) brightness(2)" : "none",
                  }}
                  className="me-2 "
                />
                <img
                  src="./images/icons/call.png"
                  alt="call_logo"
                  title="Call"
                  className="me-2 icon-20"
                  style={{
                    filter:
                      theme === "dark" ? "invert(1) brightness(2)" : "none",
                  }}
                />

                <div className="dropdown">
                  <i
                    className="bi bi-three-dots-vertical text-secondary font_size_cursor"
                    title="Menu"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      color: theme === "dark" ? "#ffffff" : "#6c757d",
                    }}
                  ></i>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center"
                        type="button"
                      >
                        <img
                          src="./images/icons/clear_chat.png"
                          alt="clear_chat"
                          className="me-2 icon-20"
                        />
                        <span
                          style={{
                            color: theme === "dark" ? "#ffffff" : "#000000",
                          }}
                        >
                          {t("clearChat")}
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center"
                        type="button"
                      >
                        <img
                          src="./images/icons/block.png"
                          alt="block_logo"
                          className="me-2 icon-20"
                        />
                        <span
                          style={{
                            color: theme === "dark" ? "#ffffff" : "#000000",
                          }}
                        >
                          {t("block")}{" "}
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center"
                        type="button"
                      >
                        <img
                          src="./images/icons/report.png"
                          alt="report_logo"
                          className="me-2 icon-20"
                        />
                        <span
                          style={{
                            color: theme === "dark" ? "#ffffff" : "#000000",
                          }}
                        >
                          {t("report")}{" "}
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {isSelectingMessages && selectedMessages.length > 0 && (
              <div className="d-flex justify-content-between align-items-center p-2 bg-light border-bottom">
                <span>{selectedMessages.length} selected</span>
                <div>
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={deleteSelectedMessages}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={selectAllMessages}
                  >
                    {selectedMessages.length === messagesState.length
                      ? "Unselect All"
                      : "Select All"}
                  </button>
                </div>
              </div>
            )}

            {/* message list */}
            <div
              className="flex-grow-1 d-flex flex-column p-3"
              style={{
                overflowY: "auto",
                background: theme === "dark" ? "#121212" : "white",
              }}
              ref={messagesRef}
            >
              {messagesState.map((message, index) => (
                <div
                  key={message.id || message.timestamp}
                  className={`d-flex ${
                    message.isSent
                      ? "justify-content-end"
                      : "justify-content-start"
                  } mb-2`}
                >
                  {isSelectingMessages && (
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(index)}
                      onChange={(e) => {
                        toggleMessageSelection(index);
                      }}
                      className="me-2"
                    />
                  )}
                  <div className="message-container">
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
                    <i
                      className="bi bi-caret-down-fill message-options-trigger "
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === index ? null : index);
                      }}
                      title="Options"
                    ></i>
                    {activeMenu === index && (
                      <div
                        className="message-options-menu"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="dropdown-item"
                          onClick={() => handleCopy(message.text)}
                        >
                          Copy
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => handleDeleteFromMenu(index)}
                        >
                          Delete
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => handleForward(message)}
                        >
                          Forward
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => handlePin(index)}
                        >
                          Pin
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => handleStar(index)}
                        >
                          Star
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* message input */}
            <div
              className="d-flex align-items-center mt-1 mb-2 border-top pt-2 px-2" //changed
              style={{
                backgroundColor: theme === "dark" ? "#1e1e1e" : "#f8f9fa",
              }}
            >
              <div className="flex-grow-1 position-relative me-2">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Type a message"
                  value={inputMessage}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInputMessage(val);
                    setSendEnabled(val.trim().length > 0);
                  }}
                />
                <div
                  className="dropdown position-absolute"
                  style={{
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                  }}
                >
                  <i
                    className="bi bi-paperclip fs-4 clickable"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      filter:
                        theme === "dark" ? "invert(1) brightness(2)" : "none",
                    }}
                  ></i>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        style={{
                          color: theme === "dark" ? "#ffffff" : "#000000",
                        }}
                      >
                        📷 {t("photo")}
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        style={{
                          color: theme === "dark" ? "#ffffff" : "#000000",
                        }}
                      >
                        📍 {t("location")}
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        style={{
                          color: theme === "dark" ? "#ffffff" : "#000000",
                        }}
                      >
                        📄 {t("document")}
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        style={{
                          color: theme === "dark" ? "#ffffff" : "#000000",
                        }}
                      >
                        📊 {t("poll")}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                className="btn btn-primary"
                disabled={!sendEnabled}
                onClick={() => {
                  console.log("Send:", inputMessage);
                  setInputMessage("");
                  setSendEnabled(false);
                }}
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Default View when no chat selected and not in search */}
      {!isMobile && chatView === "none" && searchView !== "search_bar" && (
        <div
          ref={messagesRef}
          className="flex-grow-1 d-flex flex-column p-3"
          style={{
            overflowY: "auto",
            background: theme === "dark" ? "#121212" : "white",
          }}
        >
          {/* Only show icons when not in search mode */}
          {searchView === "icon" && (
            <div className="d-flex justify-content-end align-items-center mb-3 me-3">
              <img
                src="/images/icons/search.png"
                alt="search_logo"
                className="me-4 img_icon_logo"
                title="Search"
                onClick={handleSearchIconButtonClick}
              />
              <img src="/images/icons/user.png" alt="profile"
              title="Profile"
              className="img_icon_logo me-4"
              onClick={()=> navigate("/profile")}
              />
              <div className="position-relative me-4 img_icon_logo">
                <img
                  src="/images/icons/friend-request.png"
                  alt="friend_req_logo "
                  title={t("friendRequests")}
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

              {/* <img
                src="/images/icons/bff.png"
                alt="friend_list"
                className="img_icon_logo me-2"
                title="FriendList"
                onClick={() => setShowRightSidebarFriendList(true)}
              /> */}
              <i
                className="bi bi-three-dots-vertical mt-2 mb-2 me-3 clickable"
                title="More"
                style={{ fontSize: "2rem" }}
                onClick={() => setShowRightSidebar(true)}
              ></i>
            </div>
          )}

          {/* Desktop default content */}
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center">
            <img
              className="img-fluid"
              src="./images/BingoLogo.png"
              alt="chatlogo"
              style={{
                maxHeight: "120px",
                filter: "drop-shadow(0 0 15px #ff00ff)",
                animation: "floatLogo 4s ease-in-out infinite",
              }}
            />
            <h3>Welcome to Bingo</h3>
          </div>
        </div>
      )}

      {/* Modal and Sidebars */}
      {showSidebar && (
        <SidebarFriendRequests
          setShowSidebar={setShowSidebar}
          setUserFriendsList={setUserFriendsList}
          setFriendRequest={setFriendRequest}
          friendRequest={friendRequest}
          theme={theme}
          socket={socket}
          onAccept={(user) => console.log("Accepted:", user)}
          onDecline={(user) => console.log("Declined:", user)}
        />
      )}

      {showProfileSidebar && (
        <FriendsProfile
          selectedFriend={selectedFriend}
          setShowProfileSidebar={setShowProfileSidebar}
          theme={theme}
          setShowImageModal={setShowImageModal}
          setModalImageSrc={setModalImageSrc}
          isMobile={isMobile}
          onBack={() => {
            setShowProfileSidebar(false);
            if (isMobile) {
              setChatView("chat");
            }
          }}
        />
      )}

      {showRightSidebarFriendList && (
        <div
          className={`position-fixed top-0 end-0 h-100 shadow bg-${
            theme === "dark" ? "dark text-light" : "white"
          }`}
          style={{
            width: isMobile ? "100%" : "320px",
            zIndex: 9999,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="m-0">Friend List</h5>
            <button
              className="btn btn-link text-danger"
              onClick={() => setShowRightSidebarFriendList(false)}
            >
              ✕
            </button>
          </div>
          <div className="p-3 overflow-auto h-100">
            <FriendsList
              navigate={navigate}
              theme={theme}
              setTheme={setTheme}
              onClose={() => setShowRightSidebarFriendList(false)}
            />
          </div>
        </div>
      )}

      {showRightSidebar && (
        <div
          className={`position-fixed top-0 end-0 h-100 shadow bg-${
            theme === "dark" ? "dark text-light" : "white"
          }`}
          style={{
            width: isMobile ? "100%" : "320px",
            zIndex: 9999,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="m-0">Settings</h5>
            <button
              className="btn btn-link text-danger"
              onClick={() => setShowRightSidebar(false)}
            >
              ✕
            </button>
          </div>
          <div className="p-3 overflow-auto h-100">
            <SettingsSidebar
              navigate={navigate}
              message={message}
              setMessage={setMessage}
              theme={theme}
              setTheme={setTheme}
              currentUserId={currentUserId}
              currentUsername={currentUsername}
              socket={socket}
              onClose={() => setShowRightSidebar(false)}
            />
          </div>
        </div>
      )}

      {showImageModal && (
        <div
          className="modal-overlay img_modal"
          onClick={() => setShowImageModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="img_modal_2">
            <button
              onClick={() => setShowImageModal(false)}
              className="modal-close-button"
              aria-label="Close"
            >
              &times;
            </button>
            <h5 className="text-center my-2">{modalImageName}</h5>
            <img src={modalImageSrc} alt="Profile" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}
