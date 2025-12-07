'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import DashboardStats from './DashboardStats';
import RecentOrders from './RecentOrders';
import RecommendedProducts from './RecommendedProducts';
import WishlistPreview from './WishlistPreview';
import QuickActions from './QuickActions';
import RecentlyViewed from './RecentlyViewed';
import SavedSearches from './SavedSearches';
import AccountNotifications from './AccountNotifications';

export default function UserDashboardInteractive({ initialData }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'HomeIcon' },
    { id: 'orders', label: 'Orders', icon: 'ShoppingBagIcon' },
    { id: 'wishlist', label: 'Wishlist', icon: 'HeartIcon' },
    { id: 'searches', label: 'Saved Searches', icon: 'BookmarkIcon' }
  ];

  return (
    <div className="min-h-screen bg-background pt-[60px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {initialData?.userName}!
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
            <DashboardStats stats={initialData?.stats} />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions userRole={initialData?.userRole} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <RecentOrders orders={initialData?.recentOrders} />
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
              <DashboardStats stats={initialData?.stats} />
              <QuickActions userRole={initialData?.userRole} />
              <AccountNotifications notifications={initialData?.notifications} />
              <RecentOrders orders={initialData?.recentOrders} />
              <RecommendedProducts products={initialData?.recommendedProducts} />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <RecentOrders orders={initialData?.recentOrders} />
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