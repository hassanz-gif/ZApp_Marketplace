'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ConversationList from './ConversationList';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import EmptyState from './EmptyState';
import Icon from '@/components/ui/AppIcon';

export default function MessagingInteractive({ initialConversations, initialMessages }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowConversationList(true);
      }
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const activeConversation = conversations?.find((c) => c?.id === activeConversationId);
  const conversationMessages = messages?.[activeConversationId] || [];

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);

    setConversations((prev) =>
    prev?.map((conv) =>
    conv?.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    )
    );

    if (isMobileView) {
      setShowConversationList(false);
    }
  };

  const handleBackToList = () => {
    setShowConversationList(true);
    setActiveConversationId(null);
  };

  const handleSearch = (query) => {
    console.log('Searching for:', query);
  };

  const handleSendMessage = (text) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      type: 'text',
      content: text,
      timestamp: new Date()?.toISOString(),
      status: 'sent'
    };

    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev?.[activeConversationId] || []), newMessage]
    }));

    setConversations((prev) =>
    prev?.map((conv) =>
    conv?.id === activeConversationId ?
    { ...conv, lastMessage: text, timestamp: new Date()?.toISOString() } :
    conv
    )
    );
  };

  const handleSendImage = (file) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      type: 'image',
      content: 'Sent an image',
      imageUrl: "https://images.unsplash.com/photo-1565530557873-14ab8a68a85b",
      imageAlt: 'Product image showing modern watch with leather strap on white background',
      timestamp: new Date()?.toISOString(),
      status: 'sent'
    };

    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev?.[activeConversationId] || []), newMessage]
    }));
  };

  const handleSendOrder = () => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      type: 'order',
      content: 'Regarding this order',
      orderId: '12345',
      orderTitle: 'Wireless Bluetooth Headphones',
      orderAmount: '89.99',
      timestamp: new Date()?.toISOString(),
      status: 'sent'
    };

    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev?.[activeConversationId] || []), newMessage]
    }));
  };

  const handleArchive = () => {
    setConversations((prev) =>
    prev?.map((conv) =>
    conv?.id === activeConversationId ? { ...conv, isArchived: true } : conv
    )
    );
    setActiveConversationId(null);
    if (isMobileView) {
      setShowConversationList(true);
    }
  };

  const handleBlock = () => {
    console.log('Blocking user');
  };

  const handleReport = () => {
    console.log('Reporting user');
  };

  return (
    <div className="flex h-[calc(100vh-60px)] bg-background">
      {/* Conversation List - Desktop always visible, Mobile conditional */}
      <div className={`${
      isMobileView ?
      showConversationList ? 'w-full' : 'hidden' : 'w-80 lg:w-96'} flex-shrink-0`
      }>
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onSearch={handleSearch} />

      </div>

      {/* Chat Area - Desktop always visible, Mobile conditional */}
      <div className={`${
      isMobileView ?
      !showConversationList ? 'w-full' : 'hidden' : 'flex-1'} flex flex-col`
      }>
        {activeConversation ?
        <>
            {/* Mobile Back Button */}
            {isMobileView &&
          <div className="h-14 px-4 flex items-center border-b border-border bg-surface">
                <button
              onClick={handleBackToList}
              className="p-2 -ml-2 text-foreground hover:bg-muted rounded-md transition-smooth"
              aria-label="Back to conversations">

                  <Icon name="ArrowLeftIcon" size={24} />
                </button>
              </div>
          }
            
            <ChatHeader
            conversation={activeConversation}
            onArchive={handleArchive}
            onBlock={handleBlock}
            onReport={handleReport} />

            <ChatWindow
            messages={conversationMessages}
            onSendMessage={handleSendMessage}
            onSendImage={handleSendImage}
            onSendOrder={handleSendOrder} />

          </> :

        <EmptyState type="noConversation" />
        }
      </div>
    </div>);

}

MessagingInteractive.propTypes = {
  initialConversations: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      name: PropTypes?.string?.isRequired,
      avatar: PropTypes?.string?.isRequired,
      altText: PropTypes?.string?.isRequired,
      lastMessage: PropTypes?.string?.isRequired,
      timestamp: PropTypes?.string?.isRequired,
      unreadCount: PropTypes?.number?.isRequired,
      isOnline: PropTypes?.bool?.isRequired,
      isArchived: PropTypes?.bool?.isRequired
    })
  )?.isRequired,
  initialMessages: PropTypes?.objectOf(
    PropTypes?.arrayOf(
      PropTypes?.shape({
        id: PropTypes?.string?.isRequired,
        senderId: PropTypes?.string?.isRequired,
        type: PropTypes?.string?.isRequired,
        timestamp: PropTypes?.string?.isRequired
      })
    )
  )?.isRequired
};