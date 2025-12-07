import PropTypes from 'prop-types';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function EmptyCart({ recommendedProducts }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
        <Icon name="ShoppingCartIcon" size={64} className="text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-8">
        Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it up!
      </p>
      <Link
        href="/marketplace-home"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-base font-semibold rounded-lg hover:bg-primary/90 transition-smooth"
      >
        <Icon name="MagnifyingGlassIcon" size={20} />
        Start Shopping
      </Link>
      {/* Recommended Products */}
      {recommendedProducts && recommendedProducts?.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-foreground mb-6">You might like these</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts?.map((product) => (
              <Link
                key={product?.id}
                href={`/product-details?id=${product?.id}`}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-smooth group"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <AppImage
                    src={product?.image}
                    alt={product?.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-smooth truncate">
                    {product?.name}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-primary">${product?.price?.toFixed(2)}</span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Icon name="StarIcon" size={16} className="text-accent" variant="solid" />
                      <span>{product?.rating?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

EmptyCart.propTypes = {
  recommendedProducts: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      name: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired,
      rating: PropTypes?.number?.isRequired,
      image: PropTypes?.string?.isRequired,
      imageAlt: PropTypes?.string?.isRequired,
    })
  ),
};