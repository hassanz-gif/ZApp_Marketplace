import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function DashboardStats({ stats }) {
  const statCards = [
    {
      id: 1,
      title: 'Active Orders',
      value: stats?.activeOrders,
      icon: 'ShoppingBagIcon',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12%',
      changeType: 'increase'
    },
    {
      id: 2,
      title: 'Total Spent',
      value: `$${stats?.totalSpent?.toLocaleString()}`,
      icon: 'CurrencyDollarIcon',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+8%',
      changeType: 'increase'
    },
    {
      id: 3,
      title: 'Wishlist Items',
      value: stats?.wishlistItems,
      icon: 'HeartIcon',
      color: 'text-error',
      bgColor: 'bg-error/10',
      change: '+5',
      changeType: 'increase'
    },
    {
      id: 4,
      title: 'Saved Searches',
      value: stats?.savedSearches,
      icon: 'BookmarkIcon',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: '2 new',
      changeType: 'neutral'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {statCards?.map((stat) => (
        <div
          key={stat?.id}
          className="bg-card border border-border rounded-lg p-5 hover:shadow-lg transition-smooth"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                {stat?.title}
              </p>
              <p className="text-2xl font-semibold text-foreground mb-2">
                {stat?.value}
              </p>
              <div className="flex items-center space-x-1">
                <span className={`text-xs font-medium ${
                  stat?.changeType === 'increase' ? 'text-success' : 
                  stat?.changeType === 'decrease'? 'text-error' : 'text-muted-foreground'
                }`}>
                  {stat?.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className={`${stat?.bgColor} ${stat?.color} p-3 rounded-lg`}>
              <Icon name={stat?.icon} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

DashboardStats.propTypes = {
  stats: PropTypes?.shape({
    activeOrders: PropTypes?.number?.isRequired,
    totalSpent: PropTypes?.number?.isRequired,
    wishlistItems: PropTypes?.number?.isRequired,
    savedSearches: PropTypes?.number?.isRequired
  })?.isRequired
};