import PropTypes from 'prop-types';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

export default function WishlistPreview({ items }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="HeartIcon" size={20} className="text-error" variant="solid" />
          <span>My Wishlist</span>
        </h2>
        <span className="text-sm text-muted-foreground">{items?.length} items</span>
      </div>
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {items?.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="HeartIcon" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            <Link
              href="/product-search-results"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          items?.map((item) => (
            <div key={item?.id} className="p-4 hover:bg-muted/50 transition-smooth">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <AppImage
                    src={item?.image}
                    alt={item?.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product-details?id=${item?.id}`}
                    className="text-sm font-semibold text-foreground hover:text-primary transition-smooth line-clamp-1 block mb-1"
                  >
                    {item?.name}
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-primary">${item?.price}</span>
                    {item?.inStock ? (
                      <span className="text-xs text-success font-medium">In Stock</span>
                    ) : (
                      <span className="text-xs text-error font-medium">Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {items?.length > 0 && (
        <div className="p-4 border-t border-border">
          <Link
            href="/shopping-cart"
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
          >
            Add All to Cart
          </Link>
        </div>
      )}
    </div>
  );
}

WishlistPreview.propTypes = {
  items: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      name: PropTypes?.string?.isRequired,
      image: PropTypes?.string?.isRequired,
      imageAlt: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired,
      inStock: PropTypes?.bool?.isRequired
    })
  )?.isRequired
};