'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function CartSummary({ subtotal, tax, shipping, total, itemCount, onApplyPromoCode }) {
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyPromo = () => {
    if (!promoCode?.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setIsApplying(true);
    setPromoError('');
    setPromoSuccess('');

    // Simulate API call
    setTimeout(() => {
      if (promoCode?.toUpperCase() === 'SAVE10') {
        setPromoSuccess('Promo code applied! You saved $10.00');
        onApplyPromoCode(promoCode, 10);
      } else {
        setPromoError('Invalid promo code');
      }
      setIsApplying(false);
    }, 800);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
          <span className="font-medium text-foreground">${subtotal?.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span className="font-medium text-foreground">${tax?.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-foreground">
            {shipping === 0 ? 'FREE' : `$${shipping?.toFixed(2)}`}
          </span>
        </div>
      </div>
      <div className="border-t border-border pt-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">${total?.toFixed(2)}</span>
        </div>
      </div>
      {/* Promo Code */}
      <div className="mb-4">
        <label htmlFor="promoCode" className="block text-sm font-medium text-foreground mb-2">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="promoCode"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e?.target?.value);
              setPromoError('');
              setPromoSuccess('');
            }}
            placeholder="Enter code"
            className="flex-1 h-10 px-3 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
          />
          <button
            onClick={handleApplyPromo}
            disabled={isApplying}
            className="px-4 h-10 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </button>
        </div>
        {promoError && (
          <p className="text-sm text-error mt-2 flex items-center gap-1">
            <Icon name="ExclamationCircleIcon" size={16} />
            {promoError}
          </p>
        )}
        {promoSuccess && (
          <p className="text-sm text-success mt-2 flex items-center gap-1">
            <Icon name="CheckCircleIcon" size={16} />
            {promoSuccess}
          </p>
        )}
      </div>
      {/* Checkout Button */}
      <Link
        href="/checkout-process"
        className="w-full h-12 flex items-center justify-center bg-primary text-primary-foreground text-base font-semibold rounded-lg hover:bg-primary/90 transition-smooth mb-3"
      >
        Proceed to Checkout
      </Link>
      <Link
        href="/marketplace-home"
        className="w-full h-10 flex items-center justify-center text-sm text-primary hover:text-primary/80 transition-smooth"
      >
        Continue Shopping
      </Link>
      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="ShieldCheckIcon" size={20} className="text-success" />
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="TruckIcon" size={20} className="text-primary" />
            <span>Free shipping on orders over $50</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="ArrowPathIcon" size={20} className="text-accent" />
            <span>30-day return policy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

CartSummary.propTypes = {
  subtotal: PropTypes?.number?.isRequired,
  tax: PropTypes?.number?.isRequired,
  shipping: PropTypes?.number?.isRequired,
  total: PropTypes?.number?.isRequired,
  itemCount: PropTypes?.number?.isRequired,
  onApplyPromoCode: PropTypes?.func?.isRequired,
};