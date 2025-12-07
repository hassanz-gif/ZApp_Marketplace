'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

export default function SearchBar({ categories }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mockSuggestions = [
    "Wireless Headphones",
    "Smart Watch",
    "Laptop Stand",
    "Gaming Mouse",
    "USB-C Cable"
  ];

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      const params = new URLSearchParams();
      params?.set('q', searchQuery);
      if (selectedCategory !== 'all') {
        params?.set('category', selectedCategory);
      }
      router?.push(`/product-search-results?${params?.toString()}`);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e?.target?.value);
              setShowSuggestions(e?.target?.value?.length > 0);
            }}
            onFocus={() => setShowSuggestions(searchQuery?.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search for products, services, or sellers..."
            className="w-full h-12 pl-12 pr-4 text-sm bg-surface border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
          />
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-modal z-50 animate-fade-in">
              {mockSuggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted transition-smooth flex items-center"
                >
                  <Icon name="MagnifyingGlassIcon" size={16} className="mr-3 text-muted-foreground" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e?.target?.value)}
          className="h-12 px-4 text-sm bg-surface border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
        >
          <option value="all">All Categories</option>
          {categories?.map((category) => (
            <option key={category?.id} value={category?.slug}>
              {category?.name}
            </option>
          ))}
        </select>
        
        <button
          type="submit"
          className="h-12 px-8 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-smooth flex items-center justify-center"
        >
          <Icon name="MagnifyingGlassIcon" size={20} className="md:mr-2" />
          <span className="hidden md:inline">Search</span>
        </button>
      </form>
    </div>
  );
}

SearchBar.propTypes = {
  categories: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      name: PropTypes?.string?.isRequired,
      slug: PropTypes?.string?.isRequired,
    })
  )?.isRequired,
};