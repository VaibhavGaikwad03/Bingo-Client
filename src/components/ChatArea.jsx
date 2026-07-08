import React, { useState, useEffect, useRef } from 'react';
import { useWS } from '../context/WebSocketContext';
import { MessageTypes, ConversationTypes, ContentTypes, MessageStatus } from '../constants';
import { Send, Smile, ArrowLeft, MoreVertical, Reply, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatArea({ friend, messages, setMessages, onBack }) {
  const { currentUserId, sendMessage, getChatMessageId, theme } = useWS();
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when friend changes
  useEffect(() => {
    inputRef.current?.focus();
    setReplyTo(null);
    setShowEmoji(false);
  }, [friend?.user_id]);

  // Filter messages for this conversation
  const conversationMessages = messages.filter(m =>
    (m.sender_id === currentUserId && m.receiver_id === friend.user_id) ||
    (m.sender_id === friend.user_id && m.receiver_id === currentUserId)
  );

  const handleSend = async () => {
    if (!input.trim()) return;

    const chatMessageId = await getChatMessageId();
    const msg = {
      chat_message_id: chatMessageId,
      message_type: MessageTypes.CHAT_MESSAGE,
      conversation_type: ConversationTypes.PERSONAL,
      sender_id: currentUserId,
      receiver_id: friend.user_id,
      content_type: ContentTypes.TEXT,
      content: input,
      message_status: MessageStatus.SENT,
      is_reply_message: replyTo ? 1 : 0,
      replied_message_id: replyTo?.chat_message_id || -1,
      timestamp: new Date().toISOString(),
    };

    sendMessage(msg);
    setMessages(prev => [...prev, msg]);
    setInput('');
    setShowEmoji(false);
    setReplyTo(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji);
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status) => {
    if (status === MessageStatus.READ) return '✓✓';
    if (status === MessageStatus.DELIVERED) return '✓✓';
    return '✓';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  // Find the replied message content
  const getRepliedContent = (msgId) => {
    const msg = messages.find(m => m.chat_message_id === msgId);
    return msg?.content || '';
  };

  return (
    <div className="chat-area">
      {/* Header */}
      <div className="chat-header">
        <button className="icon-btn mobile-only" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="avatar">{getInitials(friend.fullname)}</div>
        <div className="chat-header-info">
          <h3>{friend.fullname}</h3>
          <span>@{friend.username}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {conversationMessages.length === 0 ? (
          <div className="messages-empty">
            <p>No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          conversationMessages.map((msg, i) => {
            const isSent = msg.sender_id === currentUserId;
            return (
              <motion.div
                key={msg.chat_message_id || i}
                className={`message-row ${isSent ? 'sent' : 'received'}`}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="message-bubble">
                  {msg.is_reply_message === 1 && msg.replied_message_id !== -1 && (
                    <div className="reply-preview">
                      <Reply size={12} />
                      <span>{getRepliedContent(msg.replied_message_id) || 'Original message'}</span>
                    </div>
                  )}
                  <p className="message-text">{msg.content}</p>
                  <div className="message-meta">
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                    {isSent && <span className="message-status">{getStatusIcon(msg.message_status)}</span>}
                  </div>
                </div>
                <div className="message-actions">
                  <button className="msg-action-btn" onClick={() => setReplyTo(msg)} title="Reply">
                    <Reply size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply bar */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            className="reply-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <Reply size={14} />
            <span className="reply-text">Replying to: {replyTo.content?.slice(0, 60)}</span>
            <button className="icon-btn-sm" onClick={() => setReplyTo(null)}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            className="emoji-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={theme === 'dark' ? 'dark' : 'light'}
              width="100%"
              height={350}
              searchDisabled={false}
              skinTonesDisabled
              previewConfig={{ showPreview: false }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="chat-input-area">
        <button className="icon-btn" onClick={() => setShowEmoji(!showEmoji)}>
          <Smile size={22} />
        </button>
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <motion.button
          className={`send-btn ${input.trim() ? 'active' : ''}`}
          onClick={handleSend}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={!input.trim()}
        >
          <Send size={20} />
        </motion.button>
      </div>
    </div>
  );
}
