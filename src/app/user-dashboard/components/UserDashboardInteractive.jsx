'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DashboardStats from './DashboardStats';
import RecentOrders from './RecentOrders';
import RecommendedProducts from './RecommendedProducts';
import WishlistPreview from './WishlistPreview';
import QuickActions from './QuickActions';
import RecentlyViewed from './RecentlyViewed';
import SavedSearches from './SavedSearches';
import AccountNotifications from './AccountNotifications';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/AppIcon';

export default function UserDashboardInteractive({ initialData }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(initialData?.stats || {
    activeOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    savedSearches: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id && !user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        const buyerId = user.id || user.email;
        const response = await fetch(`/api/orders?buyerId=${encodeURIComponent(buyerId)}&limit=5`);
        const data = await response.json();

        if (data.success) {
          // Transform orders to the format expected by RecentOrders component
          const transformedOrders = data.orders.map(order => {
            // Get first item from order for display
            const firstItem = order.items?.[0] || {};
            return {
              id: order.id,
              orderNumber: `ORD-${order.orderNumber}`,
              productName: firstItem.productName || `Order with ${order.items?.length || 0} item(s)`,
              image: firstItem.productImage || '/assets/images/no_image.png',
              imageAlt: firstItem.productName || 'Order item',
              price: order.total || 0,
              status: formatStatus(order.status),
              date: formatDate(order.createdAt)
            };
          });

          setOrders(transformedOrders);

          // Update stats from API response
          setStats(prev => ({
            ...prev,
            activeOrders: data.stats?.inProgress || 0,
            totalSpent: Math.round(data.stats?.totalSpent || 0)
          }));
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Format order status for display
  const formatStatus = (status) => {
    const statusMap = {
      'pending': 'Processing',
      'processing': 'Processing',
      'shipped': 'In Transit',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get display name - user has firstName/lastName from DB
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) return user.firstName;
    if (user?.businessName) return user.businessName;
    if (user?.email) return user.email.split('@')[0]; // Use email prefix as fallback
    return initialData?.userName || 'User';
  };
  const displayName = getUserDisplayName();
  const userRole = user?.accountType || initialData?.userRole || 'buyer';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'HomeIcon' },
    { id: 'orders', label: 'Orders', icon: 'ShoppingBagIcon' },
    { id: 'wishlist', label: 'Wishlist', icon: 'HeartIcon' },
    { id: 'searches', label: 'Saved Searches', icon: 'BookmarkIcon' }
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Icon name="ArrowPathIcon" size={32} className="animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  // Use fetched orders or fall back to initialData
  const displayOrders = orders.length > 0 ? orders : initialData?.recentOrders || [];

  return (
    <div className="min-h-screen bg-background pt-[60px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {displayName}!
          </h1>
          <p className="text-muted-foreground">
            Manage your account and explore personalized recommendations
          </p>
        </div>

        {/* Tabs Navigation - Mobile */}
        <div className="lg:hidden mb-6">
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-smooth ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface text-foreground hover:bg-muted'
                }`}
              >
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {/* Stats */}
          <div className="mb-8">
            <DashboardStats stats={stats} />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions userRole={userRole} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <RecentOrders orders={displayOrders} />
              <RecommendedProducts products={initialData?.recommendedProducts} />
              <RecentlyViewed products={initialData?.recentlyViewed} />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              <AccountNotifications notifications={initialData?.notifications} />
              <WishlistPreview items={initialData?.wishlistItems} />
              <SavedSearches searches={initialData?.savedSearches} />
            </div>
          </div>
        </div>

        {/* Mobile Tab Content */}
        <div className="lg:hidden">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <DashboardStats stats={stats} />
              <QuickActions userRole={userRole} />
              <AccountNotifications notifications={initialData?.notifications} />
              <RecentOrders orders={displayOrders} />
              <RecommendedProducts products={initialData?.recommendedProducts} />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <RecentOrders orders={displayOrders} />
              <RecentlyViewed products={initialData?.recentlyViewed} />
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <WishlistPreview items={initialData?.wishlistItems} />
              <RecommendedProducts products={initialData?.recommendedProducts} />
            </div>
          )}

          {activeTab === 'searches' && (
            <div className="space-y-6">
              <SavedSearches searches={initialData?.savedSearches} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

UserDashboardInteractive.propTypes = {
  initialData: PropTypes?.shape({
    userName: PropTypes?.string?.isRequired,
    userRole: PropTypes?.oneOf(['buyer', 'seller'])?.isRequired,
    stats: PropTypes?.object?.isRequired,
    recentOrders: PropTypes?.array?.isRequired,
    recommendedProducts: PropTypes?.array?.isRequired,
    wishlistItems: PropTypes?.array?.isRequired,
    savedSearches: PropTypes?.array?.isRequired,
    notifications: PropTypes?.array?.isRequired,
    recentlyViewed: PropTypes?.array?.isRequired
  })?.isRequired
};