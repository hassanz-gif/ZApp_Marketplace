import PropTypes from 'prop-types';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function RelatedProducts({ products }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.map((product) => (
          <Link
            key={product?.id}
            href="/product-details"
            className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-smooth group"
          >
            <div className="aspect-square relative overflow-hidden bg-muted">
              <AppImage
                src={product?.image}
                alt={product?.imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product?.discount && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-error text-error-foreground text-xs font-semibold rounded">
                  {product?.discount}% OFF
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-smooth">
                {product?.title}
              </h3>
              <div className="flex items-center space-x-1 mb-2">
                <Icon name="StarIcon" size={14} variant="solid" className="text-accent" />
                <span className="text-xs text-muted-foreground">{product?.rating}</span>
                <span className="text-xs text-muted-foreground">({product?.reviews})</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-bold text-primary">${product?.price?.toFixed(2)}</span>
                {product?.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${product?.originalPrice?.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

RelatedProducts.propTypes = {
  products: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      title: PropTypes?.string?.isRequired,
      image: PropTypes?.string?.isRequired,
      imageAlt: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired,
      originalPrice: PropTypes?.number,
      discount: PropTypes?.number,
      rating: PropTypes?.number?.isRequired,
      reviews: PropTypes?.number?.isRequired,
    })
  )?.isRequired,
};