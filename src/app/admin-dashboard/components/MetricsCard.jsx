import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function MetricsCard({ title, value, change, changeType, icon, iconColor }) {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-smooth">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mb-2">{value}</h3>
          {change && (
            <div className="flex items-center space-x-1">
              <Icon 
                name={isPositive ? 'ArrowUpIcon' : isNegative ? 'ArrowDownIcon' : 'MinusIcon'} 
                size={16} 
                className={isPositive ? 'text-success' : isNegative ? 'text-error' : 'text-muted-foreground'}
              />
              <span className={`text-sm font-medium ${isPositive ? 'text-success' : isNegative ? 'text-error' : 'text-muted-foreground'}`}>
                {change}
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}

MetricsCard.propTypes = {
  title: PropTypes?.string?.isRequired,
  value: PropTypes?.string?.isRequired,
  change: PropTypes?.string,
  changeType: PropTypes?.oneOf(['positive', 'negative', 'neutral']),
  icon: PropTypes?.string?.isRequired,
  iconColor: PropTypes?.string?.isRequired
};