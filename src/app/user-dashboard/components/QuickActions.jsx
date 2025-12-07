import PropTypes from 'prop-types';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function QuickActions({ userRole }) {
  const buyerActions = [
    {
      id: 1,
      title: 'Browse Products',
      description: 'Explore our marketplace',
      icon: 'MagnifyingGlassIcon',
      href: '/product-search-results',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 2,
      title: 'Track Orders',
      description: 'View order status',
      icon: 'TruckIcon',
      href: '/order-management',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 3,
      title: 'Messages',
      description: 'Chat with sellers',
      icon: 'ChatBubbleLeftRightIcon',
      href: '/messaging-center',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      id: 4,
      title: 'Support',
      description: 'Get help',
      icon: 'QuestionMarkCircleIcon',
      href: '/messaging-center',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  const sellerActions = [
    {
      id: 5,
      title: 'Seller Dashboard',
      description: 'Manage your store',
      icon: 'BuildingStorefrontIcon',
      href: '/seller-dashboard',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    ...buyerActions
  ];

  const actions = userRole === 'seller' ? sellerActions : buyerActions;

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions?.map((action) => (
          <Link
            key={action?.id}
            href={action?.href}
            className="group p-4 bg-surface border border-border rounded-lg hover:shadow-md transition-smooth text-center"
          >
            <div className={`w-12 h-12 ${action?.bgColor} ${action?.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-smooth`}>
              <Icon name={action?.icon} size={24} />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-smooth">
              {action?.title}
            </h3>
            <p className="text-xs text-muted-foreground">{action?.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

QuickActions.propTypes = {
  userRole: PropTypes?.oneOf(['buyer', 'seller'])?.isRequired
};