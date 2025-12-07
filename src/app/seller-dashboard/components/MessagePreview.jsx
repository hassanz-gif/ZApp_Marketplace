'use client';

import PropTypes from 'prop-types';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function MessagePreview({ message, onMarkAsRead }) {
  return (
    <div className={`bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-smooth ${message?.unread ? 'bg-primary/5' : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2 flex-1">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="UserIcon" size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold text-foreground truncate">{message?.sender}</h4>
              {message?.unread && (
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{message?.time}</p>
          </div>
        </div>
        <Link
          href={`/messaging-center?id=${message?.id}`}
          className="text-primary hover:text-primary/80 transition-smooth flex-shrink-0 ml-2"
          aria-label="View message"
        >
          <Icon name="ArrowTopRightOnSquareIcon" size={20} />
        </Link>
      </div>
      <p className="text-sm text-foreground mb-3 line-clamp-2">{message?.preview}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Re: Order #{message?.orderId}</span>
        {message?.unread && (
          <button
            onClick={() => onMarkAsRead(message?.id)}
            className="text-xs text-primary hover:text-primary/80 font-medium transition-smooth"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}

MessagePreview.propTypes = {
  message: PropTypes?.shape({
    id: PropTypes?.number?.isRequired,
    sender: PropTypes?.string?.isRequired,
    preview: PropTypes?.string?.isRequired,
    time: PropTypes?.string?.isRequired,
    orderId: PropTypes?.number?.isRequired,
    unread: PropTypes?.bool?.isRequired
  })?.isRequired,
  onMarkAsRead: PropTypes?.func?.isRequired
};