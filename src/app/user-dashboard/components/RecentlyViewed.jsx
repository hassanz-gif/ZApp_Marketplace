import PropTypes from 'prop-types';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

export default function RecentlyViewed({ products }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recently Viewed</h2>
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth">
          Clear History
        </button>
      </div>
      <div className="p-5">
        {products?.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="ClockIcon" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No recently viewed items</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
            {products?.map((product) => (
              <Link
                key={product?.id}
                href={`/product-details?id=${product?.id}`}
                className="group flex-shrink-0 w-40"
              >
                <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2">
                  <AppImage
                    src={product?.image}
                    alt={product?.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                </div>
                <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-smooth">
                  {product?.name}
                </h3>
                <p className="text-base font-bold text-primary">${product?.price}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

RecentlyViewed.propTypes = {
  products: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      name: PropTypes?.string?.isRequired,
      image: PropTypes?.string?.isRequired,
      imageAlt: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired
    })
  )?.isRequired
};