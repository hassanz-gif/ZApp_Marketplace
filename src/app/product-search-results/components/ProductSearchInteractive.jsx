'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import SortControls from './SortControls';
import ProductGrid from './ProductGrid';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/context/CartContext';

function ProductSearchContent({ initialProducts }) {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const queryParam = searchParams?.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    location: '',
    inStockOnly: false
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const PRODUCTS_PER_PAGE = 12;

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (filters.minPrice > 0) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice < 10000) params.set('maxPrice', filters.maxPrice);
      if (filters.minRating > 0) params.set('minRating', filters.minRating);
      if (filters.inStockOnly) params.set('inStockOnly', 'true');

      // Map sortBy to API params
      let sortByParam = 'created_at';
      let sortOrder = 'DESC';
      switch (sortBy) {
        case 'price-low': sortByParam = 'price'; sortOrder = 'ASC'; break;
        case 'price-high': sortByParam = 'price'; sortOrder = 'DESC'; break;
        case 'rating': sortByParam = 'rating'; sortOrder = 'DESC'; break;
        case 'newest': sortByParam = 'created_at'; sortOrder = 'DESC'; break;
        case 'popular': sortByParam = 'sold_count'; sortOrder = 'DESC'; break;
      }
      params.set('sortBy', sortByParam);
      params.set('sortOrder', sortOrder);
      params.set('limit', '50');

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        // Transform products to match expected format
        const transformed = data.products.map(p => ({
          id: p.id,
          name: p.name,
          image: p.image,
          imageAlt: p.imageAlt || p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          rating: p.rating,
          reviewCount: p.reviewCount,
          category: p.categoryId || 'General',
          seller: p.seller?.name || 'ZApp Seller',
          isVerifiedSeller: p.seller?.verified ?? true,
          inStock: p.stock > 0,
          isNew: false,
          discount: p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0,
          location: p.location
        }));
        setProducts(transformed);
      } else {
        // Fallback to initial products if API fails
        setProducts(initialProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(initialProducts);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filters, sortBy, initialProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    loadMoreProducts();
  }, [page, products]);

  const loadMoreProducts = () => {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const newProducts = products?.slice(startIndex, endIndex);

    if (page === 1) {
      setDisplayedProducts(newProducts);
    } else {
      setDisplayedProducts(prev => [...prev, ...newProducts]);
    }

    setHasMore(endIndex < products?.length);
    setIsLoading(false);
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
    }, 500);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSaveSearch = (query) => {
    showNotification(`Search "${query}" saved successfully!`, 'success');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleAddToCart = (productId) => {
    const product = initialProducts.find(p => p.id === productId);
    if (product) {
      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        alt: product.imageAlt,
        sellerId: product.sellerId || 'seller-1',
        sellerName: product.seller,
        sellerVerified: product.isVerifiedSeller
      };
      addToCart(productData, 1);
      showNotification('Product added to cart!', 'success');
    }
  };

  const handleAddToWishlist = (productId) => {
    showNotification('Product added to wishlist!', 'success');
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background pt-[60px]">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-[1040] animate-slide-in-right">
          <div className={`px-6 py-4 rounded-lg shadow-modal flex items-center space-x-3 ${
            notification?.type === 'success' ?'bg-success text-success-foreground' :'bg-error text-error-foreground'
          }`}>
            <Icon 
              name={notification?.type === 'success' ? 'CheckCircleIcon' : 'XCircleIcon'} 
              size={24} 
            />
            <span className="text-sm font-medium">{notification?.message}</span>
          </div>
        </div>
      )}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            initialQuery={searchQuery}
            onSearch={handleSearch}
            onSaveSearch={handleSaveSearch}
          />
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-surface border border-border text-foreground rounded-lg hover:bg-muted transition-smooth"
          >
            <Icon name="AdjustmentsHorizontalIcon" size={20} />
            <span className="font-medium">Filters</span>
            {(filters?.categories?.length > 0 || filters?.minRating > 0 || filters?.inStockOnly) && (
              <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                {filters?.categories?.length + (filters?.minRating > 0 ? 1 : 0) + (filters?.inStockOnly ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel */}
          <div className="lg:w-80 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              resultCount={products?.length}
              isMobileFilterOpen={isMobileFilterOpen}
              onMobileFilterClose={() => setIsMobileFilterOpen(false)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort Controls */}
            <div className="mb-6 pb-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-foreground">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
                </h1>
                <span className="text-sm text-muted-foreground">
                  {products?.length} {products?.length === 1 ? 'result' : 'results'}
                </span>
              </div>
              <SortControls sortBy={sortBy} onSortChange={handleSortChange} />
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={displayedProducts}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

ProductSearchContent.propTypes = {
  initialProducts: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      name: PropTypes?.string?.isRequired,
      image: PropTypes?.string?.isRequired,
      imageAlt: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired,
      originalPrice: PropTypes?.number,
      rating: PropTypes?.number?.isRequired,
      reviewCount: PropTypes?.number?.isRequired,
      category: PropTypes?.string?.isRequired,
      seller: PropTypes?.string?.isRequired,
      isVerifiedSeller: PropTypes?.bool?.isRequired,
      inStock: PropTypes?.bool?.isRequired,
      location: PropTypes?.string?.isRequired,
      dateAdded: PropTypes?.string?.isRequired,
      isNew: PropTypes?.bool,
      discount: PropTypes?.number
    })
  )?.isRequired
};

export default function ProductSearchInteractive({ initialProducts }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-[60px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading search results...</p>
        </div>
      </div>
    }>
      <ProductSearchContent initialProducts={initialProducts} />
    </Suspense>
  );
}

ProductSearchInteractive.propTypes = {
  initialProducts: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      name: PropTypes?.string?.isRequired,
      image: PropTypes?.string?.isRequired,
      imageAlt: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired,
      originalPrice: PropTypes?.number,
      rating: PropTypes?.number?.isRequired,
      reviewCount: PropTypes?.number?.isRequired,
      category: PropTypes?.string?.isRequired,
      seller: PropTypes?.string?.isRequired,
      isVerifiedSeller: PropTypes?.bool?.isRequired,
      inStock: PropTypes?.bool?.isRequired,
      location: PropTypes?.string?.isRequired,
      dateAdded: PropTypes?.string?.isRequired,
      isNew: PropTypes?.bool,
      discount: PropTypes?.number
    })
  )?.isRequired
};