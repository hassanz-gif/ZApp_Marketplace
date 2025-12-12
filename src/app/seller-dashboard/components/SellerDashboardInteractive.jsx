'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import MetricsCard from './MetricsCard';
import RevenueChart from './RevenueChart';
import ListingCard from './ListingCard';
import OrderCard from './OrderCard';
import MessagePreview from './MessagePreview';
import PerformanceChart from './PerformanceChart';
import NewListingModal from './NewListingModal';
import EditListingModal from './EditListingModal';
import { useAuth } from '@/context/AuthContext';

export default function SellerDashboardInteractive({ initialData }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [orders, setOrders] = useState(initialData?.orders);
  const [messages, setMessages] = useState(initialData?.messages);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [isEditListingModalOpen, setIsEditListingModalOpen] = useState(false);
  const [listingToEdit, setListingToEdit] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch seller's listings from the database
  useEffect(() => {
    const fetchListings = async () => {
      if (!user?.id && !user?.email) {
        setListingsLoading(false);
        return;
      }

      try {
        const sellerId = user.id || user.email;
        const response = await fetch(`/api/products?sellerId=${encodeURIComponent(sellerId)}`);
        const data = await response.json();

        if (data.success && data.products) {
          // Transform API response to match the listing format used in the UI
          const transformedListings = data.products.map(product => ({
            id: product.id,
            title: product.name,
            name: product.name,
            description: product.description,
            category: product.category_name || product.categoryId || 'General',
            categoryId: product.category_id,
            price: product.price,
            originalPrice: product.original_price,
            stock: product.stock,
            views: product.views || 0,
            orders: product.sold_count || 0,
            rating: product.rating || 0,
            reviews: product.review_count || 0,
            status: product.is_active ? 'active' : 'inactive',
            image: product.image,
            imageAlt: product.image_alt || product.name,
            location: product.location,
            freeShipping: product.free_shipping,
            isFeatured: product.is_featured
          }));
          setListings(transformedListings);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        showNotification('Failed to load listings', 'error');
      } finally {
        setListingsLoading(false);
      }
    };

    fetchListings();
  }, [user?.id, user?.email]);

  const handleEditListing = (listingId) => {
    const listing = listings?.find(l => l?.id === listingId);
    if (listing) {
      setListingToEdit(listing);
      setIsEditListingModalOpen(true);
    }
  };

  const handleEditListingSuccess = (updatedProduct, listingId) => {
    // Update the listing in the local state
    setListings(prev => prev?.map(listing => {
      if (listing?.id === listingId) {
        return {
          ...listing,
          title: updatedProduct.name || listing.title,
          price: updatedProduct.price || listing.price,
          stock: updatedProduct.stock ?? listing.stock,
          image: updatedProduct.image || listing.image,
          category: updatedProduct.categoryId || listing.category,
          description: updatedProduct.description || listing.description,
          location: updatedProduct.location || listing.location,
          freeShipping: updatedProduct.freeShipping ?? listing.freeShipping,
          isFeatured: updatedProduct.isFeatured ?? listing.isFeatured
        };
      }
      return listing;
    }));
    showNotification('Listing updated successfully!', 'success');
  };

  const handleDeleteListing = async (listingId) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        const response = await fetch(`/api/products/${listingId}`, {
          method: 'DELETE'
        });
        const data = await response.json();

        if (data.success) {
          setListings(listings?.filter(listing => listing?.id !== listingId));
          showNotification('Listing deleted successfully!', 'success');
        } else {
          showNotification(data.error || 'Failed to delete listing', 'error');
        }
      } catch (error) {
        console.error('Error deleting listing:', error);
        showNotification('Failed to delete listing', 'error');
      }
    }
  };

  const handleToggleListingStatus = async (listingId) => {
    const listing = listings?.find(l => l?.id === listingId);
    if (!listing) return;

    const newStatus = listing.status === 'active' ? 'inactive' : 'active';

    try {
      const response = await fetch(`/api/products/${listingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus === 'active' })
      });
      const data = await response.json();

      if (data.success) {
        setListings(listings?.map(l =>
          l?.id === listingId
            ? { ...l, status: newStatus }
            : l
        ));
        showNotification(`Listing ${newStatus === 'active' ? 'activated' : 'deactivated'}!`, 'success');
      } else {
        showNotification(data.error || 'Failed to update listing status', 'error');
      }
    } catch (error) {
      console.error('Error toggling listing status:', error);
      showNotification('Failed to update listing status', 'error');
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders?.map(order =>
      order?.id === orderId
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const handleMarkMessageAsRead = (messageId) => {
    setMessages(messages?.map(message =>
      message?.id === messageId
        ? { ...message, unread: false }
        : message
    ));
  };

  const handleNewListingSuccess = (product) => {
    // Add the new product to the listings (transform to match listings format)
    const newListing = {
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      category: product.categoryId || 'General',
      status: 'active',
      views: 0,
      orders: 0,
      stock: product.stock
    };
    setListings(prev => [newListing, ...(prev || [])]);
    showNotification('Product listing created successfully!', 'success');
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredListings = listings?.filter(listing => {
    const matchesSearch = listing?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesFilter = filterStatus === 'all' || listing?.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'ChartBarIcon' },
    { id: 'listings', label: 'Listings', icon: 'RectangleStackIcon', badge: listings?.length },
    { id: 'orders', label: 'Orders', icon: 'ShoppingBagIcon', badge: orders?.filter(o => o?.status === 'pending')?.length },
    { id: 'messages', label: 'Messages', icon: 'ChatBubbleLeftRightIcon', badge: messages?.filter(m => m?.unread)?.length },
    { id: 'analytics', label: 'Analytics', icon: 'ChartPieIcon' }
  ];

  return (
    <div className="min-h-screen bg-background pt-[60px]">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-[1040] animate-slide-in-right">
          <div className={`px-6 py-4 rounded-lg shadow-modal flex items-center space-x-3 ${
            notification?.type === 'success' ? 'bg-success text-success-foreground' : 'bg-error text-error-foreground'
          }`}>
            <Icon
              name={notification?.type === 'success' ? 'CheckCircleIcon' : 'XCircleIcon'}
              size={24}
            />
            <span className="text-sm font-medium">{notification?.message}</span>
          </div>
        </div>
      )}

      {/* New Listing Modal */}
      <NewListingModal
        isOpen={isNewListingModalOpen}
        onClose={() => setIsNewListingModalOpen(false)}
        onSuccess={handleNewListingSuccess}
        sellerId={user?.id || user?.email}
      />

      {/* Edit Listing Modal */}
      <EditListingModal
        isOpen={isEditListingModalOpen}
        onClose={() => {
          setIsEditListingModalOpen(false);
          setListingToEdit(null);
        }}
        onSuccess={handleEditListingSuccess}
        listing={listingToEdit}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your listings, orders, and business performance</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-border overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon name={tab?.icon} size={20} />
                <span>{tab?.label}</span>
                {tab?.badge > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {tab?.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="Total Revenue"
                value={`$${initialData?.metrics?.totalRevenue?.toLocaleString()}`}
                change="+12.5%"
                changeType="positive"
                icon="CurrencyDollarIcon"
                trend="Best month this quarter"
              />
              <MetricsCard
                title="Total Orders"
                value={initialData?.metrics?.totalOrders?.toString()}
                change="+8.3%"
                changeType="positive"
                icon="ShoppingBagIcon"
                trend="45 pending orders"
              />
              <MetricsCard
                title="Active Listings"
                value={initialData?.metrics?.activeListings?.toString()}
                change="-2"
                changeType="negative"
                icon="RectangleStackIcon"
                trend="3 listings need attention"
              />
              <MetricsCard
                title="Conversion Rate"
                value={`${initialData?.metrics?.conversionRate}%`}
                change="+1.2%"
                changeType="positive"
                icon="ChartBarIcon"
                trend="Above category average"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart data={initialData?.revenueData} />
              <PerformanceChart data={initialData?.performanceData} />
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setIsNewListingModalOpen(true)}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
                >
                  <Icon name="PlusIcon" size={20} />
                  <span className="text-sm font-medium">New Listing</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-smooth"
                >
                  <Icon name="ClipboardDocumentListIcon" size={20} />
                  <span className="text-sm font-medium">View Orders</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-smooth">
                  <Icon name="ChatBubbleLeftRightIcon" size={20} />
                  <span className="text-sm font-medium">Messages</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-smooth">
                  <Icon name="DocumentArrowDownIcon" size={20} />
                  <span className="text-sm font-medium">Export Data</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {orders?.slice(0, 3)?.map(order => (
                    <OrderCard
                      key={order?.id}
                      order={order}
                      onUpdateStatus={handleUpdateOrderStatus}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Messages</h3>
                <div className="space-y-4">
                  {messages?.slice(0, 3)?.map(message => (
                    <MessagePreview
                      key={message?.id}
                      message={message}
                      onMarkAsRead={handleMarkMessageAsRead}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    placeholder="Search listings..."
                    className="w-full h-10 pl-10 pr-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                  />
                  <Icon
                    name="MagnifyingGlassIcon"
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e?.target?.value)}
                  className="h-10 px-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button
                  onClick={() => setIsNewListingModalOpen(true)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth whitespace-nowrap"
                >
                  <Icon name="PlusIcon" size={20} />
                  <span className="text-sm font-medium">New Listing</span>
                </button>
              </div>
            </div>

            {/* Listings Grid */}
            {listingsLoading ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading your listings...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredListings?.map(listing => (
                  <ListingCard
                    key={listing?.id}
                    listing={listing}
                    onEdit={handleEditListing}
                    onDelete={handleDeleteListing}
                    onToggleStatus={handleToggleListingStatus}
                  />
                ))}
              </div>
            )}

            {!listingsLoading && filteredListings?.length === 0 && (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Icon name="RectangleStackIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No listings found</h3>
                <p className="text-muted-foreground mb-4">
                  {listings?.length === 0
                    ? "You haven't created any listings yet. Click 'New Listing' to get started!"
                    : "Try adjusting your search or filters"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders?.map(order => (
                <OrderCard
                  key={order?.id}
                  order={order}
                  onUpdateStatus={handleUpdateOrderStatus}
                />
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages?.map(message => (
                <MessagePreview
                  key={message?.id}
                  message={message}
                  onMarkAsRead={handleMarkMessageAsRead}
                />
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart data={initialData?.revenueData} />
              <PerformanceChart data={initialData?.performanceData} />
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Products</h3>
              <div className="space-y-4">
                {listings?.sort((a, b) => b?.orders - a?.orders)?.slice(0, 5)?.map((listing, index) => (
                    <div key={listing?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{listing?.title}</h4>
                          <p className="text-xs text-muted-foreground">{listing?.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{listing?.orders} orders</p>
                        <p className="text-xs text-muted-foreground">${(listing?.price * listing?.orders)?.toLocaleString()} revenue</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

SellerDashboardInteractive.propTypes = {
  initialData: PropTypes?.shape({
    metrics: PropTypes?.shape({
      totalRevenue: PropTypes?.number?.isRequired,
      totalOrders: PropTypes?.number?.isRequired,
      activeListings: PropTypes?.number?.isRequired,
      conversionRate: PropTypes?.number?.isRequired
    })?.isRequired,
    revenueData: PropTypes?.array?.isRequired,
    performanceData: PropTypes?.array?.isRequired,
    listings: PropTypes?.array?.isRequired,
    orders: PropTypes?.array?.isRequired,
    messages: PropTypes?.array?.isRequired
  })?.isRequired
};