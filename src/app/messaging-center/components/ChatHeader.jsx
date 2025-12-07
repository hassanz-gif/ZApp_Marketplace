'use client';

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function ChatHeader({ conversation, onArchive, onBlock, onReport }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef?.current && !menuRef?.current?.contains(event?.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!conversation) {
    return null;
  }

  return (
    <div className="h-16 px-4 flex items-center justify-between border-b border-border bg-surface">
      {/* User Info */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
            <AppImage
              src={conversation?.avatar}
              alt={conversation?.altText}
              className="w-full h-full object-cover"
            />
          </div>
          {conversation?.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-surface"></div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{conversation?.name}</h3>
          <p className="text-xs text-muted-foreground">
            {conversation?.isOnline ? 'Active now' : `Last seen ${conversation?.lastSeen}`}
          </p>
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          className="p-2 text-foreground hover:bg-muted rounded-md transition-smooth"
          aria-label="Video call"
        >
          <Icon name="VideoCameraIcon" size={20} />
        </button>
        <button
          className="p-2 text-foreground hover:bg-muted rounded-md transition-smooth"
          aria-label="Voice call"
        >
          <Icon name="PhoneIcon" size={20} />
        </button>
        
        {/* More Options Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-foreground hover:bg-muted rounded-md transition-smooth"
            aria-label="More options"
          >
            <Icon name="EllipsisVerticalIcon" size={20} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal animate-fade-in z-10">
              <div className="p-2">
                <button
                  onClick={() => {
                    onArchive();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="ArchiveBoxIcon" size={18} />
                  <span>Archive Conversation</span>
                </button>
                <button
                  onClick={() => {
                    onBlock();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="NoSymbolIcon" size={18} />
                  <span>Block User</span>
                </button>
                <div className="my-2 border-t border-border"></div>
                <button
                  onClick={() => {
                    onReport();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-error hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="FlagIcon" size={18} />
                  <span>Report User</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ChatHeader.propTypes = {
  conversation: PropTypes?.shape({
    name: PropTypes?.string?.isRequired,
    avatar: PropTypes?.string?.isRequired,
    altText: PropTypes?.string?.isRequired,
    isOnline: PropTypes?.bool?.isRequired,
    lastSeen: PropTypes?.string
  }),
  onArchive: PropTypes?.func?.isRequired,
  onBlock: PropTypes?.func?.isRequired,
  onReport: PropTypes?.func?.isRequired
};