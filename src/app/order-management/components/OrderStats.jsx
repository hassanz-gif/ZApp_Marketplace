import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function OrderStats({ stats }) {
  const statCards = [
    {
      label: 'Total Orders',
      value: stats?.totalOrders,
      icon: 'ShoppingBagIcon',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'In Progress',
      value: stats?.inProgress,
      icon: 'ClockIcon',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Delivered',
      value: stats?.delivered,
      icon: 'CheckCircleIcon',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Total Spent',
      value: `$${stats?.totalSpent?.toFixed(2)}`,
      icon: 'CurrencyDollarIcon',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards?.map((stat) => (
        <div
          key={stat?.label}
          className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-smooth"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">{stat?.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
            </div>
            <div className={`p-2 rounded-lg ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

OrderStats.propTypes = {
  stats: PropTypes?.shape({
    totalOrders: PropTypes?.number?.isRequired,
    inProgress: PropTypes?.number?.isRequired,
    delivered: PropTypes?.number?.isRequired,
    totalSpent: PropTypes?.number?.isRequired
  })?.isRequired
};