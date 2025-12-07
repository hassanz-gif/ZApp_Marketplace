import PropTypes from 'prop-types';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function HeroBanner({ banners }) {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-accent/10">
      <div className="absolute inset-0">
        <AppImage
          src={banners?.[0]?.image}
          alt={banners?.[0]?.alt}
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>
      <div className="relative h-full flex items-center px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {banners?.[0]?.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            {banners?.[0]?.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/product-search-results"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-smooth"
            >
              Shop Now
              <Icon name="ArrowRightIcon" size={20} className="ml-2" />
            </Link>
            <Link
              href="/seller-dashboard"
              className="inline-flex items-center px-6 py-3 bg-white text-foreground font-semibold rounded-lg hover:bg-gray-100 transition-smooth"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

HeroBanner.propTypes = {
  banners: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      title: PropTypes?.string?.isRequired,
      description: PropTypes?.string?.isRequired,
      image: PropTypes?.string?.isRequired,
      alt: PropTypes?.string?.isRequired,
    })
  )?.isRequired,
};