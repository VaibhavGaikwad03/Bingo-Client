import React, { useState, useEffect, useRef } from 'react';
import { useWS } from '../context/WebSocketContext';
import ChatSidebar from '../components/ChatSidebar';
import ChatArea from '../components/ChatArea';
import FriendRequests from '../components/FriendRequests';
import SettingsPanel from '../components/SettingsPanel';
import ProfilePanel from '../components/ProfilePanel';
import { motion, AnimatePresence } from 'framer-motion';
import '../css/chat.css';

export default function ChatLayout() {
  const { currentUserId, friendsList, messageHistory, setMessageHistory } = useWS();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [panel, setPanel] = useState(null); // 'friendRequests' | 'settings' | 'profile' | null
  const [mobileView, setMobileView] = useState('sidebar'); // 'sidebar' | 'chat'

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    setPanel(null);
    setMobileView('chat');
  };

  const handleBackToSidebar = () => {
    setMobileView('sidebar');
    setSelectedFriend(null);
  };

  return (
    <div className="chat-layout">
      {/* Left Sidebar */}
      <div className={`chat-sidebar-wrapper ${mobileView === 'chat' ? 'hide-mobile' : ''}`}>
        <ChatSidebar
          selectedFriend={selectedFriend}
          onSelectFriend={handleSelectFriend}
          onOpenPanel={setPanel}
        />
      </div>

      {/* Main Chat Area */}
      <div className={`chat-main-wrapper ${mobileView === 'sidebar' ? 'hide-mobile' : ''}`}>
        {selectedFriend ? (
          <ChatArea
            friend={selectedFriend}
            messages={messageHistory}
            setMessages={setMessageHistory}
            onBack={handleBackToSidebar}
          />
        ) : (
          <div className="chat-empty">
            <div className="chat-empty-content">
              <div className="empty-icon">💬</div>
              <h2>Welcome to Bingo</h2>
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Slide-in Panels */}
      <AnimatePresence>
        {panel === 'friendRequests' && (
          <motion.div
            className="slide-panel"
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <FriendRequests onClose={() => setPanel(null)} />
          </motion.div>
        )}
        {panel === 'settings' && (
          <motion.div
            className="slide-panel"
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <SettingsPanel onClose={() => setPanel(null)} />
          </motion.div>
        )}
        {panel === 'profile' && (
          <motion.div
            className="slide-panel"
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <ProfilePanel onClose={() => setPanel(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
