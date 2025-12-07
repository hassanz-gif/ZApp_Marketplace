'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function ProductTabs({ description, specifications, shipping, returns }) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description', icon: 'DocumentTextIcon' },
    { id: 'specifications', label: 'Specifications', icon: 'ListBulletIcon' },
    { id: 'shipping', label: 'Shipping', icon: 'TruckIcon' },
    { id: 'returns', label: 'Returns', icon: 'ArrowUturnLeftIcon' },
  ];

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-border overflow-x-auto">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-smooth ${
              activeTab === tab?.id
                ? 'text-primary border-b-2 border-primary bg-muted' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon name={tab?.icon} size={20} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-line">{description}</p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="space-y-3">
            {specifications?.map((spec, index) => (
              <div
                key={index}
                className="flex py-3 border-b border-border last:border-0"
              >
                <span className="w-1/3 text-sm font-medium text-foreground">{spec?.label}:</span>
                <span className="w-2/3 text-sm text-muted-foreground">{spec?.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Icon name="TruckIcon" size={24} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Standard Shipping</h4>
                <p className="text-sm text-muted-foreground">{shipping?.standard}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Icon name="BoltIcon" size={24} className="text-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Express Shipping</h4>
                <p className="text-sm text-muted-foreground">{shipping?.express}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Icon name="MapPinIcon" size={24} className="text-success flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">International</h4>
                <p className="text-sm text-muted-foreground">{shipping?.international}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Icon name="ClockIcon" size={24} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Return Window</h4>
                <p className="text-sm text-muted-foreground">{returns?.window}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Icon name="ShieldCheckIcon" size={24} className="text-success flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Conditions</h4>
                <p className="text-sm text-muted-foreground">{returns?.conditions}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Icon name="CurrencyDollarIcon" size={24} className="text-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Refund Process</h4>
                <p className="text-sm text-muted-foreground">{returns?.refund}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ProductTabs.propTypes = {
  description: PropTypes?.string?.isRequired,
  specifications: PropTypes?.arrayOf(
    PropTypes?.shape({
      label: PropTypes?.string?.isRequired,
      value: PropTypes?.string?.isRequired,
    })
  )?.isRequired,
  shipping: PropTypes?.shape({
    standard: PropTypes?.string?.isRequired,
    express: PropTypes?.string?.isRequired,
    international: PropTypes?.string?.isRequired,
  })?.isRequired,
  returns: PropTypes?.shape({
    window: PropTypes?.string?.isRequired,
    conditions: PropTypes?.string?.isRequired,
    refund: PropTypes?.string?.isRequired,
  })?.isRequired,
};