'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function ShippingAddressForm({ savedAddresses, onAddressSelect, onNewAddress }) {
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses?.[0]?.id || null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses?.find((addr) => addr?.id === addressId);
    if (address) {
      onAddressSelect(address);
    }
    setShowNewAddressForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors?.[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!formData?.addressLine1?.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData?.city?.trim()) newErrors.city = 'City is required';
    if (!formData?.state?.trim()) newErrors.state = 'State is required';
    if (!formData?.zipCode?.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSaveAddress = () => {
    if (validateForm()) {
      onNewAddress(formData);
      setShowNewAddressForm(false);
      setFormData({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: '',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Shipping Address</h2>
        <button
          onClick={() => setShowNewAddressForm(!showNewAddressForm)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
        >
          <Icon name="PlusIcon" size={20} />
          <span>Add New Address</span>
        </button>
      </div>
      {!showNewAddressForm && savedAddresses?.length > 0 && (
        <div className="space-y-3">
          {savedAddresses?.map((address) => (
            <div
              key={address?.id}
              onClick={() => handleAddressSelection(address?.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-smooth ${
                selectedAddressId === address?.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-foreground">{address?.fullName}</span>
                    {address?.isDefault && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{address?.addressLine1}</p>
                  {address?.addressLine2 && (
                    <p className="text-sm text-muted-foreground">{address?.addressLine2}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {address?.city}, {address?.state} {address?.zipCode}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{address?.phone}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-smooth ${
                    selectedAddressId === address?.id
                      ? 'border-primary bg-primary' :'border-border'
                  }`}
                >
                  {selectedAddressId === address?.id && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showNewAddressForm && (
        <div className="bg-muted p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">New Shipping Address</h3>
          
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData?.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                errors?.fullName ? 'border-error' : 'border-input'
              }`}
              placeholder="John Doe"
            />
            {errors?.fullName && (
              <p className="mt-1 text-sm text-error">{errors?.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="addressLine1" className="block text-sm font-medium text-foreground mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={formData?.addressLine1}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                errors?.addressLine1 ? 'border-error' : 'border-input'
              }`}
              placeholder="123 Main Street"
            />
            {errors?.addressLine1 && (
              <p className="mt-1 text-sm text-error">{errors?.addressLine1}</p>
            )}
          </div>

          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium text-foreground mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={formData?.addressLine2}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-surface border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData?.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors?.city ? 'border-error' : 'border-input'
                }`}
                placeholder="New York"
              />
              {errors?.city && (
                <p className="mt-1 text-sm text-error">{errors?.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-foreground mb-1">
                State *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData?.state}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors?.state ? 'border-error' : 'border-input'
                }`}
                placeholder="NY"
              />
              {errors?.state && (
                <p className="mt-1 text-sm text-error">{errors?.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-foreground mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData?.zipCode}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors?.zipCode ? 'border-error' : 'border-input'
                }`}
                placeholder="10001"
              />
              {errors?.zipCode && (
                <p className="mt-1 text-sm text-error">{errors?.zipCode}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData?.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors?.phone ? 'border-error' : 'border-input'
                }`}
                placeholder="(555) 123-4567"
              />
              {errors?.phone && (
                <p className="mt-1 text-sm text-error">{errors?.phone}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              onClick={handleSaveAddress}
              className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-smooth"
            >
              Save Address
            </button>
            <button
              onClick={() => {
                setShowNewAddressForm(false);
                setErrors({});
              }}
              className="px-6 py-2 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-smooth"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

ShippingAddressForm.propTypes = {
  savedAddresses: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      fullName: PropTypes?.string?.isRequired,
      addressLine1: PropTypes?.string?.isRequired,
      addressLine2: PropTypes?.string,
      city: PropTypes?.string?.isRequired,
      state: PropTypes?.string?.isRequired,
      zipCode: PropTypes?.string?.isRequired,
      country: PropTypes?.string?.isRequired,
      phone: PropTypes?.string?.isRequired,
      isDefault: PropTypes?.bool,
    })
  )?.isRequired,
  onAddressSelect: PropTypes?.func?.isRequired,
  onNewAddress: PropTypes?.func?.isRequired,
};