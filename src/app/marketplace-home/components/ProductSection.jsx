import PropTypes from 'prop-types';
import Link from 'next/link';
import ProductCard from './ProductCard';
import Icon from '@/components/ui/AppIcon';

export default function ProductSection({ title, products, viewAllLink }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {title}
        </h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="inline-flex items-center text-primary hover:text-primary/80 font-semibold transition-smooth"
          >
            View All
            <Icon name="ArrowRightIcon" size={20} className="ml-1" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products?.map((product) => (
          <ProductCard key={product?.id} product={product} />
        ))}
      </div>
    </section>
  );
}

ProductSection.propTypes = {
  title: PropTypes?.string?.isRequired,
  products: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      name: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired,
      originalPrice: PropTypes?.number,
      rating: PropTypes?.number?.isRequired,
      reviews: PropTypes?.number?.isRequired,
      image: PropTypes?.string?.isRequired,
      alt: PropTypes?.string?.isRequired,
      badge: PropTypes?.string,
      location: PropTypes?.string?.isRequired,
    })
  )?.isRequired,
  viewAllLink: PropTypes?.string,
};