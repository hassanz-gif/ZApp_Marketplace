'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function LiveActivity({ activities }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities?.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [activities?.length]);

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-border rounded-lg p-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-success rounded-full animate-ping"></div>
          </div>
          <span className="text-sm font-semibold text-foreground">Live Activity</span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="UserGroupIcon" size={16} />
          <span>1,234 active users</span>
        </div>
      </div>
      <div className="mt-3 overflow-hidden">
        <div
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: `translateY(-${currentIndex * 100}%)` }}
        >
          {activities?.map((activity, index) => (
            <div key={index} className="h-6 flex items-center text-sm text-foreground">
              <Icon name={activity?.icon} size={16} className="mr-2 text-primary" />
              <span className="font-medium mr-1">{activity?.user}</span>
              <span className="text-muted-foreground">{activity?.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

LiveActivity.propTypes = {
  activities: PropTypes?.arrayOf(
    PropTypes?.shape({
      user: PropTypes?.string?.isRequired,
      action: PropTypes?.string?.isRequired,
      icon: PropTypes?.string?.isRequired,
    })
  )?.isRequired,
};