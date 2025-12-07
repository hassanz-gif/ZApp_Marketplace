'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function ShippingCalculator({ onCalculate }) {
  const [zipCode, setZipCode] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    if (!zipCode?.trim()) {
      setError('Please enter a ZIP code');
      return;
    }

    if (!/^\d{5}$/?.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    setIsCalculating(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const mockShippingInfo = {
        standard: { cost: 0, days: '5-7 business days' },
        express: { cost: 15.99, days: '2-3 business days' },
        overnight: { cost: 29.99, days: '1 business day' },
      };
      setShippingInfo(mockShippingInfo);
      onCalculate(mockShippingInfo);
      setIsCalculating(false);
    }, 1000);
  };

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4">
      <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
        <Icon name="CalculatorIcon" size={20} />
        Calculate Shipping
      </h3>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={zipCode}
          onChange={(e) => {
            setZipCode(e?.target?.value);
            setError('');
          }}
          placeholder="Enter ZIP code"
          maxLength={5}
          className="flex-1 h-10 px-3 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
        />
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="px-4 h-10 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
        >
          {isCalculating ? 'Calculating...' : 'Calculate'}
        </button>
      </div>
      {error && (
        <p className="text-sm text-error flex items-center gap-1 mb-3">
          <Icon name="ExclamationCircleIcon" size={16} />
          {error}
        </p>
      )}
      {shippingInfo && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm p-2 bg-background rounded-md">
            <div className="flex items-center gap-2">
              <Icon name="TruckIcon" size={16} className="text-success" />
              <div>
                <p className="font-medium text-foreground">Standard Shipping</p>
                <p className="text-xs text-muted-foreground">{shippingInfo?.standard?.days}</p>
              </div>
            </div>
            <span className="font-semibold text-success">FREE</span>
          </div>
          <div className="flex items-center justify-between text-sm p-2 bg-background rounded-md">
            <div className="flex items-center gap-2">
              <Icon name="BoltIcon" size={16} className="text-primary" />
              <div>
                <p className="font-medium text-foreground">Express Shipping</p>
                <p className="text-xs text-muted-foreground">{shippingInfo?.express?.days}</p>
              </div>
            </div>
            <span className="font-semibold text-foreground">${shippingInfo?.express?.cost?.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm p-2 bg-background rounded-md">
            <div className="flex items-center gap-2">
              <Icon name="RocketLaunchIcon" size={16} className="text-accent" />
              <div>
                <p className="font-medium text-foreground">Overnight Shipping</p>
                <p className="text-xs text-muted-foreground">{shippingInfo?.overnight?.days}</p>
              </div>
            </div>
            <span className="font-semibold text-foreground">${shippingInfo?.overnight?.cost?.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

ShippingCalculator.propTypes = {
  onCalculate: PropTypes?.func?.isRequired,
};