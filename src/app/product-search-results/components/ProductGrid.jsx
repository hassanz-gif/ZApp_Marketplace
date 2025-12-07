'use client';

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import Icon from '@/components/ui/AppIcon';

export default function ProductGrid({ 
  products, 
  onAddToCart, 
  onAddToWishlist,
  onLoadMore,
  hasMore,
  isLoading 
}) {
  const [wishlist, setWishlist] = useState([]);
  const [comparison, setComparison] = useState([]);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget?.current) {
      observer?.observe(observerTarget?.current);
    }

    return () => {
      if (observerTarget?.current) {
        observer?.unobserve(observerTarget?.current);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  const handleAddToWishlist = (productId) => {
    setWishlist(prev => 
      prev?.includes(productId) 
        ? prev?.filter(id => id !== productId)
        : [...prev, productId]
    );
    onAddToWishlist(productId);
  };

  const handleCompareToggle = (productId) => {
    if (comparison?.includes(productId)) {
      setComparison(prev => prev?.filter(id => id !== productId));
    } else if (comparison?.length < 4) {
      setComparison(prev => [...prev, productId]);
    }
  };

  const handleClearComparison = () => {
    setComparison([]);
  };

  if (products?.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Icon name="MagnifyingGlassIcon" size={48} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Comparison Bar */}
      {comparison?.length > 0 && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="ScaleIcon" size={20} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                {comparison?.length} {comparison?.length === 1 ? 'item' : 'items'} selected for comparison
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearComparison}
                className="px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-md hover:bg-muted/80 transition-smooth"
              >
                Clear
              </button>
              <button
                disabled={comparison?.length < 2}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-smooth ${
                  comparison?.length >= 2
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard
            key={product?.id}
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onCompareToggle={handleCompareToggle}
            isInWishlist={wishlist?.includes(product?.id)}
            isInComparison={comparison?.includes(product?.id)}
          />
        ))}
      </div>
      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {[...Array(8)]?.map((_, index) => (
            <div key={index} className="bg-surface border border-border rounded-lg overflow-hidden animate-pulse">
              <div className="w-full h-64 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-5 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-10 bg-muted rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Infinite Scroll Trigger */}
      <div ref={observerTarget} className="h-10"></div>
      {/* Load More Button (Fallback) */}
      {hasMore && !isLoading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
}

ProductGrid.propTypes = {
  products: PropTypes?.arrayOf(
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
      isNew: PropTypes?.bool,
      discount: PropTypes?.number
    })
  )?.isRequired,
  onAddToCart: PropTypes?.func?.isRequired,
  onAddToWishlist: PropTypes?.func?.isRequired,
  onLoadMore: PropTypes?.func?.isRequired,
  hasMore: PropTypes?.bool?.isRequired,
  isLoading: PropTypes?.bool?.isRequired
};