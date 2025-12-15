'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import HeroBanner from './HeroBanner';
import SearchBar from './SearchBar';
import CategoryGrid from './CategoryGrid';
import ProductSection from './ProductSection';
import FeaturedSellers from './FeaturedSellers';
import LiveActivity from './LiveActivity';

// Default icon mapping for categories
const categoryIcons = {
  'electronics': 'ComputerDesktopIcon',
  'fashion': 'SparklesIcon',
  'home-garden': 'HomeIcon',
  'home-kitchen': 'HomeIcon',
  'sports': 'TrophyIcon',
  'sports-outdoors': 'TrophyIcon',
  'books': 'BookOpenIcon',
  'books-media': 'BookOpenIcon',
  'toys': 'PuzzlePieceIcon',
  'toys-games': 'PuzzlePieceIcon',
  'health-beauty': 'HeartIcon',
  'automotive': 'TruckIcon'
};

export default function MarketplaceHomeInteractive({ pageData }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredSellers, setFeaturedSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [sellersLoading, setSellersLoading] = useState(true);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=20&sortBy=rating&sortOrder=DESC');
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?withCounts=true');
        const data = await response.json();
        if (data.success && data.categories.length > 0) {
          // Map categories with icons
          const categoriesWithIcons = data.categories.map(cat => ({
            ...cat,
            icon: cat.icon || categoryIcons[cat.slug] || 'TagIcon'
          }));
          setCategories(categoriesWithIcons);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch featured sellers from database
  useEffect(() => {
    const fetchFeaturedSellers = async () => {
      try {
        const response = await fetch('/api/sellers/featured?limit=4');
        const data = await response.json();
        if (data.success && data.sellers.length > 0) {
          setFeaturedSellers(data.sellers);
        }
      } catch (error) {
        console.error('Error fetching featured sellers:', error);
      } finally {
        setSellersLoading(false);
      }
    };

    fetchFeaturedSellers();
  }, []);

  // Transform API products to match the expected format for ProductCard
  const transformProducts = (prods) => {
    return prods.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      rating: p.rating,
      reviews: p.reviewCount,
      image: p.image,
      alt: p.imageAlt || p.name,
      badge: p.originalPrice ? `${Math.round((1 - p.price / p.originalPrice) * 100)}% OFF` : null,
      location: p.location
    }));
  };

  // Split products into different sections
  const trendingProducts = transformProducts(products.filter(p => p.isFeatured).slice(0, 5));
  const recommendedProducts = transformProducts(products.filter(p => !p.isFeatured).slice(0, 5));
  const popularNearby = transformProducts(products.slice(5, 10));

  // Use database categories if available, otherwise fall back to pageData
  const displayCategories = categories.length > 0 ? categories : pageData?.categories;

  // Use database sellers if available, otherwise fall back to pageData
  const displaySellers = featuredSellers.length > 0 ? featuredSellers : pageData?.featuredSellers;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroBanner banners={pageData?.banners} />

        <div className="my-12">
          <SearchBar categories={displayCategories} />
        </div>

        <LiveActivity activities={pageData?.liveActivities} />

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Browse by Category
          </h2>
          {categoriesLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <CategoryGrid categories={displayCategories} />
          )}
        </section>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <ProductSection
              title="Trending Now"
              products={trendingProducts.length > 0 ? trendingProducts : pageData?.trendingProducts}
              viewAllLink="/product-search-results?sort=trending"
            />

            <ProductSection
              title="Recently Viewed"
              products={pageData?.recentlyViewed}
              viewAllLink="/user-dashboard"
            />

            {sellersLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <FeaturedSellers sellers={displaySellers} />
            )}

            <ProductSection
              title="Popular Nearby"
              products={popularNearby.length > 0 ? popularNearby : pageData?.popularNearby}
              viewAllLink="/product-search-results?sort=nearby"
            />

            <ProductSection
              title="Recommended for You"
              products={recommendedProducts.length > 0 ? recommendedProducts : pageData?.recommendedProducts}
              viewAllLink="/product-search-results?sort=recommended"
            />
          </>
        )}

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