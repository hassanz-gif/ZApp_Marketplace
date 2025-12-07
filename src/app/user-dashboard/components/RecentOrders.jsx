import PropTypes from 'prop-types';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

export default function RecentOrders({ orders }) {
  const getStatusColor = (status) => {
    const colors = {
      'Delivered': 'bg-success/10 text-success',
      'In Transit': 'bg-primary/10 text-primary',
      'Processing': 'bg-warning/10 text-warning',
      'Cancelled': 'bg-error/10 text-error'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
        <Link
          href="/order-management"
          className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth flex items-center space-x-1"
        >
          <span>View All</span>
          <Icon name="ChevronRightIcon" size={16} />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {orders?.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="ShoppingBagIcon" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Link
              href="/marketplace-home"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          orders?.map((order) => (
            <div key={order?.id} className="p-5 hover:bg-muted/50 transition-smooth">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <AppImage
                    src={order?.image}
                    alt={order?.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-sm font-semibold text-foreground mb-1 truncate">
                        {order?.productName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Order #{order?.orderNumber}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(order?.status)}`}>
                      {order?.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Icon name="CalendarIcon" size={14} />
                        <span>{order?.date}</span>
                      </span>
                      <span className="font-semibold text-foreground">${order?.price}</span>
                    </div>
                    <Link
                      href={`/order-management?order=${order?.orderNumber}`}
                      className="text-xs text-primary hover:text-primary/80 font-medium transition-smooth flex items-center space-x-1"
                    >
                      <span>Track Order</span>
                      <Icon name="ArrowRightIcon" size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

RecentOrders.propTypes = {
  orders: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      orderNumber: PropTypes?.string?.isRequired,
      productName: PropTypes?.string?.isRequired,
      image: PropTypes?.string?.isRequired,
      imageAlt: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired,
      status: PropTypes?.string?.isRequired,
      date: PropTypes?.string?.isRequired
    })
  )?.isRequired
};