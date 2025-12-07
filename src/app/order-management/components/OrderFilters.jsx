'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function OrderFilters({ onFilterChange, activeFilters }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Orders', count: 45 },
    { value: 'pending', label: 'Pending', count: 8 },
    { value: 'processing', label: 'Processing', count: 12 },
    { value: 'shipped', label: 'Shipped', count: 15 },
    { value: 'delivered', label: 'Delivered', count: 7 },
    { value: 'cancelled', label: 'Cancelled', count: 3 }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: 'year', label: 'Last Year' }
  ];

  const handleStatusChange = (status) => {
    onFilterChange({ ...activeFilters, status });
  };

  const handleDateRangeChange = (dateRange) => {
    onFilterChange({ ...activeFilters, dateRange });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ ...activeFilters, search: e?.target?.value });
  };

  const clearFilters = () => {
    onFilterChange({ status: 'all', dateRange: 'all', search: '' });
  };

  const activeFilterCount = [
    activeFilters?.status !== 'all',
    activeFilters?.dateRange !== 'all',
    activeFilters?.search !== ''
  ]?.filter(Boolean)?.length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden p-4 border-b border-border">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-foreground"
        >
          <div className="flex items-center space-x-2">
            <Icon name="FunnelIcon" size={20} />
            <span className="font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={20} />
        </button>
      </div>
      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        {/* Search Bar */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <input
              type="text"
              value={activeFilters?.search}
              onChange={handleSearchChange}
              placeholder="Search by order number, product, or seller..."
              className="w-full h-10 pl-10 pr-4 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            />
            <Icon
              name="MagnifyingGlassIcon"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Order Status</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {statusOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => handleStatusChange(option?.value)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                  activeFilters?.status === option?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <span>{option?.label}</span>
                <span className="ml-1.5 text-xs opacity-75">({option?.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Date Range</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {dateRangeOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => handleDateRangeChange(option?.value)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                  activeFilters?.dateRange === option?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {option?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <div className="p-4">
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-md hover:bg-muted/80 transition-smooth"
            >
              <Icon name="XMarkIcon" size={16} />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

OrderFilters.propTypes = {
  onFilterChange: PropTypes?.func?.isRequired,
  activeFilters: PropTypes?.shape({
    status: PropTypes?.string?.isRequired,
    dateRange: PropTypes?.string?.isRequired,
    search: PropTypes?.string?.isRequired
  })?.isRequired
};