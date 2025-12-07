import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function MetricsCard({ title, value, change, changeType, icon, trend }) {
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
                name={isPositive ? 'ArrowTrendingUpIcon' : isNegative ? 'ArrowTrendingDownIcon' : 'MinusIcon'} 
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
        <div className={`p-3 rounded-lg ${isPositive ? 'bg-success/10' : isNegative ? 'bg-error/10' : 'bg-primary/10'}`}>
          <Icon 
            name={icon} 
            size={24} 
            className={isPositive ? 'text-success' : isNegative ? 'text-error' : 'text-primary'}
          />
        </div>
      </div>
      {trend && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">{trend}</p>
        </div>
      )}
    </div>
  );
}

MetricsCard.propTypes = {
  title: PropTypes?.string?.isRequired,
  value: PropTypes?.string?.isRequired,
  change: PropTypes?.string,
  changeType: PropTypes?.oneOf(['positive', 'negative', 'neutral']),
  icon: PropTypes?.string?.isRequired,
  trend: PropTypes?.string
};