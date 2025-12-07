'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function SavedSearches({ searches }) {
  const [savedSearches, setSavedSearches] = useState(searches);

  const handleDelete = (id) => {
    setSavedSearches(savedSearches?.filter(search => search?.id !== id));
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Saved Searches</h2>
      </div>
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {savedSearches?.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="BookmarkIcon" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No saved searches yet</p>
            <Link
              href="/product-search-results"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
            >
              Start Searching
            </Link>
          </div>
        ) : (
          savedSearches?.map((search) => (
            <div key={search?.id} className="p-4 hover:bg-muted/50 transition-smooth">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    href={search?.url}
                    className="text-sm font-semibold text-foreground hover:text-primary transition-smooth block mb-1"
                  >
                    {search?.query}
                  </Link>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {search?.filters?.map((filter, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                      >
                        {filter}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {search?.results} results • Saved {search?.savedDate}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(search?.id)}
                  className="ml-3 p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-md transition-smooth"
                  aria-label="Delete search"
                >
                  <Icon name="TrashIcon" size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

SavedSearches.propTypes = {
  searches: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      query: PropTypes?.string?.isRequired,
      url: PropTypes?.string?.isRequired,
      filters: PropTypes?.arrayOf(PropTypes?.string)?.isRequired,
      results: PropTypes?.number?.isRequired,
      savedDate: PropTypes?.string?.isRequired
    })
  )?.isRequired
};