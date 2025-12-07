'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function AccountNotifications({ notifications }) {
  const [notificationList, setNotificationList] = useState(notifications);

  const handleDismiss = (id) => {
    setNotificationList(notificationList?.filter(notif => notif?.id !== id));
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'order': 'ShoppingBagIcon',
      'message': 'ChatBubbleLeftRightIcon',
      'promotion': 'TagIcon',
      'system': 'BellIcon'
    };
    return icons?.[type] || 'BellIcon';
  };

  const getNotificationColor = (type) => {
    const colors = {
      'order': 'text-primary bg-primary/10',
      'message': 'text-success bg-success/10',
      'promotion': 'text-warning bg-warning/10',
      'system': 'text-muted-foreground bg-muted'
    };
    return colors?.[type] || 'text-muted-foreground bg-muted';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        {notificationList?.length > 0 && (
          <button
            onClick={() => setNotificationList([])}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {notificationList?.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="BellIcon" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No new notifications</p>
          </div>
        ) : (
          notificationList?.map((notification) => (
            <div key={notification?.id} className="p-4 hover:bg-muted/50 transition-smooth">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${getNotificationColor(notification?.type)}`}>
                  <Icon name={getNotificationIcon(notification?.type)} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      {notification?.title}
                    </h3>
                    <button
                      onClick={() => handleDismiss(notification?.id)}
                      className="ml-2 p-1 text-muted-foreground hover:text-foreground transition-smooth"
                      aria-label="Dismiss notification"
                    >
                      <Icon name="XMarkIcon" size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification?.message}
                  </p>
                  <p className="text-xs text-muted-foreground">{notification?.time}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

AccountNotifications.propTypes = {
  notifications: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      type: PropTypes?.oneOf(['order', 'message', 'promotion', 'system'])?.isRequired,
      title: PropTypes?.string?.isRequired,
      message: PropTypes?.string?.isRequired,
      time: PropTypes?.string?.isRequired
    })
  )?.isRequired
};