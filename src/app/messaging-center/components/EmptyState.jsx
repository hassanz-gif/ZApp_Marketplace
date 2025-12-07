import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function EmptyState({ type }) {
  const content = {
    noConversation: {
      icon: 'ChatBubbleLeftRightIcon',
      title: 'Select a conversation',
      description: 'Choose a conversation from the list to start messaging'
    },
    noMessages: {
      icon: 'InboxIcon',
      title: 'No messages yet',
      description: 'Start a conversation with buyers or sellers to see messages here'
    }
  };

  const { icon, title, description } = content?.[type] || content?.noConversation;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-background">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon name={icon} size={40} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}

EmptyState.propTypes = {
  type: PropTypes?.oneOf(['noConversation', 'noMessages'])?.isRequired
};