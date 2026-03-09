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
import ProfilePhoto from "./ProfilePhoto";
import PollMessage from "./PollMessage";
import StarredMessages from "./StarredMessages";
import NewGroup from "./NewGroup.jsx";
import
  {
    ConversationTypes,
    ContentTypes,
    MessageStatus,
  } from "./js_files/Status_MessageTypes";
import EmojiPicker from "emoji-picker-react";

export default function Chatpage(props)
{
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
    setShowImageModal,
    showImageModal,
    // eslint-disable-next-line no-unused-vars
    responseId,
    // eslint-disable-next-line no-unused-vars
    chatMessage,
  } = props;

  const isMobile = useIsMobile();

  let [searchView, setSearchView] = useState("icon");
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showRightSidebarFriendList, setShowRightSidebarFriendList] =
    useState(false);

  // refs to detect clicks inside the chat sidebar or the messages area
  const chatSidebarRef = useRef(null);
  const messagesRef = useRef(null);

  // for type a message input
  const messageInputRef = useRef(null);

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

  const galleryRef = useRef(null);

  //for Poll
  let [poll, setPoll] = useState(false);

  //starred messages sidebar
  let [openStarred, setOpenStarred] = useState(false);

  // For new group option open and close
  const [showNewGroup, setShowNewGroup] = useState(false);

  // for chat message send
  let [receiverUserId, setReceiverUserId] = useState(-1);

  // for showing emojis
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // set reply message display
  let [isReply, setIsReply] = useState(0);
  let [replyMessageId, setReplyMessageId] = useState(-1);
  let [replyMessageContent, setReplyMessageContent] = useState("");

  useEffect(() =>
  {
    function handleClickOutside(e)
    {
      // only clear chat selection when click is completely outside the chat sidebar
      if (isSelectingChats)
      {
        if (
          !chatSidebarRef.current ||
          !chatSidebarRef.current.contains(e.target)
        )
        {
          setSelectedChats([]);
          setIsSelectingChats(false);
        }
      }

      // only clear message selection when click is completely outside the messages area
      if (isSelectingMessages)
      {
        if (messagesRef.current && !messagesRef.current.contains(e.target))
        {
          // ignore clicks on the message-selection header
          if (e.target.closest(".message-select-header")) return;

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
  useEffect(() =>
  {
    if (isMobile)
    {
      if (chatView === "none")
      {
        setChatView("mobile_home");
      }
    } else
    {
      if (chatView === "mobile_home")
      {
        setChatView("none");
      }
      setShowChatList(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Whenever the active chat user changes, hide the profile details
  useEffect(() =>
  {
    setShowProfileSidebar(false);
    setShowEmojiPicker(false);
  }, [selectedFriend?.user_id]);

  // for deleting the selected chats
  function deleteSelectedChats(e)
  {
    if (e) e.stopPropagation();
    toast.success(`${selectedChats.length} chats deleted`);
    setUserFriendsList((prev) =>
      prev.filter((chat, idx) =>
      {
        const key = getChatKey(chat, idx);
        return !selectedChats.includes(key);
      }),
    );
    setSelectedChats([]);
    setIsSelectingChats(false);
  }

  useEffect(() =>
  {
    if (!chatMessage || !chatMessage.chat_message_id) return;
    if (!selectedFriend) return;

    const newMessage = {
      chat_message_id: chatMessage.chat_message_id,
      sender_id: chatMessage.sender_id,
      receiver_id: chatMessage.receiver_id,
      content: chatMessage.content,
      content_type: chatMessage.content_type,
      message_status: chatMessage.message_status,
      is_reply_message: chatMessage.is_reply_message,
      replied_message_id: chatMessage.replied_message_id,
      timestamp: chatMessage.timestamp,
      isStared: false,
      isPinned: false,
    };

    // 🔥 IMPORTANT — NO FILTERING
    setMessagesState((prev) => [...prev, newMessage]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessage]);

  function getChatKey(chat, index)
  {
    // stable frontend-only key: prefer chat.id, then chat.user_id, else index
    return chat.id ?? chat.user_id ?? index;
  }

  // for selecting all chats present in chatlist from left side of chatpage
  function selectAllChats(e)
  {
    if (e) e.stopPropagation();
    const allKeys = (
      userFriendsList && userFriendsList.length ? userFriendsList : []
    ).map((chat, idx) => getChatKey(chat, idx));
    // toggle all / none
    if (selectedChats.length === allKeys.length && allKeys.length > 0)
    {
      setSelectedChats([]);
      setIsSelectingChats(false);
    } else
    {
      setSelectedChats(allKeys);
      setIsSelectingChats(true);
    }
  }

  function toggleChatSelection(chatKey)
  {
    setSelectedChats((prev) =>
    {
      const exists = prev.includes(chatKey);
      const newSelection = exists
        ? prev.filter((k) => k !== chatKey)
        : [...prev, chatKey];
      setIsSelectingChats(newSelection.length > 0);
      return newSelection;
    });
  }

  const filteredFriends = userFriendsList.filter((friend) =>
  {
    const query = sidebarSearchFriend.toLowerCase();
    return (
      friend.fullname?.toLowerCase().includes(query) ||
      friend.username?.toLowerCase().includes(query)
    );
  });

  //now changed
  function handleSearchIconButtonClick()
  {
    if (isMobile)
    {
      // On mobile, switch to search view and hide the mobile home
      setSearchView("search_bar");
      setChatView("search"); // Add this new view state
    } else
    {
      setSearchView("search_bar");
    }
  }

  function handleTextChange(event)
  {
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

  function handleAddFriendButtonClick(user)
  {
    toast.info(`Friend request sent to  ${user.username}`);
    if (socket && socket.readyState === WebSocket.OPEN)
    {
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
    } else
    {
      console.log("WebSocket not connected:", socket?.readyState);
    }
  }

  // for deleting the selected messages from chat
  function deleteSelectedMessages(ids)
  {
    let toDelete = [];
    // Case 1: delete from dropdown → message.id is passed directly
    if (ids && !Array.isArray(ids))
    {
      toDelete = [ids]; // convert single id to array
    }
    // Case 2: delete selected messages
    else if (Array.isArray(ids))
    {
      toDelete = ids;
    }
    // Case 3: delete button pressed normally
    else
    {
      toDelete = selectedMessages;
    }

    if (!Array.isArray(toDelete))
    {
      console.error("deleteSelectedMessages received non-array:", toDelete);
      return;
    }
    if (toDelete.length === 0)
    {
      toast.info("No messages selected");
      return;
    }
    setMessagesState((prev) =>
      prev.filter((msg) => !toDelete.includes(msg.id)),
    );

    toast.success(`${toDelete.length} message(s) deleted`);
    setSelectedMessages([]);
    setIsSelectingMessages(false);
  }

  // dummy messages
  const [messagesState, setMessagesState] = useState([
    {
      chat_message_id: 1,
      sender_id: receiverUserId,
      receiver_id: currentUserId,
      content: "Hey, what's up?",
      timestamp: "2026-01-17T10:10:43.800Z",
      isSent: false,
      isStared: true,
      isPinned: false,
    },
    {
      chat_message_id: 2,
      sender_id: currentUserId,
      receiver_id: receiverUserId,
      content: "Not much, just working. You?",
      timestamp: "2026-01-17T10:11:43.800Z",
      isSent: true,
      isStared: true,
      isPinned: false,
    },
    {
      chat_message_id: 3,
      sender_id: receiverUserId,
      receiver_id: currentUserId,
      content: "Same here. Any plans for the weekend?",
      timestamp: "2026-01-17T10:14:43.800Z",
      isSent: false,
      isStared: false,
      isPinned: false,
    },
    {
      chat_message_id: 4,
      sender_id: currentUserId,
      receiver_id: receiverUserId,
      content: "Thinking of going to the beach. Wanna join?",
      timestamp: "2026-01-17T10:15:43.800Z",
      isSent: true,
      isStared: false,
      isPinned: false,
    },
    {
      chat_message_id: 5,
      sender_id: receiverUserId,
      receiver_id: currentUserId,
      content: "Sounds great! Let me know the details.",
      timestamp: "2026-01-17T10:17:43.800Z",
      isSent: false,
      isStared: true,
      isPinned: false,
    },
  ]);

  function selectAllMessages()
  {
    if (!messagesState || messagesState.length === 0) return;

    const allIds = messagesState.map((msg) => msg.id);

    if (selectedMessages.length === allIds.length)
    {
      setSelectedMessages([]);
      // setIsSelectingMessages(false);
    } else
    {
      setSelectedMessages(allIds);
      setIsSelectingMessages(true);
    }
  }

  function toggleMessageSelection(id)
  {
    setSelectedMessages((prev) =>
    {
      const newSelection = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      setIsSelectingMessages(newSelection.length > 0);
      return newSelection;
    });
  }

  // temporary dropdown function toast notifications
  const handleCopy = (content) =>
  {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
    setActiveMenu(null);
  };

  const handleDeleteFromMenu = (id) =>
  {
    // setSelectedMessages([index]);
    setIsSelectingMessages(true);
    setActiveMenu(null);
    toggleMessageSelection(id);
  };

  // eslint-disable-next-line no-unused-vars
  const handleForward = (msg) =>
  {
    toast.info("Forward feature coming soon!");
    setActiveMenu(null);
  };

  const handlePin = (msgId) =>
  {
    setMessagesState((prev) =>
    {
      const isCurrentlyPinned = prev.find((m) => m.id === msgId)?.isPinned;
      if (isCurrentlyPinned)
      {
        toast.info("Message unpinned");
      } else
      {
        toast.success("Message pinned");
      }

      return prev.map((msg) => ({
        ...msg,
        isPinned: msg.id === msgId ? !msg.isPinned : false,
      }));
    });

    setActiveMenu(null);
  };

  const handleStar = (index) =>
  {
    setMessagesState((prevMessages) =>
      prevMessages.map((msg, i) =>
        i === index ? { ...msg, isStared: !msg.isStared } : msg,
      ),
    );

    const isNowStarred = !messagesState[index].isStared;
    toast.info(isNowStarred ? "Starred!" : "Unstarred!");
    setActiveMenu(null);
  };

  const handleReply = (index, content) =>
  {
    setIsReply(1);
    setReplyMessageId(index);
    setReplyMessageContent(content || "");
    setActiveMenu(null);
  };

  //mobile
  const handleFriendSelect = (friend) =>
  {
    setSelectedFriend(friend);
    setReceiverUserId(friend.user_id);
    // Close search bar automatically when chat is selected
    setSearchView("icon");
    setSearchUserReq({});
    setSuggestions([]);
    setShowRightSidebar(false);
    setShowSidebar(false);
    if (isMobile)
    {
      setChatView("chat");
      setShowChatList(false);
      // Update URL
      navigate(`/chatpage?chat=${friend.user_id}`, { replace: true });
    } else
    {
      setChatView("chat");
    }
  };

  const handleBackFromChat = () =>
  {
    setSelectedFriend(null);
    setShowProfileSidebar(false);
    if (isMobile)
    {
      setChatView("chat_list");
      setShowChatList(true); // Added this to show the chat list
      // Update URL
      navigate("/chatpage?view=chats", { replace: true });
    } else
    {
      setChatView("none");
    }
  };

  const formatTimeOnly = (isoString) =>
  {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // function handleSendMessage() {
  //   if (!inputMessage.trim()) return;

  //   const newMessage1 = {
  //     message_type: MessageTypes.GET_CHAT_MESSAGE_ID_REQUEST,
  //     user_id: currentUserId,
  //   };
  //   console.log("newmsg 1 : ", newMessage1);
  //   socket.send(JSON.stringify(newMessage1));

  //   const newMessage2 = {
  //     chat_message_id: responseId,
  //     message_type: MessageTypes.CHAT_MESSAGE,
  //     conversation_type: ConversationTypes.PERSONAL,
  //     sender_id: currentUserId,
  //     receiver_id: receiverUserId,
  //     content_type: ContentTypes.TEXT,
  //     content: inputMessage,
  //     message_status: MessageStatus.SENT,
  //     is_reply_message: isReply,
  //     replied_message_id: replyMessageId,
  //     timestamp: timestamp,
  //   };
  //   console.log(newMessage2, "newMessage");
  //   socket.send(JSON.stringify(newMessage2));

  //   setMessagesState((prev) => [...prev, newMessage2]);
  //   setInputMessage("");
  //   setSendEnabled(false);
  //   setShowEmojiPicker(false);
  //   setIsReply(0);
  //   setReplyMessageId(-1);
  //   // setReplyMessageContent("");
  // }

  function getChatMessageId()
  {
    return new Promise((resolve) =>
    {
      const request = {
        message_type: MessageTypes.GET_CHAT_MESSAGE_ID_REQUEST,
        user_id: currentUserId,
      };

      socket.send(JSON.stringify(request));
      console.log(request, "request");

      function handleResponse(event)
      {
        const data = JSON.parse(event.data);

        if (data.message_type === MessageTypes.GET_CHAT_MESSAGE_ID_RESPONSE)
        {
          socket.removeEventListener("message", handleResponse);
          resolve(data.chat_message_id);
        }
      }

      socket.addEventListener("message", handleResponse);
    });
  }

  async function handleSendMessage()
  {
    if (!inputMessage.trim()) return;

    const chatMessageId = await getChatMessageId();

    const newMessage = {
      chat_message_id: chatMessageId,
      message_type: MessageTypes.CHAT_MESSAGE,
      conversation_type: ConversationTypes.PERSONAL,
      sender_id: currentUserId,
      receiver_id: receiverUserId,
      content_type: ContentTypes.TEXT,
      content: inputMessage,
      message_status: MessageStatus.SENT,
      is_reply_message: isReply,
      replied_message_id: replyMessageId,
      timestamp: timestamp,
    };

    socket.send(JSON.stringify(newMessage));
    setMessagesState((prev) => [...prev, newMessage]);
    console.log("newmsg 2:", newMessage);

    setInputMessage("");
    setSendEnabled(false);
    setShowEmojiPicker(false);
    setIsReply(0);
    setReplyMessageId(-1);
  }

  const handleGallery = () =>
  {
    if (galleryRef.current)
    {
      galleryRef.current.click();
    }
  };

  function handlePollButtonClick()
  {
    setPoll(true);
  }

  // for closing group
  const handleCloseGroup = () =>
  {
    setShowNewGroup(false);
  };

  const handleCreateGroup = (group) =>
  {
    if (setUserFriendsList)
    {
      setUserFriendsList((prev = []) =>
      {
        const exists = prev.some((c) => c.id === group.id);
        if (exists) return prev;

        const groupChat = {
          id: group.id,
          user_id: group.id,
          fullname: group.groupName,
          username: group.groupName,
          isGroup: true,
          profilePic: group.profilePic || "/images/group.png",
          members: group.members,
        };
        return [groupChat, ...prev];
      });
    }
    setShowNewGroup(false);
  };

  //Emoji function
  const handleEmojiClick = (emojiData) =>
  {
    setInputMessage((prev) => prev + emojiData.emoji);
    setSendEnabled(true);
  };

  useEffect(() =>
  {
    const closeMenu = () => setActiveMenu(null);
    if (activeMenu !== null)
    {
      window.addEventListener("click", closeMenu);
    }
    return () => window.removeEventListener("click", closeMenu);
  }, [activeMenu]);

  // when someones chat is opened..the cursor should directly go to input (type a message)
  useEffect(() =>
  {
    if (selectedFriend && messageInputRef.current)
    {
      messageInputRef.current.focus();
    }
  }, [selectedFriend]);

  // // Helper function to get last message for a chat
  // const getLastMessageForChat = (chat) => {
  //   if (!messagesState || messagesState.length === 0) return null;

  //   // Find messages between current user and this friend
  //   const chatMessages = messagesState.filter(msg => {
  //     return (msg.sender_id === chat.user_id && msg.receiver_id === currentUserId) ||
  //            (msg.sender_id === currentUserId && msg.receiver_id === chat.user_id);
  //   });

  //   if (chatMessages.length === 0) return null;

  //   // Get the most recent message
  //   return chatMessages.sort((a, b) =>
  //     new Date(b.timestamp) - new Date(a.timestamp)
  //   )[0];
  // };

  // // Function to get last message text
  // const getLastMessageText = (chat) => {
  //   const lastMessage = getLastMessageForChat(chat);

  //   if (!lastMessage) {
  //     return chat.isGroup ? "Group created" : "";
  //   }

  //   return lastMessage.content;
  // };

  // // Function to get last message time
  // const getLastMessageTime = (chat) => {
  //   const lastMessage = getLastMessageForChat(chat);

  //   if (!lastMessage) {
  //     return "";
  //   }

  //   return formatTimeOnly(lastMessage.timestamp);
  // };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex overflow-hidden">
      {/* desktop left side */}
      {!isMobile && searchView != "settings" && (
        <div
          ref={chatSidebarRef}
          className={`chat-sidebar border-end ${theme === "dark" ? "bg-dark text-light" : "bg-white"
            }`}
        >
          {openStarred ? (
            // global starred content left side
            <>
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <i
                  className="bi bi-arrow-left back-arrow me-5"
                  onClick={() =>
                  {
                    setOpenStarred(false);
                    navigate("/chatpage");
                  }}
                ></i>
                <h4 className="ms-5 fw-bold">Starred</h4>
              </div>
              <div className="starred-list-container overflow-auto flex-grow-1">
                {messagesState.filter((msg) => msg.isStared).length > 0 ? (
                  <StarredMessages
                    starredMessages={messagesState.filter(
                      (msg) => msg.isStared,
                    )}
                    theme={theme}
                    currentUserId={currentUserId}
                  />
                ) : (
                  <div className="text-center mt-5 text-muted">
                    <i className="bi bi-star fs-1 d-block mb-2"></i>
                    <p>No starred messages yet</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Normal bingo header left side Desktop*/}
              {/* WhatsApp-style Sidebar Header */}
              <div
                className="sticky-top "
                style={{
                  backgroundColor: theme === "dark" ? "#212529" : "#ffffff",
                  zIndex: 1020,
                }}
              >
                <div className="d-flex sticky-top justify-content-between align-items-center p-3 border-bottom">
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
                      <li onClick={() => setShowNewGroup(true)}>
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
                                theme === "dark"
                                  ? "invert(1) brightness(2)"
                                  : "none",
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
                      <li>
                        <a
                          className="dropdown-item d-flex align-items-center"
                          href="#"
                        >
                          <img
                            src="./images/icons/star.png"
                            alt="broadcast_logo"
                            className="me-2 icon-20"
                            onClick={() => setOpenStarred(true)}
                          />
                          <span
                            style={{
                              color: theme === "dark" ? "#ffffff" : "#000000",
                            }}
                            onClick={() => setOpenStarred(true)}
                          >
                            {t("starred")}
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 position-relative ">
                  <input
                    type="text"
                    name="username"
                    autoComplete="off"
                    className={`form-control form-control-lg ${theme === "dark"
                        ? "bg-secondary text-light border-secondary"
                        : ""
                      }`}
                    placeholder={t("searchUser")}
                    value={sidebarSearchFriend}
                    onChange={(e) => setSidebarSearchFriend(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-3">
                <h5 className="mb-3">{t("chats")}</h5>
                {isSelectingChats && selectedChats.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center p-2 bg-light border-bottom">
                    <span>{selectedChats.length} selected</span>
                    <div>
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
                    filteredFriends.map((chat, index) =>
                    {
                      const idKey = getChatKey(chat, index);
                      const isSelected = selectedChats.includes(idKey);
                      const isActiveChat =
                        selectedFriend?.user_id === chat.user_id;
                      return (
                        <li
                          key={idKey}
                          className={`list-group-item d-flex align-items-center clickable ${theme === "dark" ? "bg-dark text-light" : "bg-white"
                            } ${isSelected ? "bg-info-subtle" : ""}
                          ${isActiveChat ? "active-chat-highlight" : ""}
                          `}
                          onClick={(e) =>
                          {
                            e.stopPropagation();
                            if (isSelectingChats)
                            {
                              toggleChatSelection(idKey);
                            } else
                            {
                              handleFriendSelect(chat);
                            }
                          }}
                          onContextMenu={(e) =>
                          {
                            e.preventDefault();
                            toggleChatSelection(idKey);
                          }}
                        >
                          {isSelectingChats && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) =>
                              {
                                e.stopPropagation();
                                toggleChatSelection(idKey);
                              }}
                              className="me-2"
                            />
                          )}

                          <img
                            src={
                              chat.profilePic || "/images/good_baby_pfp.jpeg"
                            }
                            alt={chat.fullname}
                            className="rounded-circle me-3 img_icon_logo"
                            style={{
                              objectFit: "cover",
                            }}
                            onClick={(e) =>
                            {
                              e.stopPropagation();
                              setModalImageSrc(
                                chat.profilePic || "/images/good_baby_pfp.jpeg",
                              );
                              setModalImageName(chat.fullname);
                              setShowImageModal(true);
                            }}
                          />

                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <strong>{chat.fullname}</strong>
                              <small className="text-muted">
                                {/* {getLastMessageTime(chat)} */}
                                11:11 pm
                              </small>
                            </div>
                            <div
                              className="text-muted text-truncate"
                              style={{ fontSize: "0.9rem", maxWidth: "180px" }}
                            >
                              {chat.isGroup
                                ? chat.members
                                  ?.map((m) => m.fullname || m.username)
                                  .join(", ") || "No members"
                                : // `${getLastMessageText(chat)}`
                                "Hello"}
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
            </>
          )}
        </div>
      )}

      {/* Mobile screen */}
      {isMobile && showChatList && (
        <div
          ref={chatSidebarRef}
          className={`chat-sidebar border-end w-100 ${theme === "dark" ? "bg-dark text-light" : "bg-white"
            }`}
        >
          {openStarred ? (
            <>
              {/* mobile screen starred messages */}
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <button
                  className="btn btn-link text-secondary p-0"
                  onClick={() =>
                  {
                    setOpenStarred(false);
                  }}
                  style={{ fontSize: "1.25rem", width: "24px" }}
                >
                  <i className="bi bi-arrow-left"></i>
                </button>
                <div className="flex-grow-1 text-center">
                  <h5 className="ms-5 ">Starred</h5>
                </div>
              </div>
              <div className="starred-list-container overflow-auto flex-grow-1">
                {messagesState.filter((msg) => msg.isStared).length > 0 ? (
                  <StarredMessages
                    starredMessages={messagesState.filter(
                      (msg) => msg.isStared,
                    )}
                    theme={theme}
                  />
                ) : (
                  <div className="text-center mt-5 text-muted">
                    <i className="bi bi-star fs-1 d-block mb-2"></i>
                    <p>No starred messages yet</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Back Button Header */}
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <button
                  className="btn btn-link text-secondary p-0"
                  onClick={() =>
                  {
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
                              theme === "dark"
                                ? "invert(1) brightness(2)"
                                : "none",
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
                    <li>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        href="#"
                      >
                        <img
                          src="./images/icons/star.png"
                          alt="broadcast_logo"
                          className="me-2 icon-20"
                          onClick={() => setOpenStarred(true)}
                        />
                        <span
                          style={{
                            color: theme === "dark" ? "#ffffff" : "#000000",
                          }}
                          onClick={() => setOpenStarred(true)}
                        >
                          {t("starred")}
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
                  className={`form-control form-control-lg ${theme === "dark"
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
                    filteredFriends.map((chat, index) =>
                    {
                      const idKey = getChatKey(chat, index);

                      return (
                        <li
                          key={idKey}
                          className={`list-group-item d-flex align-items-center clickable ${theme === "dark" ? "bg-dark text-light" : "bg-white"
                            }`}
                          onClick={() => handleFriendSelect(chat)}
                        >
                          <img
                            src={
                              chat.profilePic || "/images/good_baby_pfp.jpeg"
                            }
                            alt={chat.fullname}
                            className="rounded-circle me-3 img_icon_logo"
                            style={{ objectFit: "cover" }}
                          />

                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <strong>{chat.fullname}</strong>
                              <small className="text-muted">
                                {/* {getLastMessageTime(chat)} */}
                                11:11 pm
                              </small>
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.9rem" }}
                            >
                              {/* {getLastMessageText(chat)} */}
                              Hello
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
            </>
          )}
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
                onClick={() =>
                {
                  if (isMobile)
                  {
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
              <img
                src="/images/icons/user.png"
                alt="profile"
                title="Profile"
                className="img_icon_logo"
                onClick={() => navigate("/profile")}
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
          className={`flex-grow-1 d-flex flex-column ${isMobile ? "w-100" : "w-100"
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
              className={`form-control form-control-lg ${theme === "dark"
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
              onClick={() =>
              {
                setSearchUserReq({});
                setSuggestions([]);
                setSearchView("icon");
                if (isMobile)
                {
                  setChatView("mobile_home");
                }
              }}
            ></i>
          </div>

          {suggestions.length > 0 && (
            <div className={isMobile ? "px-3" : "px-3"}>
              <ul
                className={`suggestion-list list-group ${isMobile ? "w-100" : "w-100 px-3"
                  } shadow`}
              >
                {suggestions.map((user) => (
                  <li
                    key={user.user_id}
                    className={`list-group-item list-group-item-action clickable d-flex justify-content-between align-items-center ${theme === "dark" ? "bg-dark text-light" : "bg-white"
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
                  className="text-muted text-truncate"
                  style={{
                    fontSize: "0.85rem",
                    color: theme === "dark" ? "#adb5bd" : "#6c757d",
                    maxWidth: isMobile ? "200px" : "400px",
                  }}
                >
                  {selectedFriend?.isGroup
                    ? selectedFriend.members
                      ?.map((m) => m.fullname || m.username)
                      .join(", ") || "Group"
                    : "online"}
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
              <div className="d-flex justify-content-between align-items-center p-2 bg-light border-bottom message-select-header">
                <span>{selectedMessages.length} selected</span>
                <div>
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => deleteSelectedMessages()}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => selectAllMessages()}
                  >
                    {selectedMessages.length === messagesState.length
                      ? "Unselect All"
                      : "Select All"}
                  </button>

                  {/* Pinned Message */}
                  {messagesState.some((m) => m.isPinned) && (
                    <div
                      className="pinned-message mb-2 p-2 rounded"
                      style={{
                        background: theme === "dark" ? "#2a2a2a" : "#fff3cd",
                        borderLeft: "4px solid #ffc107",
                        cursor: "pointer",
                      }}
                    >
                      📌 {messagesState.find((m) => m.isPinned)?.content}
                    </div>
                  )}
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
              {messagesState
                .filter(
                  (message) =>
                    (message.sender_id === currentUserId &&
                      message.receiver_id === selectedFriend.user_id) ||
                    (message.sender_id === selectedFriend.user_id &&
                      message.receiver_id === currentUserId)
                )
                .map((message, index) => (
                <div
                  key={message.chat_message_id}
                  className={`message-container ${message.sender_id === currentUserId
                      ? "sent-message"
                      : "received-message"
                    }`}
                >
                  {isSelectingMessages && (
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(
                        message.chat_message_id,
                      )}
                      onChange={() =>
                        toggleMessageSelection(message.chat_message_id)
                      }
                      className="me-2"
                    />
                  )}

                  {/* Message bubble */}
                  <div
                    className={` rounded-3 text-white message-bubble
                  ${message.sender_id === currentUserId ? "bg-primary" : "bg-secondary"}
                    `}
                  >
                    {message.is_reply_message === 1 &&
                      message.replied_message_id && (
                        <div
                          className={`replied-message-preview mb-1 px-2 py-1 rounded ${theme === "dark"
                              ? "bg-dark text-light border-primary"
                              : "bg-light text-dark border-primary"
                            }`}
                        >
                          ↩
                          {replyMessageContent.length > 50
                            ? replyMessageContent.slice(0, 50) + "..."
                            : replyMessageContent}
                        </div>
                      )}

                    {message.isPinned && (
                      <i
                        className="bi bi-pin-angle-fill position-absolute"
                        style={{
                          top: "-2px",
                          right: "6px",
                          fontSize: "0.9rem",
                          color: "#f8f7f7ff",
                        }}
                        title="Pinned message"
                      ></i>
                    )}
                    <div>
                      {message.type === "file" ? (
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-file-earmark-text fs-4"></i>
                          <div>
                            <div className="fw-semibold">
                              {message.fileName}
                            </div>
                            <div className="small text-white-50">
                              {message.fileSize}
                            </div>
                          </div>
                        </div>
                      ) : message.type === "poll" ? (
                        <div className="poll-message">
                          <strong className="poll-question">
                            {message.question}
                          </strong>
                          <div className="poll-options">
                            {message.options.map((opt, idx) => (
                              <label key={idx} className="poll-option">
                                <input
                                  type="radio"
                                  name={`poll-${formatTimeOnly(message.timestamp)}
}`}
                                  value={opt}
                                />
                                <span className="poll-text">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : (
                        message.content
                      )}

                      <i
                        className="bi bi-caret-down-fill message-options-trigger "
                        onClick={(e) =>
                        {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === index ? null : index);
                        }}
                        title="Options"
                      ></i>
                    </div>
                    <div
                      className="text-end text-white-50 small mt-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {message.isStared && (
                        <span style={{ color: "#9aa0a6" }}>
                          {" "}
                          <img
                            className="star_size"
                            src="/images/icons/black_star.png"
                            alt=""
                          />{" "}
                        </span>
                      )}
                      {formatTimeOnly(message.timestamp)}
                    </div>
                  </div>

                  {/* Options icon */}
                  <div className="message-options-wrapper">
                    {activeMenu === index && (
                      <div
                        className="message-options-menu"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="dropdown-item"
                          onClick={() => handleCopy(message.content)}
                        >
                          {t("copy")}
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => handleDeleteFromMenu(message.id)}
                        >
                          {t("delete")}
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => handleForward(message)}
                        >
                          {t("forward")}
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => handlePin(message.id)}
                        >
                          {message.isPinned ? `${t("unpin")}` : `${t("pin")}`}
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => handleStar(index)}
                        >
                          {message.isStared
                            ? `${t("unstar")}`
                            : `${t("star")}`}{" "}
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() =>
                            handleReply(message.id, message.content)
                          }
                        >
                          {t("reply")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply preview */}
            {isReply === 1 && (
              <div
                className="d-flex align-items-center mt-1 mb-2 px-2 py-2 rounded"
                style={{
                  backgroundColor: theme === "dark" ? "#1e1e1e" : "#f1f3f5",
                  borderLeft: "4px solid #0d6efd",
                }}
              >
                <div className="flex-grow-1">
                  <div
                    style={{
                      fontSize: "13px",
                      color: theme === "dark" ? "#8ab4f8" : "#0d6efd",
                      fontWeight: 500,
                    }}
                  >
                    ↩ Replying to { }
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: theme === "dark" ? "#ccc" : "#555",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {replyMessageContent}
                  </div>
                </div>

                <i
                  className="bi bi-x-lg ms-2 clickable"
                  onClick={() =>
                  {
                    setIsReply(0);
                    setReplyMessageContent(message.content || "");
                    setReplyMessageId(-1);
                  }}
                ></i>
              </div>
            )}

            {/* message input */}
            <div
              className="d-flex align-items-center mt-1 mb-2 border-top pt-2 px-2"
              style={{
                backgroundColor: theme === "dark" ? "#1e1e1e" : "#f8f9fa",
              }}
            >
              <div className="flex-grow-1 position-relative me-2">
                <i
                  className="bi bi-emoji-smile position-absolute top-50 start-0 translate-middle-y ms-2 clickable"
                  style={{ fontSize: "1.4rem" }}
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                ></i>

                {/* EmojiPicker */}
                {showEmojiPicker && (
                  <div
                    className="position-absolute bottom-100 start-0 mb-2"
                    style={{ zIndex: 9999 }}
                  >
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      theme={theme === "dark" ? "dark" : "light"}
                      skinTonesDisabled
                      previewConfig={{ showPreview: false }}
                    />
                  </div>
                )}

                <input
                  ref={messageInputRef}
                  type="text"
                  className="form-control ps-5 pe-5"
                  placeholder="Type a message"
                  value={inputMessage}
                  onChange={(e) =>
                  {
                    const val = e.target.value;
                    setInputMessage(val);
                    setSendEnabled(val.trim().length > 0);
                  }}
                  onKeyDown={(e) =>
                  {
                    if (e.key === "Enter" && sendEnabled)
                    {
                      handleSendMessage();
                    }
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
                        href="document"
                        style={{
                          color: theme === "dark" ? "#ffffff" : "#000000",
                        }}
                        onClick={(e) =>
                        {
                          e.preventDefault();
                          e.stopPropagation();
                          handleGallery();
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
                        onClick={handlePollButtonClick}
                      >
                        📊 {t("poll")}
                      </a>
                    </li>
                  </ul>
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    ref={galleryRef}
                    style={{ display: "none" }}
                    onChange={(e) =>
                    {
                      const file = e.target.files[0];
                      if (!file) return;

                      const fileMessage = {
                        id: Date.now(),
                        type: "file",
                        fileName: file.name,
                        fileSize: Math.round(file.size / 1024) + " KB",
                        fileType: file.type,
                        fileUrl: URL.createObjectURL(file),
                        timestamp: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                        message_status: MessageStatus.SENT,
                      };

                      setMessagesState((prev) => [...prev, fileMessage]);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary"
                disabled={!sendEnabled}
                onClick={handleSendMessage}
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
              <img
                src="/images/icons/user.png"
                alt="profile"
                title="Profile"
                className="img_icon_logo me-4"
                onClick={() => navigate("/profile")}
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
          onBack={() =>
          {
            setShowProfileSidebar(false);
            if (isMobile)
            {
              setChatView("chat");
            }
          }}
        />
      )}

      {showRightSidebar && (
        <div
          className={`position-fixed top-0 end-0 h-100 shadow bg-${theme === "dark" ? "dark text-light" : "white"
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
              showRightSidebarFriendList={showRightSidebarFriendList}
              setShowRightSidebarFriendList={setShowRightSidebarFriendList}
              onClose={() => setShowRightSidebar(false)}
              userFriendsList={userFriendsList}
            />
          </div>
        </div>
      )}

      {showImageModal && (
        <ProfilePhoto
          setShowImageModal={setShowImageModal}
          modalImageName={modalImageName}
          modalImageSrc={modalImageSrc}
        />
      )}

      {poll && (
        <PollMessage
          onClose={() => setPoll(false)}
          setMessagesState={setMessagesState}
          setSendEnabled={setSendEnabled}
        />
      )}

      {showNewGroup && (
        <NewGroup
          friendsList={userFriendsList || []}
          onClose={handleCloseGroup}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
}
