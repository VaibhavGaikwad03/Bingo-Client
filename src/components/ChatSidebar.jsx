import React, { useState } from 'react';
import { useWS } from '../context/WebSocketContext';
import { MessageTypes, FriendshipStatus } from '../constants';
import { Search, Users, Settings, User, UserPlus, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatSidebar({ selectedFriend, onSelectFriend, onOpenPanel }) {
  const {
    currentUsername, currentName, currentUserId, friendsList,
    friendRequests, suggestions, setSuggestions, sendMessage,
  } = useWS();
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarFilter, setSidebarFilter] = useState('');

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value.trim().length > 0) {
      sendMessage({
        message_type: MessageTypes.SEARCH_USER_REQUEST,
        username: value.trimStart(),
        requested_by: currentUsername,
      });
    } else {
      setSuggestions([]);
    }
  };

  const handleAddFriend = (user) => {
    sendMessage({
      message_type: MessageTypes.FRIEND_REQ_REQUEST,
      sender_id: currentUserId,
      sender: currentUsername,
      name_of_sender: currentName,
      receiver_id: user.user_id,
      receiver: user.username,
      name_of_receiver: user.display_name,
      timestamp: new Date().toISOString(),
    });
  };

  const filteredFriends = friendsList.filter(f => {
    const q = sidebarFilter.toLowerCase();
    return f.fullname?.toLowerCase().includes(q) || f.username?.toLowerCase().includes(q);
  });

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="chat-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-user" onClick={() => onOpenPanel('profile')}>
          <div className="avatar avatar-sm">
            {getInitials(currentName)}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{currentName || 'User'}</span>
            <span className="sidebar-user-handle">@{currentUsername}</span>
          </div>
        </div>
        <div className="sidebar-actions">
          <button className="icon-btn" onClick={() => onOpenPanel('friendRequests')} title="Friend Requests">
            <Users size={20} />
            {friendRequests.length > 0 && <span className="badge">{friendRequests.length}</span>}
          </button>
          <button className="icon-btn" onClick={() => onOpenPanel('settings')} title="Settings">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        {!searchMode ? (
          <div className="search-bar" onClick={() => setSearchMode(true)}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search friends..."
              value={sidebarFilter}
              onChange={(e) => setSidebarFilter(e.target.value)}
            />
          </div>
        ) : (
          <div className="search-bar search-bar--active">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search users to add..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            <button className="icon-btn-sm" onClick={() => { setSearchMode(false); setSearchQuery(''); setSuggestions([]); }}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Search results or Friends list */}
      <div className="sidebar-list">
        {searchMode && suggestions.length > 0 ? (
          <div className="search-results">
            <div className="list-section-title">Search Results</div>
            {suggestions.map((user, i) => (
              <motion.div
                key={user.user_id || i}
                className="chat-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="avatar">{getInitials(user.display_name)}</div>
                <div className="chat-item-info">
                  <span className="chat-item-name">{user.display_name}</span>
                  <span className="chat-item-sub">@{user.username}</span>
                </div>
                {user.friendship_status === FriendshipStatus.NOT_FRIEND && (
                  <button className="add-btn" onClick={() => handleAddFriend(user)} title="Add Friend">
                    <UserPlus size={16} />
                  </button>
                )}
                {user.friendship_status === FriendshipStatus.PENDING && (
                  <span className="status-badge pending">Pending</span>
                )}
                {user.friendship_status === FriendshipStatus.FRIEND && (
                  <span className="status-badge friend">Friend</span>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            <div className="list-section-title">Messages</div>
            {filteredFriends.length === 0 ? (
              <div className="empty-list">
                <p>No conversations yet</p>
                <button className="link-btn" onClick={() => setSearchMode(true)}>
                  <UserPlus size={16} /> Find friends
                </button>
              </div>
            ) : (
              filteredFriends.map((friend, i) => (
                <motion.div
                  key={friend.user_id || i}
                  className={`chat-item ${selectedFriend?.user_id === friend.user_id ? 'active' : ''}`}
                  onClick={() => onSelectFriend(friend)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="avatar">{getInitials(friend.fullname)}</div>
                  <div className="chat-item-info">
                    <span className="chat-item-name">{friend.fullname}</span>
                    <span className="chat-item-sub">@{friend.username}</span>
                  </div>
                </motion.div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
