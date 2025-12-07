'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import SavedForLater from './SavedForLater';
import ShippingCalculator from './ShippingCalculator';
import Icon from '@/components/ui/AppIcon';

export default function ShoppingCartInteractive({ initialCartItems, initialSavedItems, recommendedProducts }) {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [savedItems, setSavedItems] = useState(initialSavedItems);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [notification, setNotification] = useState(null);

  const TAX_RATE = 0.08;
  const FREE_SHIPPING_THRESHOLD = 50;

  useEffect(() => {
    setShowBulkActions(selectedItems?.length > 0);
  }, [selectedItems]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const calculateSubtotal = () => {
    return cartItems?.reduce((sum, item) => sum + item?.price * item?.quantity, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * TAX_RATE;
  };

  const calculateShipping = (subtotal) => {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems?.map((item) =>
        item?.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    showNotification('Quantity updated');
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems?.filter((item) => item?.id !== itemId));
    setSelectedItems((prevSelected) => prevSelected?.filter((id) => id !== itemId));
    showNotification('Item removed from cart');
  };

  const handleSaveForLater = (itemId) => {
    const item = cartItems?.find((i) => i?.id === itemId);
    if (item) {
      setSavedItems((prevItems) => [...prevItems, item]);
      setCartItems((prevItems) => prevItems?.filter((i) => i?.id !== itemId));
      showNotification('Item saved for later');
    }
  };

  const handleMoveToWishlist = (itemId) => {
    setCartItems((prevItems) => prevItems?.filter((item) => item?.id !== itemId));
    showNotification('Item moved to wishlist');
  };

  const handleMoveToCart = (itemId) => {
    const item = savedItems?.find((i) => i?.id === itemId);
    if (item) {
      setCartItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
      setSavedItems((prevItems) => prevItems?.filter((i) => i?.id !== itemId));
      showNotification('Item moved to cart');
    }
  };

  const handleRemoveSaved = (itemId) => {
    setSavedItems((prevItems) => prevItems?.filter((item) => item?.id !== itemId));
    showNotification('Item removed');
  };

  const handleApplyPromoCode = (code, discount) => {
    showNotification(`Promo code "${code}" applied successfully!`);
  };

  const handleShippingCalculate = (shippingInfo) => {
    showNotification('Shipping options calculated');
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected?.includes(itemId)
        ? prevSelected?.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems?.length === cartItems?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems?.map((item) => item?.id));
    }
  };

  const handleBulkRemove = () => {
    setCartItems((prevItems) => prevItems?.filter((item) => !selectedItems?.includes(item?.id)));
    setSelectedItems([]);
    showNotification(`${selectedItems?.length} items removed from cart`);
  };

  const handleBulkSaveForLater = () => {
    const itemsToSave = cartItems?.filter((item) => selectedItems?.includes(item?.id));
    setSavedItems((prevItems) => [...prevItems, ...itemsToSave]);
    setCartItems((prevItems) => prevItems?.filter((item) => !selectedItems?.includes(item?.id)));
    setSelectedItems([]);
    showNotification(`${itemsToSave?.length} items saved for later`);
  };

  if (cartItems?.length === 0) {
    return <EmptyCart recommendedProducts={recommendedProducts} />;
  }

  return (
    <div className="relative">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-modal ${
              notification?.type === 'success' ?'bg-success text-success-foreground' :'bg-error text-error-foreground'
            }`}
          >
            <Icon
              name={notification?.type === 'success' ? 'CheckCircleIcon' : 'ExclamationCircleIcon'}
              size={20}
            />
            <span className="text-sm font-medium">{notification?.message}</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          {/* Bulk Actions */}
          <div className="bg-card border border-border rounded-lg p-4 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems?.length === cartItems?.length}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring cursor-pointer"
                  aria-label="Select all items"
                />
                <span className="text-sm font-medium text-foreground">
                  {selectedItems?.length > 0
                    ? `${selectedItems?.length} item${selectedItems?.length > 1 ? 's' : ''} selected`
                    : 'Select all'}
                </span>
              </div>
              {showBulkActions && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkSaveForLater}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
                  >
                    <Icon name="BookmarkIcon" size={16} />
                    <span className="hidden sm:inline">Save Selected</span>
                  </button>
                  <button
                    onClick={handleBulkRemove}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-error hover:bg-error/10 rounded-md transition-smooth"
                  >
                    <Icon name="TrashIcon" size={16} />
                    <span className="hidden sm:inline">Remove Selected</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems?.map((item) => (
              <div key={item?.id} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems?.includes(item?.id)}
                  onChange={() => handleSelectItem(item?.id)}
                  className="mt-6 w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring cursor-pointer flex-shrink-0"
                  aria-label={`Select ${item?.name}`}
                />
                <div className="flex-1">
                  <CartItem
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    onSaveForLater={handleSaveForLater}
                    onMoveToWishlist={handleMoveToWishlist}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Calculator */}
          <div className="mt-6">
            <ShippingCalculator onCalculate={handleShippingCalculate} />
          </div>

          {/* Saved for Later */}
          <SavedForLater
            items={savedItems}
            onMoveToCart={handleMoveToCart}
            onRemove={handleRemoveSaved}
          />
        </div>

        {/* Cart Summary Section */}
        <div className="lg:col-span-1">
          <CartSummary
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            total={total}
            itemCount={cartItems?.reduce((sum, item) => sum + item?.quantity, 0)}
            onApplyPromoCode={handleApplyPromoCode}
          />
        </div>
      </div>
    </div>
  );
}

ShoppingCartInteractive.propTypes = {
  initialCartItems: PropTypes?.arrayOf(
    PropTypes?.shape({
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
    })
  )?.isRequired,
  initialSavedItems: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      name: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired,
      image: PropTypes?.string?.isRequired,
      imageAlt: PropTypes?.string?.isRequired,
    })
  )?.isRequired,
  recommendedProducts: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      name: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired,
      rating: PropTypes?.number?.isRequired,
      image: PropTypes?.string?.isRequired,
      imageAlt: PropTypes?.string?.isRequired,
    })
  )?.isRequired,
};