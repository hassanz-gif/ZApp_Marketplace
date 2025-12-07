'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function ConversationList({ conversations, activeConversationId, onSelectConversation, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const handleSearchChange = (e) => {
    const query = e?.target?.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const filteredConversations = conversations?.filter(conv => {
    if (filterType === 'unread') return conv?.unreadCount > 0;
    if (filterType === 'archived') return conv?.isArchived;
    return !conv?.isArchived;
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffInHours < 168) {
      return date?.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">Messages</h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search conversations..."
            className="w-full h-10 pl-10 pr-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          />
          <Icon 
            name="MagnifyingGlassIcon" 
            size={20} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              filterType === 'all' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('unread')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              filterType === 'unread' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilterType('archived')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              filterType === 'archived' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            Archived
          </button>
        </div>
      </div>
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Icon name="ChatBubbleLeftRightIcon" size={48} className="text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No conversations found</p>
          </div>
        ) : (
          filteredConversations?.map((conversation) => (
            <button
              key={conversation?.id}
              onClick={() => onSelectConversation(conversation?.id)}
              className={`w-full p-4 flex items-start space-x-3 border-b border-border hover:bg-muted transition-smooth ${
                activeConversationId === conversation?.id ? 'bg-muted' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
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

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {conversation?.name}
                  </h3>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {formatTimestamp(conversation?.timestamp)}
                  </span>
                </div>
                <p className={`text-sm truncate ${
                  conversation?.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>
                  {conversation?.lastMessage}
                </p>
                {conversation?.orderReference && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Icon name="ShoppingBagIcon" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Order #{conversation?.orderReference}</span>
                  </div>
                )}
              </div>

              {/* Unread Badge */}
              {conversation?.unreadCount > 0 && (
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {conversation?.unreadCount > 9 ? '9+' : conversation?.unreadCount}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

ConversationList.propTypes = {
  conversations: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      name: PropTypes?.string?.isRequired,
      avatar: PropTypes?.string?.isRequired,
      altText: PropTypes?.string?.isRequired,
      lastMessage: PropTypes?.string?.isRequired,
      timestamp: PropTypes?.string?.isRequired,
      unreadCount: PropTypes?.number?.isRequired,
      isOnline: PropTypes?.bool?.isRequired,
      isArchived: PropTypes?.bool?.isRequired,
      orderReference: PropTypes?.string
    })
  )?.isRequired,
  activeConversationId: PropTypes?.string,
  onSelectConversation: PropTypes?.func?.isRequired,
  onSearch: PropTypes?.func?.isRequired
};