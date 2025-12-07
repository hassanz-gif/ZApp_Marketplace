import PropTypes from 'prop-types';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

export default function RecommendedProducts({ products }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recommended For You</h2>
        <Link
          href="/product-search-results"
          className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth flex items-center space-x-1"
        >
          <span>View More</span>
          <Icon name="ChevronRightIcon" size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
        {products?.map((product) => (
          <Link
            key={product?.id}
            href={`/product-details?id=${product?.id}`}
            className="group bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-smooth"
          >
            <div className="aspect-square bg-muted overflow-hidden">
              <AppImage
                src={product?.image}
                alt={product?.imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-smooth">
                {product?.name}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  <Icon name="StarIcon" size={14} className="text-warning" variant="solid" />
                  <span className="text-xs font-medium text-foreground">{product?.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">({product?.reviews})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">${product?.price}</span>
                {product?.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${product?.originalPrice}
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

RecommendedProducts.propTypes = {
  products: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      name: PropTypes?.string?.isRequired,
      image: PropTypes?.string?.isRequired,
      imageAlt: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired,
      originalPrice: PropTypes?.number,
      rating: PropTypes?.number?.isRequired,
      reviews: PropTypes?.number?.isRequired
    })
  )?.isRequired
};