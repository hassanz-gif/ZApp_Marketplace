'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

// Default categories as fallback
const defaultCategories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Toys & Games',
  'Health & Beauty',
  'Automotive'
];

export default function FilterPanel({
  filters,
  onFilterChange,
  resultCount,
  isMobileFilterOpen,
  onMobileFilterClose
}) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState([filters?.minPrice, filters?.maxPrice]);
  const [categories, setCategories] = useState(defaultCategories);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    setLocalFilters(filters);
    setPriceRange([filters?.minPrice, filters?.maxPrice]);
  }, [filters]);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?withCounts=true');
        const data = await response.json();
        if (data.success && data.categories.length > 0) {
          setCategories(data.categories.map(cat => cat.name));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Keep using default categories on error
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (category) => {
    const updatedCategories = localFilters?.categories?.includes(category)
      ? localFilters?.categories?.filter(c => c !== category)
      : [...localFilters?.categories, category];
    
    const newFilters = { ...localFilters, categories: updatedCategories };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating) => {
    const newFilters = { ...localFilters, minRating: rating };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    setPriceRange(newRange);
  };

  const applyPriceRange = () => {
    const newFilters = { 
      ...localFilters, 
      minPrice: priceRange?.[0], 
      maxPrice: priceRange?.[1] 
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAvailabilityChange = (available) => {
    const newFilters = { ...localFilters, inStockOnly: available };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationChange = (e) => {
    const newFilters = { ...localFilters, location: e?.target?.value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      categories: [],
      minPrice: 0,
      maxPrice: 10000,
      minRating: 0,
      location: '',
      inStockOnly: false
    };
    setLocalFilters(resetFilters);
    setPriceRange([0, 10000]);
    onFilterChange(resetFilters);
  };

  const ratings = [5, 4, 3, 2, 1];

  const filterContent = (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {resultCount} results found
          </p>
        </div>
        <button
          onClick={clearAllFilters}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Categories</h3>
        {categoriesLoading ? (
          <div className="flex items-center space-x-2 py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {categories?.map((category) => (
              <label
                key={category}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={localFilters?.categories?.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-ring transition-smooth"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-smooth">
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Min</label>
              <input
                type="number"
                value={priceRange?.[0]}
                onChange={(e) => handlePriceRangeChange(0, e?.target?.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                min="0"
                max={priceRange?.[1]}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Max</label>
              <input
                type="number"
                value={priceRange?.[1]}
                onChange={(e) => handlePriceRangeChange(1, e?.target?.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                min={priceRange?.[0]}
                max="10000"
              />
            </div>
          </div>
          <button
            onClick={applyPriceRange}
            className="w-full px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
          >
            Apply Price Range
          </button>
        </div>
      </div>

      {/* Rating */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {ratings?.map((rating) => (
            <label
              key={rating}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={localFilters?.minRating === rating}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4 text-primary border-input focus:ring-2 focus:ring-ring transition-smooth"
              />
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)]?.map((_, index) => (
                    <Icon
                      key={index}
                      name="StarIcon"
                      size={16}
                      variant={index < rating ? 'solid' : 'outline'}
                      className={index < rating ? 'text-accent' : 'text-muted-foreground'}
                    />
                  ))}
                </div>
                <span className="text-sm text-foreground group-hover:text-primary transition-smooth">
                  & Up
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Location</h3>
        <input
          type="text"
          value={localFilters?.location}
          onChange={handleLocationChange}
          placeholder="Enter city or zip code"
          className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
        />
      </div>

      {/* Availability */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Availability</h3>
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={localFilters?.inStockOnly}
            onChange={(e) => handleAvailabilityChange(e?.target?.checked)}
            className="w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-ring transition-smooth"
          />
          <span className="text-sm text-foreground group-hover:text-primary transition-smooth">
            In Stock Only
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Panel */}
      <div className="hidden lg:block bg-surface border border-border rounded-lg p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
        {filterContent}
      </div>

      {/* Mobile Filter Panel */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-[1030] bg-black/50 animate-fade-in">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-surface shadow-modal animate-slide-in-right overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
              <button
                onClick={onMobileFilterClose}
                className="p-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
                aria-label="Close filters"
              >
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>
            <div className="p-6">
              {filterContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

FilterPanel.propTypes = {
  filters: PropTypes?.shape({
    categories: PropTypes?.arrayOf(PropTypes?.string)?.isRequired,
    minPrice: PropTypes?.number?.isRequired,
    maxPrice: PropTypes?.number?.isRequired,
    minRating: PropTypes?.number?.isRequired,
    location: PropTypes?.string?.isRequired,
    inStockOnly: PropTypes?.bool?.isRequired
  })?.isRequired,
  onFilterChange: PropTypes?.func?.isRequired,
  resultCount: PropTypes?.number?.isRequired,
  isMobileFilterOpen: PropTypes?.bool?.isRequired,
  onMobileFilterClose: PropTypes?.func?.isRequired
};