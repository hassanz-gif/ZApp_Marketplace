import PropTypes from 'prop-types';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function MessageBubble({ message, isOwn }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Message Content */}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted text-foreground rounded-bl-sm'
          }`}
        >
          {message?.type === 'text' && (
            <p className="text-sm whitespace-pre-wrap break-words">{message?.content}</p>
          )}
          
          {message?.type === 'image' && (
            <div className="space-y-2">
              <div className="rounded-lg overflow-hidden">
                <AppImage
                  src={message?.imageUrl}
                  alt={message?.imageAlt}
                  className="w-full h-auto"
                />
              </div>
              {message?.content && (
                <p className="text-sm whitespace-pre-wrap break-words">{message?.content}</p>
              )}
            </div>
          )}
          
          {message?.type === 'order' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 pb-2 border-b border-primary-foreground/20">
                <Icon name="ShoppingBagIcon" size={18} />
                <span className="text-sm font-medium">Order Reference</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">{message?.orderTitle}</p>
                <p className="text-xs opacity-90">Order #{message?.orderId}</p>
                <p className="text-sm font-medium">${message?.orderAmount}</p>
              </div>
              {message?.content && (
                <p className="text-sm whitespace-pre-wrap break-words pt-2 border-t border-primary-foreground/20">
                  {message?.content}
                </p>
              )}
            </div>
          )}
          
          {message?.type === 'system' && (
            <div className="flex items-center space-x-2">
              <Icon name="InformationCircleIcon" size={18} />
              <p className="text-sm">{message?.content}</p>
            </div>
          )}
        </div>

        {/* Timestamp and Status */}
        <div className={`flex items-center space-x-2 mt-1 px-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-muted-foreground">{formatTime(message?.timestamp)}</span>
          {isOwn && (
            <div className="flex items-center">
              {message?.status === 'sent' && (
                <Icon name="CheckIcon" size={14} className="text-muted-foreground" />
              )}
              {message?.status === 'delivered' && (
                <div className="flex -space-x-1">
                  <Icon name="CheckIcon" size={14} className="text-muted-foreground" />
                  <Icon name="CheckIcon" size={14} className="text-muted-foreground" />
                </div>
              )}
              {message?.status === 'read' && (
                <div className="flex -space-x-1">
                  <Icon name="CheckIcon" size={14} className="text-primary" />
                  <Icon name="CheckIcon" size={14} className="text-primary" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

MessageBubble.propTypes = {
  message: PropTypes?.shape({
    id: PropTypes?.string?.isRequired,
    type: PropTypes?.oneOf(['text', 'image', 'order', 'system'])?.isRequired,
    content: PropTypes?.string,
    timestamp: PropTypes?.string?.isRequired,
    status: PropTypes?.oneOf(['sent', 'delivered', 'read']),
    imageUrl: PropTypes?.string,
    imageAlt: PropTypes?.string,
    orderId: PropTypes?.string,
    orderTitle: PropTypes?.string,
    orderAmount: PropTypes?.string
  })?.isRequired,
  isOwn: PropTypes?.bool?.isRequired
};