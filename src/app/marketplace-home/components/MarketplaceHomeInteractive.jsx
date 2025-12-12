'use client';

import PropTypes from 'prop-types';
import HeroBanner from './HeroBanner';
import SearchBar from './SearchBar';
import CategoryGrid from './CategoryGrid';
import ProductSection from './ProductSection';
import FeaturedSellers from './FeaturedSellers';
import LiveActivity from './LiveActivity';

export default function MarketplaceHomeInteractive({ pageData }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroBanner banners={pageData?.banners} />
        
        <div className="my-12">
          <SearchBar categories={pageData?.categories} />
        </div>
        
        <LiveActivity activities={pageData?.liveActivities} />
        
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Browse by Category
          </h2>
          <CategoryGrid categories={pageData?.categories} />
        </section>
        
        <ProductSection
          title="Trending Now"
          products={pageData?.trendingProducts}
          viewAllLink="/product-search-results?sort=trending"
        />
        
        <ProductSection
          title="Recently Viewed"
          products={pageData?.recentlyViewed}
          viewAllLink="/user-dashboard"
        />
        
        <FeaturedSellers sellers={pageData?.featuredSellers} />
        
        <ProductSection
          title="Popular Nearby"
          products={pageData?.popularNearby}
          viewAllLink="/product-search-results?sort=nearby"
        />
        
        <ProductSection
          title="Recommended for You"
          products={pageData?.recommendedProducts}
          viewAllLink="/product-search-results?sort=recommended"
        />
        
        <section className="mt-16 bg-gradient-to-r from-primary to-accent rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Selling Today
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Join thousands of successful sellers on ZApp. List your products and reach millions of buyers worldwide.
          </p>
          <a
            href="/seller-dashboard"
            className="inline-flex items-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-smooth"
          >
            Become a Seller
          </a>
        </section>
      </div>
    </div>
  );
}

MarketplaceHomeInteractive.propTypes = {
  pageData: PropTypes?.shape({
    banners: PropTypes?.array?.isRequired,
    categories: PropTypes?.array?.isRequired,
    liveActivities: PropTypes?.array?.isRequired,
    trendingProducts: PropTypes?.array?.isRequired,
    recentlyViewed: PropTypes?.array?.isRequired,
    featuredSellers: PropTypes?.array?.isRequired,
    popularNearby: PropTypes?.array?.isRequired,
    recommendedProducts: PropTypes?.array?.isRequired,
  })?.isRequired,
};