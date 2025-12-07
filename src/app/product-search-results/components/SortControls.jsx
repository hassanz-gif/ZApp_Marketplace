'use client';

import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function SortControls({ sortBy, onSortChange }) {
  const sortOptions = [
    { value: 'relevance', label: 'Relevance', icon: 'SparklesIcon' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'ArrowUpIcon' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'ArrowDownIcon' },
    { value: 'rating', label: 'Highest Rated', icon: 'StarIcon' },
    { value: 'newest', label: 'Newest First', icon: 'ClockIcon' },
    { value: 'popular', label: 'Most Popular', icon: 'FireIcon' }
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      <span className="text-sm font-medium text-foreground whitespace-nowrap">Sort by:</span>
      <div className="flex items-center space-x-2">
        {sortOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => onSortChange(option?.value)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-smooth whitespace-nowrap ${
              sortBy === option?.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name={option?.icon} size={16} />
            <span>{option?.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

SortControls.propTypes = {
  sortBy: PropTypes?.string?.isRequired,
  onSortChange: PropTypes?.func?.isRequired
};