'use client';

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, onSendMessage, onSendImage, onSendOrder }) {
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const attachMenuRef = useRef(null);

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯'];

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (attachMenuRef?.current && !attachMenuRef?.current?.contains(event?.target)) {
        setShowAttachMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (messageText?.trim()) {
      onSendMessage(messageText?.trim());
      setMessageText('');
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      onSendImage(file);
      setShowAttachMenu(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Icon name="ChatBubbleLeftRightIcon" size={64} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No messages yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Start the conversation by sending a message below
            </p>
          </div>
        ) : (
          <>
            {messages?.map((message) => (
              <MessageBubble
                key={message?.id}
                message={message}
                isOwn={message?.senderId === 'current-user'}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      {/* Input Area */}
      <div className="border-t border-border bg-surface p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          {/* Attach Button */}
          <div className="relative" ref={attachMenuRef}>
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2 text-foreground hover:bg-muted rounded-md transition-smooth"
              aria-label="Attach file"
            >
              <Icon name="PaperClipIcon" size={24} />
            </button>

            {showAttachMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-popover border border-border rounded-lg shadow-modal animate-fade-in">
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef?.current?.click();
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-smooth"
                  >
                    <Icon name="PhotoIcon" size={18} />
                    <span>Send Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSendOrder();
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-smooth"
                  >
                    <Icon name="ShoppingBagIcon" size={18} />
                    <span>Share Order</span>
                  </button>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e?.target?.value)}
              onKeyDown={(e) => {
                if (e?.key === 'Enter' && !e?.shiftKey) {
                  e?.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 pr-10 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-smooth"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
            
            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-foreground hover:bg-background rounded transition-smooth"
              aria-label="Add emoji"
            >
              <Icon name="FaceSmileIcon" size={20} />
            </button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 p-2 bg-popover border border-border rounded-lg shadow-modal animate-fade-in">
                <div className="grid grid-cols-4 gap-2">
                  {emojis?.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-2xl hover:bg-muted rounded p-1 transition-smooth"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!messageText?.trim()}
            className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            aria-label="Send message"
          >
            <Icon name="PaperAirplaneIcon" size={24} />
          </button>
        </form>

        {/* Character Count */}
        <div className="flex justify-between items-center mt-2 px-2">
          <p className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
          <span className="text-xs text-muted-foreground">
            {messageText?.length}/1000
          </span>
        </div>
      </div>
    </div>
  );
}

ChatWindow.propTypes = {
  messages: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      senderId: PropTypes?.string?.isRequired,
      type: PropTypes?.string?.isRequired,
      content: PropTypes?.string,
      timestamp: PropTypes?.string?.isRequired
    })
  )?.isRequired,
  onSendMessage: PropTypes?.func?.isRequired,
  onSendImage: PropTypes?.func?.isRequired,
  onSendOrder: PropTypes?.func?.isRequired
};