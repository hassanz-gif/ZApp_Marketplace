import PropTypes from 'prop-types';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function FeaturedSellers({ sellers }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Featured Sellers
        </h2>
        <Link
          href="/product-search-results"
          className="inline-flex items-center text-primary hover:text-primary/80 font-semibold transition-smooth"
        >
          View All Sellers
          <Icon name="ArrowRightIcon" size={20} className="ml-1" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sellers?.map((seller) => (
          <Link
            key={seller?.id}
            href={`/product-search-results?seller=${seller?.id}`}
            className="group bg-surface border border-border rounded-lg p-6 hover:shadow-card transition-smooth"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 mb-4">
                <AppImage
                  src={seller?.avatar}
                  alt={seller?.alt}
                  className="w-full h-full rounded-full object-cover"
                />
                {seller?.verified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-success rounded-full flex items-center justify-center border-2 border-surface">
                    <Icon name="CheckBadgeIcon" size={16} className="text-white" variant="solid" />
                  </div>
                )}
              </div>
              
              <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-smooth">
                {seller?.name}
              </h3>
              
              <div className="flex items-center mb-2">
                <Icon name="StarIcon" size={14} variant="solid" className="text-accent mr-1" />
                <span className="text-sm font-medium text-foreground">
                  {seller?.rating?.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({seller?.reviews})
                </span>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">
                {seller?.products} Products
              </p>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Icon name="MapPinIcon" size={14} className="mr-1" />
                <span>{seller?.location}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

FeaturedSellers.propTypes = {
  sellers: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      name: PropTypes?.string?.isRequired,
      avatar: PropTypes?.string?.isRequired,
      alt: PropTypes?.string?.isRequired,
      rating: PropTypes?.number?.isRequired,
      reviews: PropTypes?.number?.isRequired,
      products: PropTypes?.number?.isRequired,
      location: PropTypes?.string?.isRequired,
      verified: PropTypes?.bool?.isRequired,
    })
  )?.isRequired,
};