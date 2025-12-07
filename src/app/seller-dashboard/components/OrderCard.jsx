'use client';

import PropTypes from 'prop-types';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function OrderCard({ order, onUpdateStatus }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'processing':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'delivered':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'pending': 'processing',
      'processing': 'shipped',
      'shipped': 'delivered'
    };
    return statusFlow?.[currentStatus] || null;
  };

  const nextStatus = getNextStatus(order?.status);

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-semibold text-foreground">Order #{order?.id}</h4>
            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(order?.status)}`}>
              {order?.status?.charAt(0)?.toUpperCase() + order?.status?.slice(1)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{order?.date}</p>
        </div>
        <Link
          href={`/order-management?id=${order?.id}`}
          className="text-primary hover:text-primary/80 transition-smooth"
          aria-label="View order details"
        >
          <Icon name="ArrowTopRightOnSquareIcon" size={20} />
        </Link>
      </div>
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Customer:</span>
          <span className="text-sm font-medium text-foreground">{order?.customer}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Items:</span>
          <span className="text-sm font-medium text-foreground">{order?.items} item(s)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className="text-lg font-bold text-foreground">${order?.total?.toLocaleString()}</span>
        </div>
      </div>
      {order?.shippingAddress && (
        <div className="mb-3 p-2 bg-muted rounded-md">
          <p className="text-xs text-muted-foreground mb-1">Shipping Address:</p>
          <p className="text-sm text-foreground">{order?.shippingAddress}</p>
        </div>
      )}
      {nextStatus && order?.status !== 'delivered' && order?.status !== 'cancelled' && (
        <button
          onClick={() => onUpdateStatus(order?.id, nextStatus)}
          className="w-full mt-3 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth flex items-center justify-center space-x-2"
        >
          <Icon name="ArrowRightIcon" size={16} />
          <span>Mark as {nextStatus?.charAt(0)?.toUpperCase() + nextStatus?.slice(1)}</span>
        </button>
      )}
    </div>
  );
}

OrderCard.propTypes = {
  order: PropTypes?.shape({
    id: PropTypes?.number?.isRequired,
    customer: PropTypes?.string?.isRequired,
    items: PropTypes?.number?.isRequired,
    total: PropTypes?.number?.isRequired,
    status: PropTypes?.oneOf(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])?.isRequired,
    date: PropTypes?.string?.isRequired,
    shippingAddress: PropTypes?.string
  })?.isRequired,
  onUpdateStatus: PropTypes?.func?.isRequired
};