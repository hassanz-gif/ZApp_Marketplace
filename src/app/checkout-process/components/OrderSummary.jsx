'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

export default function OrderSummary({ items, subtotal, shipping, tax, discount, onApplyPromo }) {
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const total = subtotal + shipping + tax - discount;

  const handleApplyPromo = () => {
    if (!promoCode?.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    if (promoCode?.toUpperCase() === 'SAVE10') {
      onApplyPromo(subtotal * 0.1);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-6 sticky top-24">
      <h2 className="text-xl font-semibold text-foreground">Order Summary</h2>
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {items?.map((item) => (
          <div key={item?.id} className="flex items-start space-x-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <AppImage
                src={item?.image}
                alt={item?.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground truncate">{item?.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Qty: {item?.quantity}</p>
              <p className="text-sm font-semibold text-foreground mt-1">
                ${(item?.price * item?.quantity)?.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">${subtotal?.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-foreground">
            {shipping === 0 ? 'FREE' : `$${shipping?.toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium text-foreground">${tax?.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-success">Discount</span>
            <span className="font-medium text-success">-${discount?.toFixed(2)}</span>
          </div>
        )}
      </div>
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">${total?.toFixed(2)}</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e?.target?.value);
              setPromoError('');
            }}
            placeholder="Enter promo code"
            disabled={promoApplied}
            className="flex-1 px-4 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleApplyPromo}
            disabled={promoApplied}
            className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
        {promoError && (
          <p className="text-sm text-error flex items-center space-x-1">
            <Icon name="ExclamationCircleIcon" size={16} />
            <span>{promoError}</span>
          </p>
        )}
        {promoApplied && (
          <p className="text-sm text-success flex items-center space-x-1">
            <Icon name="CheckCircleIcon" size={16} />
            <span>Promo code applied successfully!</span>
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Use code <span className="font-semibold text-primary">SAVE10</span> for 10% off
        </p>
      </div>
      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
        <div className="flex items-center space-x-2">
          <Icon name="TruckIcon" size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="ArrowPathIcon" size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground">30-day return policy</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="ShieldCheckIcon" size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Secure checkout</span>
        </div>
      </div>
    </div>
  );
}

OrderSummary.propTypes = {
  items: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      name: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired,
      quantity: PropTypes?.number?.isRequired,
      image: PropTypes?.string?.isRequired,
      alt: PropTypes?.string?.isRequired,
    })
  )?.isRequired,
  subtotal: PropTypes?.number?.isRequired,
  shipping: PropTypes?.number?.isRequired,
  tax: PropTypes?.number?.isRequired,
  discount: PropTypes?.number?.isRequired,
  onApplyPromo: PropTypes?.func?.isRequired,
};