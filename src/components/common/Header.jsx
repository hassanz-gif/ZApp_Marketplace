'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Header({ notificationCount = 0 }) {
  const { user, isAuthenticated, userRole, logout, isLoading } = useAuth();
  const { cartItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const accountMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const cartPreviewRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef?.current && !accountMenuRef?.current?.contains(event?.target)) {
        setIsAccountMenuOpen(false);
      }
      if (notificationRef?.current && !notificationRef?.current?.contains(event?.target)) {
        setIsNotificationOpen(false);
      }
      if (cartPreviewRef?.current && !cartPreviewRef?.current?.contains(event?.target)) {
        setIsCartPreviewOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      window.location.href = `/product-search-results?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const getDashboardPath = () => {
    if (userRole === 'admin') return '/admin-dashboard';
    if (userRole === 'seller') return '/seller-dashboard';
    return '/user-dashboard';
  };

  const primaryNavItems = [
    { label: 'Home', path: '/marketplace-home', icon: 'HomeIcon' },
    { label: 'Search', path: '/product-search-results', icon: 'MagnifyingGlassIcon' },
    { label: 'Cart', path: '/shopping-cart', icon: 'ShoppingCartIcon', badge: cartItemCount },
  ];

  const accountMenuItems = isAuthenticated ? [
    { label: 'My Dashboard', path: getDashboardPath(), icon: 'UserCircleIcon' },
    { label: 'Orders', path: '/order-management', icon: 'ClipboardDocumentListIcon' },
    { label: 'Messages', path: '/messaging-center', icon: 'ChatBubbleLeftRightIcon' },
    ...(userRole === 'seller' ? [{ label: 'Seller Dashboard', path: '/seller-dashboard', icon: 'BuildingStorefrontIcon' }] : []),
    ...(userRole === 'admin' ? [{ label: 'Admin Panel', path: '/admin-dashboard', icon: 'Cog6ToothIcon' }] : []),
  ] : [];

  const mockNotifications = [
    { id: 1, title: 'Order Shipped', message: 'Your order #12345 has been shipped', time: '2 hours ago', unread: true },
    { id: 2, title: 'New Message', message: 'You have a new message from seller', time: '5 hours ago', unread: true },
    { id: 3, title: 'Price Drop', message: 'Item in your wishlist is now on sale', time: '1 day ago', unread: false },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-surface border-b border-border shadow-card">
      <div className="h-[60px] px-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/marketplace-home" className="flex items-center space-x-2 hover:opacity-80 transition-smooth">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="var(--color-primary)" />
            <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 8V16M16 16L24 12M16 16L8 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-semibold text-foreground hidden sm:block">ZApp</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          <Link 
            href="/marketplace-home"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
          >
            Home
          </Link>
          <Link 
            href="/product-search-results"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
          >
            Browse
          </Link>
          {isAuthenticated && (
            <>
              <Link 
                href="/order-management"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
              >
                Orders
              </Link>
              <Link 
                href="/messaging-center"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
              >
                Messages
              </Link>
            </>
          )}
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              placeholder="Search products..."
              className="w-full h-10 pl-10 pr-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
            />
            <Icon 
              name="MagnifyingGlassIcon" 
              size={20} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="md:hidden p-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
            aria-label="Toggle search"
          >
            <Icon name="MagnifyingGlassIcon" size={24} />
          </button>

          {/* Notifications */}
          {isAuthenticated && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
                aria-label="Notifications"
              >
                <Icon name="BellIcon" size={24} />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-error text-error-foreground text-xs font-medium rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-modal animate-fade-in">
                  <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications?.map((notification) => (
                      <div
                        key={notification?.id}
                        className={`p-4 border-b border-border hover:bg-muted transition-smooth cursor-pointer ${
                          notification?.unread ? 'bg-muted/50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{notification?.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{notification?.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification?.time}</p>
                          </div>
                          {notification?.unread && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border">
                    <Link
                      href="/messaging-center"
                      className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Shopping Cart */}
          <div className="relative" ref={cartPreviewRef}>
            <Link
              href="/shopping-cart"
              onMouseEnter={() => setIsCartPreviewOpen(true)}
              onMouseLeave={() => setIsCartPreviewOpen(false)}
              className="relative p-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
              aria-label="Shopping cart"
            >
              <Icon name="ShoppingCartIcon" size={24} />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            {isCartPreviewOpen && cartItemCount > 0 && (
              <div className="absolute right-0 mt-2 w-72 bg-popover border border-border rounded-lg shadow-modal animate-fade-in">
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">Cart Preview</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{cartItemCount} items in cart</p>
                  <Link
                    href="/shopping-cart"
                    className="mt-3 w-full inline-block text-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Account Menu */}
          {isAuthenticated ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="p-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
                aria-label="Account menu"
              >
                <Icon name="UserCircleIcon" size={24} />
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-modal animate-fade-in">
                  <div className="p-2">
                    {accountMenuItems?.map((item) => (
                      <Link
                        key={item?.path}
                        href={item?.path}
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-smooth"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        <Icon name={item?.icon} size={20} />
                        <span>{item?.label}</span>
                      </Link>
                    ))}
                    <div className="my-2 border-t border-border"></div>
                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-error hover:bg-muted rounded-md transition-smooth"
                    >
                      <Icon name="ArrowRightOnRectangleIcon" size={20} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/user-login"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
            aria-label="Toggle menu"
          >
            <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
          </button>
        </div>
      </div>
      {/* Mobile Search Expanded */}
      {isSearchExpanded && (
        <div className="md:hidden px-5 pb-4 border-t border-border animate-slide-in">
          <form onSubmit={handleSearchSubmit} className="relative mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              placeholder="Search products..."
              className="w-full h-10 pl-10 pr-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              autoFocus
            />
            <Icon 
              name="MagnifyingGlassIcon" 
              size={20} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </form>
        </div>
      )}
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] z-[1020] bg-black/50 animate-fade-in">
          <div className="bg-surface h-full overflow-y-auto">
            <nav className="p-4 space-y-1">
              <Link
                href="/marketplace-home"
                className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-md transition-smooth"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name="HomeIcon" size={20} />
                <span className="text-sm font-medium">Home</span>
              </Link>
              <Link
                href="/product-search-results"
                className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-md transition-smooth"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name="MagnifyingGlassIcon" size={20} />
                <span className="text-sm font-medium">Browse</span>
              </Link>
              <Link
                href="/shopping-cart"
                className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-md transition-smooth"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name="ShoppingCartIcon" size={20} />
                <span className="text-sm font-medium">Cart</span>
                {cartItemCount > 0 && (
                  <span className="ml-auto w-6 h-6 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated && (
                <>
                  <div className="my-4 border-t border-border"></div>
                  <Link
                    href={getDashboardPath()}
                    className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-md transition-smooth"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon name="UserCircleIcon" size={20} />
                    <span className="text-sm font-medium">My Dashboard</span>
                  </Link>
                  <Link
                    href="/order-management"
                    className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-md transition-smooth"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon name="ClipboardDocumentListIcon" size={20} />
                    <span className="text-sm font-medium">Orders</span>
                  </Link>
                  <Link
                    href="/messaging-center"
                    className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-md transition-smooth"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon name="ChatBubbleLeftRightIcon" size={20} />
                    <span className="text-sm font-medium">Messages</span>
                  </Link>
                  {userRole === 'seller' && (
                    <Link
                      href="/seller-dashboard"
                      className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-md transition-smooth"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon name="BuildingStorefrontIcon" size={20} />
                      <span className="text-sm font-medium">Seller Dashboard</span>
                    </Link>
                  )}
                  {userRole === 'admin' && (
                    <Link
                      href="/admin-dashboard"
                      className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-md transition-smooth"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon name="Cog6ToothIcon" size={20} />
                      <span className="text-sm font-medium">Admin Panel</span>
                    </Link>
                  )}
                </>
              )}

              <div className="my-4 border-t border-border"></div>

              {!isAuthenticated ? (
                <>
                  <Link
                    href="/user-login"
                    className="flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/user-registration"
                    className="flex items-center justify-center px-4 py-3 bg-muted text-foreground text-sm font-medium rounded-md hover:bg-muted/80 transition-smooth"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false); logout();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-error hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="ArrowRightOnRectangleIcon" size={20} />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}