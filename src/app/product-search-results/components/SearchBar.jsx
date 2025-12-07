'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function SearchBar({ initialQuery, onSearch, onSaveSearch }) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query?.trim()) {
      onSearch(query);
    }
  };

  const handleSaveSearch = () => {
    if (query?.trim()) {
      onSaveSearch(query);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <form onSubmit={handleSubmit} className="flex-1 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e?.target?.value)}
          placeholder="Search for products, brands, or categories..."
          className="w-full h-12 pl-12 pr-4 text-sm bg-surface border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
        />
        <Icon 
          name="MagnifyingGlassIcon" 
          size={20} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
        >
          Search
        </button>
      </form>
      <button
        onClick={handleSaveSearch}
        className="hidden sm:flex items-center space-x-2 px-4 py-3 bg-muted text-foreground text-sm font-medium rounded-lg hover:bg-muted/80 transition-smooth"
        aria-label="Save search"
      >
        <Icon name="BookmarkIcon" size={20} />
        <span className="hidden md:inline">Save</span>
      </button>
    </div>
  );
}

SearchBar.propTypes = {
  initialQuery: PropTypes?.string?.isRequired,
  onSearch: PropTypes?.func?.isRequired,
  onSaveSearch: PropTypes?.func?.isRequired
};