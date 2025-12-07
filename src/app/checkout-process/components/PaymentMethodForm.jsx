'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function PaymentMethodForm({ savedPaymentMethods, onPaymentSelect, onNewPayment }) {
  const [selectedPaymentId, setSelectedPaymentId] = useState(savedPaymentMethods?.[0]?.id || null);
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [paymentType, setPaymentType] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });
  const [errors, setErrors] = useState({});

  const handlePaymentSelection = (paymentId) => {
    setSelectedPaymentId(paymentId);
    const payment = savedPaymentMethods?.find((pm) => pm?.id === paymentId);
    if (payment) {
      onPaymentSelect(payment);
    }
    setShowNewPaymentForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors?.[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value?.replace(/\s/g, '');
    const formatted = cleaned?.match(/.{1,4}/g);
    return formatted ? formatted?.join(' ') : cleaned;
  };

  const formatExpiryDate = (value) => {
    const cleaned = value?.replace(/\D/g, '');
    if (cleaned?.length >= 2) {
      return `${cleaned?.slice(0, 2)}/${cleaned?.slice(2, 4)}`;
    }
    return cleaned;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.cardNumber?.replace(/\s/g, '')?.trim() || formData?.cardNumber?.replace(/\s/g, '')?.length !== 16) {
      newErrors.cardNumber = 'Valid card number is required';
    }
    if (!formData?.cardholderName?.trim()) newErrors.cardholderName = 'Cardholder name is required';
    if (!formData?.expiryDate?.trim() || formData?.expiryDate?.length !== 5) {
      newErrors.expiryDate = 'Valid expiry date is required (MM/YY)';
    }
    if (!formData?.cvv?.trim() || formData?.cvv?.length < 3) {
      newErrors.cvv = 'Valid CVV is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSavePayment = () => {
    if (validateForm()) {
      onNewPayment({
        ...formData,
        type: paymentType,
      });
      setShowNewPaymentForm(false);
      setFormData({
        cardNumber: '',
        cardholderName: '',
        expiryDate: '',
        cvv: '',
        saveCard: false,
      });
    }
  };

  const paymentTypeOptions = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCardIcon' },
    { id: 'paypal', name: 'PayPal', icon: 'CurrencyDollarIcon' },
    { id: 'apple', name: 'Apple Pay', icon: 'DevicePhoneMobileIcon' },
    { id: 'google', name: 'Google Pay', icon: 'DevicePhoneMobileIcon' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
        <button
          onClick={() => setShowNewPaymentForm(!showNewPaymentForm)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
        >
          <Icon name="PlusIcon" size={20} />
          <span>Add Payment Method</span>
        </button>
      </div>
      {!showNewPaymentForm && savedPaymentMethods?.length > 0 && (
        <div className="space-y-3">
          {savedPaymentMethods?.map((payment) => (
            <div
              key={payment?.id}
              onClick={() => handlePaymentSelection(payment?.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-smooth ${
                selectedPaymentId === payment?.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="CreditCardIcon" size={24} className="text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">
                      {payment?.type} •••• {payment?.lastFour}
                    </p>
                    <p className="text-sm text-muted-foreground">Expires {payment?.expiry}</p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-smooth ${
                    selectedPaymentId === payment?.id
                      ? 'border-primary bg-primary' :'border-border'
                  }`}
                >
                  {selectedPaymentId === payment?.id && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showNewPaymentForm && (
        <div className="bg-muted p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Add Payment Method</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {paymentTypeOptions?.map((option) => (
              <button
                key={option?.id}
                onClick={() => setPaymentType(option?.id)}
                className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-2 transition-smooth ${
                  paymentType === option?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <Icon name={option?.icon} size={24} className="text-primary" />
                <span className="text-xs font-medium text-foreground text-center">{option?.name}</span>
              </button>
            ))}
          </div>

          {paymentType === 'card' && (
            <>
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formatCardNumber(formData?.cardNumber)}
                  onChange={(e) => {
                    const value = e?.target?.value?.replace(/\s/g, '');
                    if (value?.length <= 16 && /^\d*$/?.test(value)) {
                      handleInputChange({
                        target: { name: 'cardNumber', value },
                      });
                    }
                  }}
                  className={`w-full px-4 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                    errors?.cardNumber ? 'border-error' : 'border-input'
                  }`}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {errors?.cardNumber && (
                  <p className="mt-1 text-sm text-error">{errors?.cardNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="cardholderName" className="block text-sm font-medium text-foreground mb-1">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={formData?.cardholderName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                    errors?.cardholderName ? 'border-error' : 'border-input'
                  }`}
                  placeholder="John Doe"
                />
                {errors?.cardholderName && (
                  <p className="mt-1 text-sm text-error">{errors?.cardholderName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-foreground mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formatExpiryDate(formData?.expiryDate)}
                    onChange={(e) => {
                      const value = e?.target?.value?.replace(/\D/g, '');
                      if (value?.length <= 4) {
                        handleInputChange({
                          target: { name: 'expiryDate', value },
                        });
                      }
                    }}
                    className={`w-full px-4 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                      errors?.expiryDate ? 'border-error' : 'border-input'
                    }`}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors?.expiryDate && (
                    <p className="mt-1 text-sm text-error">{errors?.expiryDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-foreground mb-1">
                    CVV *
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData?.cvv}
                    onChange={(e) => {
                      const value = e?.target?.value;
                      if (value?.length <= 4 && /^\d*$/?.test(value)) {
                        handleInputChange(e);
                      }
                    }}
                    className={`w-full px-4 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                      errors?.cvv ? 'border-error' : 'border-input'
                    }`}
                    placeholder="123"
                    maxLength={4}
                  />
                  {errors?.cvv && (
                    <p className="mt-1 text-sm text-error">{errors?.cvv}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="saveCard"
                  name="saveCard"
                  checked={formData?.saveCard}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-ring"
                />
                <label htmlFor="saveCard" className="text-sm text-foreground">
                  Save this card for future purchases
                </label>
              </div>
            </>
          )}

          {paymentType !== 'card' && (
            <div className="py-8 text-center">
              <Icon name="InformationCircleIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                You will be redirected to complete your payment with {paymentTypeOptions?.find(opt => opt?.id === paymentType)?.name}
              </p>
            </div>
          )}

          <div className="flex items-center space-x-3 pt-4">
            <button
              onClick={handleSavePayment}
              className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-smooth"
            >
              {paymentType === 'card' ? 'Save Payment Method' : 'Continue'}
            </button>
            <button
              onClick={() => {
                setShowNewPaymentForm(false);
                setErrors({});
              }}
              className="px-6 py-2 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-smooth"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="bg-muted/50 p-4 rounded-lg flex items-start space-x-3">
        <Icon name="ShieldCheckIcon" size={24} className="text-success flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">Secure Payment</p>
          <p className="text-xs text-muted-foreground mt-1">
            Your payment information is encrypted and secure. We never store your full card details.
          </p>
        </div>
      </div>
    </div>
  );
}

PaymentMethodForm.propTypes = {
  savedPaymentMethods: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      type: PropTypes?.string?.isRequired,
      lastFour: PropTypes?.string?.isRequired,
      expiry: PropTypes?.string?.isRequired,
    })
  )?.isRequired,
  onPaymentSelect: PropTypes?.func?.isRequired,
  onNewPayment: PropTypes?.func?.isRequired,
};