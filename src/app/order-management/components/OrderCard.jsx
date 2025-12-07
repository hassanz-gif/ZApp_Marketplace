'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

export default function OrderCard({ order, onReorder, onContactSeller, onRequestReturn }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      processing: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      shipped: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      delivered: 'bg-success/10 text-success border-success/20',
      cancelled: 'bg-error/10 text-error border-error/20'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground border-border';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: 'ClockIcon',
      processing: 'CogIcon',
      shipped: 'TruckIcon',
      delivered: 'CheckCircleIcon',
      cancelled: 'XCircleIcon'
    };
    return icons?.[status] || 'InformationCircleIcon';
  };

  const canReorder = order?.status === 'delivered';
  const canReturn = order?.status === 'delivered' && order?.returnEligible;
  const canTrack = ['processing', 'shipped']?.includes(order?.status);

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-smooth overflow-hidden">
      {/* Order Header */}
      <div className="p-4 bg-muted/30 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm font-semibold text-foreground">Order #{order?.orderNumber}</h3>
                <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order?.status)}`}>
                  <Icon name={getStatusIcon(order?.status)} size={14} />
                  <span className="capitalize">{order?.status}</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Placed on {order?.orderDate} • {order?.items?.length} {order?.items?.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-foreground hover:bg-muted rounded-md transition-smooth"
              aria-label={isExpanded ? 'Collapse order details' : 'Expand order details'}
            >
              <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={20} />
            </button>
          </div>
        </div>
      </div>
      {/* Order Items Preview */}
      <div className="p-4">
        <div className="space-y-3">
          {order?.items?.slice(0, isExpanded ? order?.items?.length : 2)?.map((item) => (
            <div key={item?.id} className="flex items-start space-x-3">
              <div className="w-16 h-16 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                <AppImage
                  src={item?.image}
                  alt={item?.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href="/product-details"
                  className="text-sm font-medium text-foreground hover:text-primary line-clamp-1 transition-smooth"
                >
                  {item?.name}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Seller: {item?.seller}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">Qty: {item?.quantity}</p>
                  <p className="text-sm font-semibold text-foreground">${item?.price?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
          {!isExpanded && order?.items?.length > 2 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
            >
              + {order?.items?.length - 2} more {order?.items?.length - 2 === 1 ? 'item' : 'items'}
            </button>
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            {/* Shipping Address */}
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-1">Shipping Address</h4>
              <p className="text-sm text-muted-foreground">{order?.shippingAddress}</p>
            </div>

            {/* Payment Method */}
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-1">Payment Method</h4>
              <p className="text-sm text-muted-foreground">{order?.paymentMethod}</p>
            </div>

            {/* Tracking Information */}
            {order?.trackingNumber && (
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-1">Tracking Number</h4>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-mono text-foreground">{order?.trackingNumber}</p>
                  <button
                    onClick={() => navigator.clipboard?.writeText(order?.trackingNumber)}
                    className="p-1 text-primary hover:text-primary/80 transition-smooth"
                    aria-label="Copy tracking number"
                  >
                    <Icon name="ClipboardDocumentIcon" size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Estimated Delivery */}
            {order?.estimatedDelivery && (
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-1">Estimated Delivery</h4>
                <p className="text-sm text-muted-foreground">{order?.estimatedDelivery}</p>
              </div>
            )}
          </div>
        )}

        {/* Order Total */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Order Total</span>
            <span className="text-lg font-bold text-foreground">${order?.total?.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {canTrack && (
            <button
              onClick={() => window.open(`https://tracking.example.com/${order?.trackingNumber}`, '_blank')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
            >
              <Icon name="TruckIcon" size={16} />
              <span>Track Order</span>
            </button>
          )}
          {canReorder && (
            <button
              onClick={() => onReorder(order?.id)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-md hover:bg-muted/80 transition-smooth"
            >
              <Icon name="ArrowPathIcon" size={16} />
              <span>Reorder</span>
            </button>
          )}
          <button
            onClick={() => onContactSeller(order?.id)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-md hover:bg-muted/80 transition-smooth"
          >
            <Icon name="ChatBubbleLeftRightIcon" size={16} />
            <span>Contact Seller</span>
          </button>
          {canReturn && (
            <button
              onClick={() => onRequestReturn(order?.id)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-md hover:bg-muted/80 transition-smooth"
            >
              <Icon name="ArrowUturnLeftIcon" size={16} />
              <span>Return</span>
            </button>
          )}
          <Link
            href={`/order-receipt?orderId=${order?.id}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-md hover:bg-muted/80 transition-smooth"
          >
            <Icon name="DocumentTextIcon" size={16} />
            <span>View Receipt</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

OrderCard.propTypes = {
  order: PropTypes?.shape({
    id: PropTypes?.string?.isRequired,
    orderNumber: PropTypes?.string?.isRequired,
    orderDate: PropTypes?.string?.isRequired,
    status: PropTypes?.oneOf(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])?.isRequired,
    total: PropTypes?.number?.isRequired,
    items: PropTypes?.arrayOf(
      PropTypes?.shape({
        id: PropTypes?.string?.isRequired,
        name: PropTypes?.string?.isRequired,
        image: PropTypes?.string?.isRequired,
        alt: PropTypes?.string?.isRequired,
        seller: PropTypes?.string?.isRequired,
        quantity: PropTypes?.number?.isRequired,
        price: PropTypes?.number?.isRequired
      })
    )?.isRequired,
    shippingAddress: PropTypes?.string?.isRequired,
    paymentMethod: PropTypes?.string?.isRequired,
    trackingNumber: PropTypes?.string,
    estimatedDelivery: PropTypes?.string,
    returnEligible: PropTypes?.bool?.isRequired
  })?.isRequired,
  onReorder: PropTypes?.func?.isRequired,
  onContactSeller: PropTypes?.func?.isRequired,
  onRequestReturn: PropTypes?.func?.isRequired
};