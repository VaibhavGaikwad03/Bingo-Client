import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageTypes, Status, LoginErrorCodes, SignupErrorCodes,
  ChangePasswordErrorCodes, FriendRequestStatus,
} from '../constants';
import { toast } from 'react-toastify';

const WebSocketContext = createContext(null);

export function useWS() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
  const wsRef = useRef(null);
  const navigate = useNavigate();

  const [connected, setConnected] = useState(false);
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem('isAuth') === 'true');
  const [currentUserId, setCurrentUserId] = useState(() => parseInt(localStorage.getItem('currentUserId'), 10) || -1);
  const [currentUsername, setCurrentUsername] = useState(() => localStorage.getItem('currentUsername') || '');
  const [currentName, setCurrentName] = useState(() => localStorage.getItem('currentName') || '');
  const [userProfile, setUserProfile] = useState({});
  const [friendsList, setFriendsList] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [chatMessage, setChatMessage] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [responseId, setResponseId] = useState(-1);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [authMessage, setAuthMessage] = useState('');

  // Persist theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const sendMessage = useCallback((obj) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(obj));
    } else {
      console.warn('WebSocket not connected');
    }
  }, []);

  // getChatMessageId returns a promise that resolves with the id
  const getChatMessageId = useCallback(() => {
    return new Promise((resolve) => {
      sendMessage({ message_type: MessageTypes.GET_CHAT_MESSAGE_ID_REQUEST, user_id: currentUserId });
      function handler(event) {
        const data = JSON.parse(event.data);
        if (data.message_type === MessageTypes.GET_CHAT_MESSAGE_ID_RESPONSE) {
          wsRef.current.removeEventListener('message', handler);
          resolve(data.chat_message_id);
        }
      }
      wsRef.current.addEventListener('message', handler);
    });
  }, [currentUserId, sendMessage]);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://92.4.78.71:2121');
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      // Auto-reconnect if already authenticated
      const token = localStorage.getItem('auth_token');
      if (localStorage.getItem('isAuth') === 'true' && token) {
        ws.send(JSON.stringify({
          message_type: MessageTypes.RECONNECT_REQUEST,
          user_id: parseInt(localStorage.getItem('currentUserId'), 10),
          auth_token: token,
        }));
      }
    };

    ws.onmessage = (event) => {
      const d = JSON.parse(event.data);
      switch (d.message_type) {
        case MessageTypes.LOGIN_RESPONSE:
          if (d.status === Status.SUCCESS) {
            setCurrentUserId(d.user_id);
            setIsAuth(true);
            localStorage.setItem('isAuth', 'true');
            localStorage.setItem('currentUserId', d.user_id);
            localStorage.setItem('auth_token', d.auth_token);
            setAuthMessage('');
            navigate('/chat');
          } else {
            if (d.error_code === LoginErrorCodes.USERNAME_NOT_FOUND) setAuthMessage('Username not found');
            else if (d.error_code === LoginErrorCodes.PASSWORD_IS_INCORRECT) setAuthMessage('Incorrect password');
            else setAuthMessage('Login failed');
          }
          break;

        case MessageTypes.SIGN_UP_RESPONSE:
          if (d.status === Status.SUCCESS) {
            toast.success('Account created! Please login.');
            setTimeout(() => navigate('/'), 1500);
          } else {
            if (d.error_code === SignupErrorCodes.USERNAME_ALREADY_EXISTS) setAuthMessage('Username already taken');
            else if (d.error_code === SignupErrorCodes.EMAIL_ALREADY_EXISTS) setAuthMessage('Email already in use');
            else if (d.error_code === SignupErrorCodes.PHONE_ALREADY_EXISTS) setAuthMessage('Phone already in use');
            else setAuthMessage('Signup failed');
          }
          break;

        case MessageTypes.LOGOUT_RESPONSE:
          if (d.status === Status.SUCCESS) {
            setIsAuth(false);
            setCurrentUserId(-1);
            setCurrentUsername('');
            setCurrentName('');
            setFriendsList([]);
            setFriendRequests([]);
            setSuggestions([]);
            setUserProfile({});
            setMessageHistory([]);
            localStorage.removeItem('isAuth');
            localStorage.removeItem('currentUserId');
            localStorage.removeItem('currentUsername');
            localStorage.removeItem('currentName');
            localStorage.removeItem('auth_token');
            navigate('/');
          } else {
            toast.error('Logout failed. Try again.');
          }
          break;

        case MessageTypes.SEARCH_USER_RESPONSE:
          setSuggestions(d.users?.slice(0, 30) || []);
          break;

        case MessageTypes.FRIEND_REQ_REQUEST:
          setFriendRequests(prev => {
            if (prev.some(r => r.sender_id === d.sender_id)) return prev;
            return [...prev, d];
          });
          toast.info(`Friend request from ${d.name_of_sender}`);
          break;

        case MessageTypes.USER_PROFILE_INFORMATION:
          setCurrentUsername(d.username);
          setCurrentName(d.fullname);
          setUserProfile(d);
          localStorage.setItem('currentUsername', d.username);
          localStorage.setItem('currentName', d.fullname);
          break;

        case MessageTypes.USER_FRIENDS_LIST:
          setFriendsList(d.friends_list || []);
          break;

        case MessageTypes.USER_PENDING_FRIEND_REQUESTS_LIST:
          setFriendRequests(d.pending_friend_requests_list || []);
          break;

        case MessageTypes.USER_MESSAGE_HISTORY:
          if (d.chat_history_list) {
            setMessageHistory(d.chat_history_list);
          }
          break;

        case MessageTypes.CHANGE_PASSWORD_RESPONSE:
          if (d.status === Status.SUCCESS) toast.success('Password changed!');
          else if (d.error_code === ChangePasswordErrorCodes.NEW_PASSWORD_MUST_BE_DIFFERENT)
            toast.error('New password must be different');
          else toast.error('Password change failed');
          break;

        case MessageTypes.RECONNECT_RESPONSE:
          if (d.status === Status.SUCCESS) {
            setIsAuth(true);
            localStorage.setItem('isAuth', 'true');
            localStorage.setItem('currentUserId', d.user_id);
            localStorage.setItem('auth_token', d.auth_token);
            setConnected(true);
            navigate('/chat');
          } else {
            setIsAuth(false);
            localStorage.removeItem('isAuth');
            setMessageHistory([]);
            navigate('/');
          }
          break;

        case MessageTypes.UPDATE_PROFILE_RESPONSE:
          if (d.status === Status.SUCCESS) toast.success('Profile updated!');
          else toast.error('Profile update failed');
          break;

        case MessageTypes.GET_CHAT_MESSAGE_ID_RESPONSE:
          setResponseId(d.chat_message_id);
          break;

        case MessageTypes.CHAT_MESSAGE:
          setChatMessage(d);
          setMessageHistory(prev => [...prev, d]);
          break;

        default:
          break;
      }
    };

    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    return () => ws.close();
  }, []);

  const value = {
    connected, isAuth, currentUserId, currentUsername, currentName,
    userProfile, friendsList, setFriendsList, friendRequests, setFriendRequests,
    suggestions, setSuggestions, chatMessage, messageHistory, setMessageHistory,
    responseId, theme, setTheme, authMessage, setAuthMessage, sendMessage,
    getChatMessageId, setCurrentUsername, setCurrentName, setIsAuth,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}
