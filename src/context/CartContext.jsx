'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isLoading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get storage key based on user ID
  const getCartKey = (userId) => userId ? `cart_${userId}` : 'cart_guest';
  const getSavedKey = (userId) => userId ? `savedForLater_${userId}` : 'savedForLater_guest';

  // Load cart when user changes
  useEffect(() => {
    if (authLoading) return;

    const userId = user?.id || user?.email || null;

    // If user changed, save current cart and load new user's cart
    if (userId !== currentUserId) {
      // Save current cart for previous user before switching
      if (currentUserId !== null && !isLoading) {
        localStorage.setItem(getCartKey(currentUserId), JSON.stringify(cartItems));
        localStorage.setItem(getSavedKey(currentUserId), JSON.stringify(savedItems));
      }

      // Load new user's cart
      setCurrentUserId(userId);
      loadCartForUser(userId);
    }
  }, [user, authLoading]);

  const loadCartForUser = (userId) => {
    setIsLoading(true);
    try {
      const cartKey = getCartKey(userId);
      const savedKey = getSavedKey(userId);

      const storedCart = localStorage.getItem(cartKey);
      const storedSaved = localStorage.getItem(savedKey);

      setCartItems(storedCart ? JSON.parse(storedCart) : []);
      setSavedItems(storedSaved ? JSON.parse(storedSaved) : []);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
      setSavedItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && currentUserId !== null) {
      localStorage.setItem(getCartKey(currentUserId), JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading, currentUserId]);

  // Save savedItems to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && currentUserId !== null) {
      localStorage.setItem(getSavedKey(currentUserId), JSON.stringify(savedItems));
    }
  }, [savedItems, isLoading, currentUserId]);

  // Add item to cart
  const addToCart = (product, quantity = 1, variant = null) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart (same product and variant)
      const existingIndex = prevItems.findIndex(
        item => item.productId === product.id && item.variant === variant
      );

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity
        };
        return updatedItems;
      }

      // Add new item
      const newItem = {
        id: `cart-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        stock: product.stock || 99,
        image: product.image,
        imageAlt: product.alt || product.imageAlt || product.name,
        sellerId: product.sellerId || 'seller-1',
        sellerName: product.sellerName || 'ZApp Seller',
        sellerVerified: product.sellerVerified ?? true,
        variant: variant,
        estimatedDelivery: getEstimatedDelivery()
      };

      return [...prevItems, newItem];
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Save item for later
  const saveForLater = (itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      setSavedItems(prevItems => [...prevItems, item]);
      setCartItems(prevItems => prevItems.filter(i => i.id !== itemId));
    }
  };

  // Move saved item back to cart
  const moveToCart = (itemId) => {
    const item = savedItems.find(i => i.id === itemId);
    if (item) {
      setCartItems(prevItems => [...prevItems, { ...item, quantity: 1 }]);
      setSavedItems(prevItems => prevItems.filter(i => i.id !== itemId));
    }
  };

  // Remove saved item
  const removeSaved = (itemId) => {
    setSavedItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get cart item count
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Get cart subtotal
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Check if product is in cart
  const isInCart = (productId, variant = null) => {
    return cartItems.some(item => item.productId === productId && item.variant === variant);
  };

  // Get quantity of a product in cart
  const getQuantityInCart = (productId, variant = null) => {
    const item = cartItems.find(item => item.productId === productId && item.variant === variant);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    savedItems,
    isLoading,
    cartItemCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCart,
    removeSaved,
    clearCart,
    isInCart,
    getQuantityInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Helper function to get estimated delivery date
function getEstimatedDelivery() {
  const today = new Date();
  const minDays = 3;
  const maxDays = 7;

  const minDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDays);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}

export default CartContext;
