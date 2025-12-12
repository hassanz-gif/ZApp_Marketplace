'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/context/CartContext';

export default function ProductInfo({ product, seller }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const productData = {
      id: product?.id || `product-${Date.now()}`,
      name: product?.title,
      price: product?.price,
      stock: product?.stock,
      image: product?.images?.[0] || product?.image,
      alt: product?.title,
      sellerId: seller?.id || 'seller-1',
      sellerName: seller?.name,
      sellerVerified: seller?.verified
    };

    addToCart(productData, quantity, selectedVariant?.name || null);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/shopping-cart');
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product?.price < product?.originalPrice) {
      return Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <div className="space-y-6">
      {/* Product Title & Rating */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-3">{product?.title}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)]?.map((_, index) => (
              <Icon
                key={index}
                name="StarIcon"
                size={20}
                variant={index < Math.floor(product?.rating) ? 'solid' : 'outline'}
                className={index < Math.floor(product?.rating) ? 'text-accent' : 'text-muted-foreground'}
              />
            ))}
            <span className="text-sm font-medium text-foreground ml-2">{product?.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({product?.reviewCount} reviews)</span>
          <span className="text-sm text-muted-foreground">|</span>
          <span className="text-sm text-success font-medium">{product?.soldCount} sold</span>
        </div>
      </div>
      {/* Price Section */}
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-baseline space-x-3">
          <span className="text-4xl font-bold text-primary">${product?.price?.toFixed(2)}</span>
          {product?.originalPrice && (
            <>
              <span className="text-xl text-muted-foreground line-through">
                ${product?.originalPrice?.toFixed(2)}
              </span>
              <span className="px-2 py-1 bg-error text-error-foreground text-sm font-semibold rounded">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
        {product?.freeShipping && (
          <div className="flex items-center space-x-2 mt-2">
            <Icon name="TruckIcon" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Free Shipping</span>
          </div>
        )}
      </div>
      {/* Availability Status */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-foreground">Availability:</span>
        {product?.stock > 0 ? (
          <span className="text-sm text-success font-semibold">
            In Stock ({product?.stock} available)
          </span>
        ) : (
          <span className="text-sm text-error font-semibold">Out of Stock</span>
        )}
      </div>
      {/* Variants Selection */}
      {product?.variants && product?.variants?.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Select {product?.variantType}:
          </label>
          <div className="flex flex-wrap gap-2">
            {product?.variants?.map((variant) => (
              <button
                key={variant?.id}
                onClick={() => setSelectedVariant(variant)}
                className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                  selectedVariant?.id === variant?.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-foreground hover:border-primary'
                }`}
              >
                {variant?.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Quantity:</label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-10 h-10 border-2 border-border rounded-lg flex items-center justify-center hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <Icon name="MinusIcon" size={20} className="text-foreground" />
          </button>
          <span className="text-lg font-semibold text-foreground w-12 text-center">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product?.stock}
            className="w-10 h-10 border-2 border-border rounded-lg flex items-center justify-center hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <Icon name="PlusIcon" size={20} className="text-foreground" />
          </button>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product?.stock === 0}
          className={`flex-1 px-6 py-3 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center justify-center space-x-2 ${
            addedToCart
              ? 'bg-success text-success-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          <Icon name={addedToCart ? "CheckCircleIcon" : "ShoppingCartIcon"} size={20} />
          <span>{addedToCart ? 'Added to Cart!' : 'Add to Cart'}</span>
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product?.stock === 0}
          className="flex-1 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
        >
          Buy Now
        </button>
        <button
          onClick={toggleWishlist}
          className={`px-6 py-3 border-2 rounded-lg transition-smooth ${
            isWishlisted
              ? 'border-error bg-error text-error-foreground'
              : 'border-border text-foreground hover:border-error'
          }`}
        >
          <Icon name="HeartIcon" size={24} variant={isWishlisted ? 'solid' : 'outline'} />
        </button>
      </div>
      {/* Seller Information */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Seller Information</h3>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="BuildingStorefrontIcon" size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Link
                href="/seller-dashboard"
                className="text-base font-semibold text-foreground hover:text-primary transition-smooth"
              >
                {seller?.name}
              </Link>
              {seller?.verified && (
                <Icon name="CheckBadgeIcon" size={20} variant="solid" className="text-primary" />
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="StarIcon" size={16} variant="solid" className="text-accent" />
                <span>{seller?.rating}</span>
              </div>
              <span>|</span>
              <span>{seller?.responseRate}% response rate</span>
              <span>|</span>
              <span>Responds in {seller?.responseTime}</span>
            </div>
            <Link
              href="/messaging-center"
              className="inline-flex items-center space-x-2 mt-3 px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-lg hover:bg-muted/80 transition-smooth"
            >
              <Icon name="ChatBubbleLeftRightIcon" size={16} />
              <span>Contact Seller</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Key Features */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Key Features</h3>
        <ul className="space-y-2">
          {product?.features?.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2">
              <Icon name="CheckCircleIcon" size={20} className="text-success flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ProductInfo.propTypes = {
  product: PropTypes?.shape({
    title: PropTypes?.string?.isRequired,
    price: PropTypes?.number?.isRequired,
    originalPrice: PropTypes?.number,
    rating: PropTypes?.number?.isRequired,
    reviewCount: PropTypes?.number?.isRequired,
    soldCount: PropTypes?.number?.isRequired,
    stock: PropTypes?.number?.isRequired,
    freeShipping: PropTypes?.bool,
    variants: PropTypes?.arrayOf(
      PropTypes?.shape({
        id: PropTypes?.number?.isRequired,
        name: PropTypes?.string?.isRequired,
      })
    ),
    variantType: PropTypes?.string,
    features: PropTypes?.arrayOf(PropTypes?.string)?.isRequired,
  })?.isRequired,
  seller: PropTypes?.shape({
    name: PropTypes?.string?.isRequired,
    verified: PropTypes?.bool?.isRequired,
    rating: PropTypes?.number?.isRequired,
    responseRate: PropTypes?.number?.isRequired,
    responseTime: PropTypes?.string?.isRequired,
  })?.isRequired,
};