'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleWishlistToggle = (e) => {
    e?.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e?.preventDefault();
    const productData = {
      id: product?.id,
      name: product?.name,
      price: product?.price,
      image: product?.image,
      alt: product?.alt,
      location: product?.location
    };
    addToCart(productData, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <Link
      href={`/product-details?id=${product?.id}`}
      className="group block bg-surface border border-border rounded-lg overflow-hidden hover:shadow-card transition-smooth"
    >
      <div className="relative w-full h-48 overflow-hidden bg-muted">
        <AppImage
          src={product?.image}
          alt={product?.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-smooth"
          aria-label="Add to wishlist"
        >
          <Icon
            name="HeartIcon"
            size={20}
            variant={isWishlisted ? 'solid' : 'outline'}
            className={isWishlisted ? 'text-error' : 'text-foreground'}
          />
        </button>
        {product?.badge && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded">
            {product?.badge}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-smooth">
          {product?.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)]?.map((_, index) => (
              <Icon
                key={index}
                name="StarIcon"
                size={14}
                variant={index < Math.floor(product?.rating) ? 'solid' : 'outline'}
                className={index < Math.floor(product?.rating) ? 'text-accent' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            ({product?.reviews})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">
              ${product?.price?.toFixed(2)}
            </span>
            {product?.originalPrice && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                ${product?.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`p-2 rounded-lg transition-smooth ${
              addedToCart
                ? 'bg-success text-success-foreground'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            aria-label="Add to cart"
          >
            <Icon name={addedToCart ? "CheckIcon" : "ShoppingCartIcon"} size={18} />
          </button>
        </div>
        
        <div className="flex items-center mt-3 text-xs text-muted-foreground">
          <Icon name="MapPinIcon" size={14} className="mr-1" />
          <span>{product?.location}</span>
        </div>
      </div>
    </Link>
  );
}

ProductCard.propTypes = {
  product: PropTypes?.shape({
    id: PropTypes?.number?.isRequired,
    name: PropTypes?.string?.isRequired,
    price: PropTypes?.number?.isRequired,
    originalPrice: PropTypes?.number,
    rating: PropTypes?.number?.isRequired,
    reviews: PropTypes?.number?.isRequired,
    image: PropTypes?.string?.isRequired,
    alt: PropTypes?.string?.isRequired,
    badge: PropTypes?.string,
    location: PropTypes?.string?.isRequired,
  })?.isRequired,
};