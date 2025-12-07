'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function DeliveryOptions({ options, onOptionSelect }) {
  const [selectedOption, setSelectedOption] = useState(options?.[0]?.id || null);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    const option = options?.find((opt) => opt?.id === optionId);
    if (option) {
      onOptionSelect(option);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Delivery Options</h2>
      <div className="space-y-3">
        {options?.map((option) => (
          <div
            key={option?.id}
            onClick={() => handleOptionSelect(option?.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-smooth ${
              selectedOption === option?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Icon name={option?.icon} size={24} className="text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">{option?.name}</h3>
                    <p className="text-sm text-muted-foreground">{option?.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-3 ml-9">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Icon name="ClockIcon" size={16} />
                    <span>{option?.estimatedDelivery}</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {option?.price === 0 ? 'FREE' : `$${option?.price?.toFixed(2)}`}
                  </div>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-smooth ${
                  selectedOption === option?.id
                    ? 'border-primary bg-primary' :'border-border'
                }`}
              >
                {selectedOption === option?.id && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

DeliveryOptions.propTypes = {
  options: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      name: PropTypes?.string?.isRequired,
      description: PropTypes?.string?.isRequired,
      estimatedDelivery: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired,
      icon: PropTypes?.string?.isRequired,
    })
  )?.isRequired,
  onOptionSelect: PropTypes?.func?.isRequired,
};