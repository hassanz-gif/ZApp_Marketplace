'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  onCompareToggle,
  isInWishlist,
  isInComparison 
}) {
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e?.preventDefault();
    onAddToCart(product?.id);
  };

  const handleAddToWishlist = (e) => {
    e?.preventDefault();
    onAddToWishlist(product?.id);
  };

  const handleCompareToggle = (e) => {
    e?.preventDefault();
    onCompareToggle(product?.id);
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-card transition-smooth group">
      <Link href={`/product-details?id=${product?.id}`} className="block">
        {/* Product Image */}
        <div className="relative w-full h-64 overflow-hidden bg-muted">
          <AppImage
            src={product?.image}
            alt={product?.imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {product?.isNew && (
              <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded">
                NEW
              </span>
            )}
            {product?.discount > 0 && (
              <span className="px-2 py-1 bg-error text-error-foreground text-xs font-semibold rounded">
                -{product?.discount}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-smooth">
            <button
              onClick={handleAddToWishlist}
              className={`p-2 rounded-full shadow-card transition-smooth ${
                isInWishlist
                  ? 'bg-error text-error-foreground'
                  : 'bg-surface text-foreground hover:bg-muted'
              }`}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Icon name="HeartIcon" size={20} variant={isInWishlist ? 'solid' : 'outline'} />
            </button>
            <button
              onClick={handleCompareToggle}
              className={`p-2 rounded-full shadow-card transition-smooth ${
                isInComparison
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-foreground hover:bg-muted'
              }`}
              aria-label={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
            >
              <Icon name="ScaleIcon" size={20} variant={isInComparison ? 'solid' : 'outline'} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            {product?.category}
          </p>

          {/* Product Name */}
          <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
            {product?.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)]?.map((_, index) => (
                <Icon
                  key={index}
                  name="StarIcon"
                  size={14}
                  variant={index < Math.floor(product?.rating) ? 'solid' : 'outline'}
                  className={index < Math.floor(product?.rating) ? 'text-accent' : 'text-muted-foreground'}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product?.rating} ({product?.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xl font-bold text-foreground">
              ${product?.price?.toFixed(2)}
            </span>
            {product?.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product?.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          {/* Seller Info */}
          <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-border">
            <Icon name="BuildingStorefrontIcon" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{product?.seller}</span>
            {product?.isVerifiedSeller && (
              <Icon name="CheckBadgeIcon" size={16} className="text-primary" />
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${product?.inStock ? 'bg-success' : 'bg-error'}`}></div>
            <span className={`text-sm font-medium ${product?.inStock ? 'text-success' : 'text-error'}`}>
              {product?.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product?.inStock}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-md transition-smooth ${
              product?.inStock
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <Icon name="ShoppingCartIcon" size={18} />
            <span>{product?.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </Link>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes?.shape({
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
  })?.isRequired,
  onAddToCart: PropTypes?.func?.isRequired,
  onAddToWishlist: PropTypes?.func?.isRequired,
  onCompareToggle: PropTypes?.func?.isRequired,
  isInWishlist: PropTypes?.bool?.isRequired,
  isInComparison: PropTypes?.bool?.isRequired
};