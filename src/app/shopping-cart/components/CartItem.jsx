'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function CartItem({ item, onQuantityChange, onRemove, onSaveForLater, onMoveToWishlist }) {
  const [quantity, setQuantity] = useState(item?.quantity);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(item?.id, newQuantity);
    }
  };

  const handleQuantityIncrease = () => {
    if (quantity < item?.stock) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange(item?.id, newQuantity);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(item?.id);
    }, 300);
  };

  const itemTotal = (item?.price * quantity)?.toFixed(2);

  return (
    <div className={`bg-card border border-border rounded-lg p-4 transition-all duration-300 ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <Link href={`/product-details?id=${item?.id}`} className="flex-shrink-0">
          <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-muted">
            <AppImage
              src={item?.image}
              alt={item?.imageAlt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link href={`/product-details?id=${item?.id}`} className="group">
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-smooth truncate">
                  {item?.name}
                </h3>
              </Link>
              
              <Link href={`/seller-dashboard?id=${item?.sellerId}`} className="inline-flex items-center gap-1 mt-1 text-sm text-muted-foreground hover:text-primary transition-smooth">
                <Icon name="BuildingStorefrontIcon" size={16} />
                <span>{item?.sellerName}</span>
                {item?.sellerVerified && (
                  <Icon name="CheckBadgeIcon" size={16} className="text-primary" />
                )}
              </Link>

              {item?.variant && (
                <p className="text-sm text-muted-foreground mt-1">
                  Variant: {item?.variant}
                </p>
              )}

              {item?.stock < 10 && (
                <p className="text-sm text-warning mt-1 flex items-center gap-1">
                  <Icon name="ExclamationTriangleIcon" size={16} />
                  Only {item?.stock} left in stock
                </p>
              )}

              {item?.estimatedDelivery && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <Icon name="TruckIcon" size={16} />
                  Estimated delivery: {item?.estimatedDelivery}
                </p>
              )}
            </div>

            {/* Price - Desktop */}
            <div className="hidden sm:block text-right">
              <p className="text-lg font-bold text-foreground">${itemTotal}</p>
              <p className="text-sm text-muted-foreground">${item?.price?.toFixed(2)} each</p>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={handleQuantityDecrease}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
                aria-label="Decrease quantity"
              >
                <Icon name="MinusIcon" size={20} />
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-12 h-10 text-center text-sm font-medium text-foreground bg-transparent border-x border-border focus:outline-none"
                aria-label="Quantity"
              />
              <button
                onClick={handleQuantityIncrease}
                disabled={quantity >= item?.stock}
                className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
                aria-label="Increase quantity"
              >
                <Icon name="PlusIcon" size={20} />
              </button>
            </div>

            {/* Price - Mobile */}
            <div className="sm:hidden flex-1">
              <p className="text-lg font-bold text-foreground">${itemTotal}</p>
              <p className="text-sm text-muted-foreground">${item?.price?.toFixed(2)} each</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button
              onClick={() => onSaveForLater(item?.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
            >
              <Icon name="BookmarkIcon" size={16} />
              <span>Save for Later</span>
            </button>
            <button
              onClick={() => onMoveToWishlist(item?.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
            >
              <Icon name="HeartIcon" size={16} />
              <span>Move to Wishlist</span>
            </button>
            <button
              onClick={handleRemove}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-error hover:bg-error/10 rounded-md transition-smooth"
            >
              <Icon name="TrashIcon" size={16} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes?.shape({
    id: PropTypes?.string?.isRequired,
    name: PropTypes?.string?.isRequired,
    price: PropTypes?.number?.isRequired,
    quantity: PropTypes?.number?.isRequired,
    stock: PropTypes?.number?.isRequired,
    image: PropTypes?.string?.isRequired,
    imageAlt: PropTypes?.string?.isRequired,
    sellerId: PropTypes?.string?.isRequired,
    sellerName: PropTypes?.string?.isRequired,
    sellerVerified: PropTypes?.bool,
    variant: PropTypes?.string,
    estimatedDelivery: PropTypes?.string,
  })?.isRequired,
  onQuantityChange: PropTypes?.func?.isRequired,
  onRemove: PropTypes?.func?.isRequired,
  onSaveForLater: PropTypes?.func?.isRequired,
  onMoveToWishlist: PropTypes?.func?.isRequired,
};