import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function RecentActivityItem({ activity }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return 'UserPlusIcon';
      case 'listing_created':
        return 'PlusCircleIcon';
      case 'transaction':
        return 'CurrencyDollarIcon';
      case 'dispute':
        return 'ExclamationTriangleIcon';
      case 'review':
        return 'StarIcon';
      default:
        return 'BellIcon';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_registration':
        return 'bg-blue-100 text-blue-600';
      case 'listing_created':
        return 'bg-green-100 text-green-600';
      case 'transaction':
        return 'bg-purple-100 text-purple-600';
      case 'dispute':
        return 'bg-red-100 text-red-600';
      case 'review':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-muted rounded-lg transition-smooth">
      <div className={`p-2 rounded-lg ${getActivityColor(activity?.type)}`}>
        <Icon name={getActivityIcon(activity?.type)} size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{activity?.title}</p>
        <p className="text-sm text-muted-foreground mt-1">{activity?.description}</p>
        <p className="text-xs text-muted-foreground mt-1">{activity?.timestamp}</p>
      </div>
    </div>
  );
}

RecentActivityItem.propTypes = {
  activity: PropTypes?.shape({
    id: PropTypes?.number?.isRequired,
    type: PropTypes?.string?.isRequired,
    title: PropTypes?.string?.isRequired,
    description: PropTypes?.string?.isRequired,
    timestamp: PropTypes?.string?.isRequired
  })?.isRequired
};