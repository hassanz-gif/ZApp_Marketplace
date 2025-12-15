'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import OrderStats from './OrderStats';
import OrderFilters from './OrderFilters';
import OrderCard from './OrderCard';
import BulkActions from './BulkActions';
import ReturnRequestModal from './ReturnRequestModal';
import { useAuth } from '@/context/AuthContext';

export default function OrderManagementInteractive({ initialOrders, initialStats }) {
  const router = useRouter();
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState(initialOrders);
  const [orders, setOrders] = useState(initialOrders);
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: ''
  });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [sortBy, setSortBy] = useState('date-desc');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id && !user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        const buyerId = user.id || user.email;
        const response = await fetch(`/api/orders?buyerId=${encodeURIComponent(buyerId)}`);
        const data = await response.json();

        if (data.success) {
          // Transform API response to match the order format used in the UI
          const transformedOrders = (data.orders || []).map(order => ({
            id: order.id,
            orderNumber: `MP2025-${String(order.orderNumber).padStart(6, '0')}`,
            orderDate: new Date(order.createdAt).toLocaleDateString(),
            status: order.status,
            total: order.total,
            items: (order.items || []).map(item => ({
              id: item.id,
              name: item.productName,
              image: item.productImage,
              alt: item.productName,
              seller: order.seller || 'ZApp Seller',
              quantity: item.quantity,
              price: item.unitPrice
            })),
            shippingAddress: order.shippingAddress || 'Address on file',
            paymentMethod: 'Payment on file',
            trackingNumber: order.trackingNumber,
            estimatedDelivery: getEstimatedDelivery(order.status, order.createdAt),
            returnEligible: order.status === 'delivered'
          }));

          if (transformedOrders.length > 0) {
            setAllOrders(transformedOrders);
            setOrders(transformedOrders);
          }

          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Keep using initialOrders on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id, user?.email]);

  // Helper function to get estimated delivery text
  function getEstimatedDelivery(status, createdAt) {
    const orderDate = new Date(createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 7);

    switch (status) {
      case 'delivered':
        return `Delivered on ${deliveryDate.toLocaleDateString()}`;
      case 'shipped':
        return `Expected by ${deliveryDate.toLocaleDateString()}`;
      case 'cancelled':
        return 'Order cancelled';
      default:
        return `Expected by ${deliveryDate.toLocaleDateString()}`;
    }
  }

  useEffect(() => {
    filterAndSortOrders();
  }, [filters, sortBy, allOrders]);

  const filterAndSortOrders = () => {
    let filtered = [...allOrders];

    if (filters?.status !== 'all') {
      filtered = filtered?.filter(order => order?.status === filters?.status);
    }

    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      filtered = filtered?.filter(order =>
        order?.orderNumber?.toLowerCase()?.includes(searchLower) ||
        order?.items?.some(item =>
          item?.name?.toLowerCase()?.includes(searchLower) ||
          item?.seller?.toLowerCase()?.includes(searchLower)
        )
      );
    }

    const sortFunctions = {
      'date-desc': (a, b) => new Date(b.orderDate) - new Date(a.orderDate),
      'date-asc': (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
      'total-desc': (a, b) => b?.total - a?.total,
      'total-asc': (a, b) => a?.total - b?.total
    };

    filtered?.sort(sortFunctions?.[sortBy]);
    setOrders(filtered);
  };

  const handleReorder = (orderId) => {
    const order = allOrders?.find(o => o?.id === orderId);
    if (order) {
      showSuccess(`${order?.items?.length} items added to cart`);
      setTimeout(() => router?.push('/shopping-cart'), 1500);
    }
  };

  const handleContactSeller = (orderId) => {
    router?.push(`/messaging-center?orderId=${orderId}`);
  };

  const handleRequestReturn = (orderId) => {
    const order = allOrders?.find(o => o?.id === orderId);
    setSelectedOrderForReturn(order);
    setIsReturnModalOpen(true);
  };

  const handleReturnSubmit = (orderId, returnData) => {
    showSuccess('Return request submitted successfully. We will review your request within 24 hours.');
    setIsReturnModalOpen(false);
    setSelectedOrderForReturn(null);
  };

  const handleBulkAction = (actionId, orderIds) => {
    const actionMessages = {
      'download-invoices': 'Invoices downloaded successfully',
      'print-receipts': 'Receipts sent to printer',
      'export-csv': 'Order data exported to CSV',
      'mark-reviewed': 'Orders marked as reviewed'
    };
    showSuccess(actionMessages?.[actionId] || 'Action completed');
    setSelectedOrders([]);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev?.includes(orderId)
        ? prev?.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    if (selectedOrders?.length === orders?.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders?.map(o => o?.id));
    }
  };

  return (
    <div className="min-h-screen bg-background pt-[60px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-20 right-4 z-[1050] animate-slide-in">
            <div className="bg-success text-success-foreground px-6 py-3 rounded-lg shadow-modal flex items-center space-x-3">
              <Icon name="CheckCircleIcon" size={20} />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
            <button
              onClick={() => router?.push('/user-dashboard')}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-md hover:bg-muted/80 transition-smooth"
            >
              <Icon name="ArrowLeftIcon" size={16} />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <p className="text-muted-foreground">Track and manage all your marketplace orders</p>
        </div>

        {/* Order Statistics */}
        <div className="mb-8">
          <OrderStats stats={stats} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <OrderFilters
            onFilterChange={setFilters}
            activeFilters={filters}
          />
        </div>

        {/* Sort and Bulk Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedOrders?.length === orders?.length && orders?.length > 0}
                onChange={selectAllOrders}
                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm text-foreground">Select All</span>
            </label>
            {selectedOrders?.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedOrders?.length} selected
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-sm text-foreground">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="total-desc">Highest Amount</option>
              <option value="total-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        ) : orders?.length > 0 ? (
          <div className="space-y-4">
            {orders?.map((order) => (
              <div key={order?.id} className="relative">
                <div className="absolute left-4 top-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedOrders?.includes(order?.id)}
                    onChange={() => toggleOrderSelection(order?.id)}
                    className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-ring"
                    aria-label={`Select order ${order?.orderNumber}`}
                  />
                </div>
                <div className="pl-12">
                  <OrderCard
                    order={order}
                    onReorder={handleReorder}
                    onContactSeller={handleContactSeller}
                    onRequestReturn={handleRequestReturn}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Icon name="ShoppingBagIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">
              {filters?.status !== 'all' || filters?.search ? 'Try adjusting your filters to see more results' : 'Start shopping to see your orders here'}
            </p>
            <button
              onClick={() => router?.push('/marketplace-home')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
            >
              <Icon name="ShoppingBagIcon" size={16} />
              <span>Start Shopping</span>
            </button>
          </div>
        )}

        {/* Bulk Actions */}
        <BulkActions
          selectedOrders={selectedOrders}
          onClearSelection={() => setSelectedOrders([])}
          onBulkAction={handleBulkAction}
        />

        {/* Return Request Modal */}
        <ReturnRequestModal
          isOpen={isReturnModalOpen}
          onClose={() => {
            setIsReturnModalOpen(false);
            setSelectedOrderForReturn(null);
          }}
          order={selectedOrderForReturn}
          onSubmit={handleReturnSubmit}
        />
      </div>
    </div>
  );
}

OrderManagementInteractive.propTypes = {
  initialOrders: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      orderNumber: PropTypes?.string?.isRequired,
      orderDate: PropTypes?.string?.isRequired,
      status: PropTypes?.string?.isRequired,
      total: PropTypes?.number?.isRequired,
      items: PropTypes?.array?.isRequired,
      shippingAddress: PropTypes?.string?.isRequired,
      paymentMethod: PropTypes?.string?.isRequired,
      trackingNumber: PropTypes?.string,
      estimatedDelivery: PropTypes?.string,
      returnEligible: PropTypes?.bool?.isRequired
    })
  )?.isRequired,
  initialStats: PropTypes?.shape({
    totalOrders: PropTypes?.number?.isRequired,
    inProgress: PropTypes?.number?.isRequired,
    delivered: PropTypes?.number?.isRequired,
    totalSpent: PropTypes?.number?.isRequired
  })?.isRequired
};