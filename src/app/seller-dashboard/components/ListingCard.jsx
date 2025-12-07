'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function ListingCard({ listing, onEdit, onDelete, onToggleStatus }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleStatus = () => {
    onToggleStatus(listing?.id);
    setIsMenuOpen(false);
  };

  const handleEdit = () => {
    onEdit(listing?.id);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete(listing?.id);
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-smooth">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
          <AppImage
            src={listing?.image}
            alt={listing?.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${
            listing?.status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {listing?.status === 'active' ? 'Active' : 'Inactive'}
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <Link href={`/product-details?id=${listing?.id}`} className="hover:text-primary transition-smooth">
                <h3 className="text-lg font-semibold text-foreground line-clamp-1">{listing?.title}</h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-1">{listing?.category}</p>
            </div>
            <div className="relative ml-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-muted rounded-md transition-smooth"
                aria-label="More options"
              >
                <Icon name="EllipsisVerticalIcon" size={20} />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-modal z-10 animate-fade-in">
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="PencilIcon" size={16} />
                    <span>Edit Listing</span>
                  </button>
                  <button
                    onClick={handleToggleStatus}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name={listing?.status === 'active' ? 'PauseIcon' : 'PlayIcon'} size={16} />
                    <span>{listing?.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-error hover:bg-muted transition-smooth"
                  >
                    <Icon name="TrashIcon" size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-lg font-bold text-foreground">${listing?.price?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Stock</p>
              <p className={`text-lg font-bold ${listing?.stock > 10 ? 'text-success' : listing?.stock > 0 ? 'text-warning' : 'text-error'}`}>
                {listing?.stock} units
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Views</p>
              <p className="text-sm font-medium text-foreground">{listing?.views?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Orders</p>
              <p className="text-sm font-medium text-foreground">{listing?.orders}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-1">
              <Icon name="StarIcon" size={16} className="text-warning" variant="solid" />
              <span className="text-sm font-medium text-foreground">{listing?.rating?.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({listing?.reviews} reviews)</span>
            </div>
            <Link
              href={`/product-details?id=${listing?.id}`}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

ListingCard.propTypes = {
  listing: PropTypes?.shape({
    id: PropTypes?.number?.isRequired,
    title: PropTypes?.string?.isRequired,
    category: PropTypes?.string?.isRequired,
    price: PropTypes?.number?.isRequired,
    stock: PropTypes?.number?.isRequired,
    views: PropTypes?.number?.isRequired,
    orders: PropTypes?.number?.isRequired,
    rating: PropTypes?.number?.isRequired,
    reviews: PropTypes?.number?.isRequired,
    status: PropTypes?.oneOf(['active', 'inactive'])?.isRequired,
    image: PropTypes?.string?.isRequired,
    imageAlt: PropTypes?.string?.isRequired
  })?.isRequired,
  onEdit: PropTypes?.func?.isRequired,
  onDelete: PropTypes?.func?.isRequired,
  onToggleStatus: PropTypes?.func?.isRequired
};