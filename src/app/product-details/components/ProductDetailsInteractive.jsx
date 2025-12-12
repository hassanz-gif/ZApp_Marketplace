'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import ImageGallery from './ImageGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import ReviewSection from './ReviewSection';
import RelatedProducts from './RelatedProducts';
import Icon from '@/components/ui/AppIcon';

export default function ProductDetailsInteractive({ productData: initialProductData }) {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('id');

  const [productData, setProductData] = useState(initialProductData);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('details');
  const [isDesktop, setIsDesktop] = useState(false);

  // Fetch product from API if we have an ID
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();

        if (data.success && data.product) {
          const p = data.product;
          // Transform API product to match expected format
          setProductData({
            product: {
              id: p.id,
              title: p.name,
              price: p.price,
              originalPrice: p.originalPrice,
              rating: p.rating,
              reviewCount: p.reviewCount,
              soldCount: p.soldCount,
              stock: p.stock,
              freeShipping: p.freeShipping,
              category: 'Electronics',
              variants: [],
              features: [
                'High-quality construction',
                'Fast shipping available',
                'Customer support included'
              ]
            },
            seller: {
              id: p.seller?.id || p.sellerId,
              name: p.seller?.name || 'ZApp Seller',
              verified: true,
              rating: 4.8,
              responseRate: 98,
              responseTime: '< 1 hour'
            },
            images: p.images?.length > 0 ? p.images : [p.image],
            details: initialProductData?.details || {
              description: p.description || 'No description available.',
              specifications: [],
              shipping: { freeShipping: p.freeShipping, estimatedDays: '3-7 business days' },
              returns: { accepted: true, period: '30 days' }
            },
            reviews: initialProductData?.reviews || {
              totalReviews: p.reviewCount,
              breakdown: { 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 },
              list: []
            },
            relatedProducts: initialProductData?.relatedProducts || []
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    // Check if window is available (client-side only)
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <a href="/marketplace-home" className="text-muted-foreground hover:text-primary transition-smooth">
              Home
            </a>
            <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground" />
            <a href="/product-search-results" className="text-muted-foreground hover:text-primary transition-smooth">
              {productData?.product?.category}
            </a>
            <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground" />
            <span className="text-foreground font-medium truncate">{productData?.product?.title}</span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ImageGallery images={productData?.images} />
          <ProductInfo product={productData?.product} seller={productData?.seller} />
        </div>

        {/* Mobile Section Tabs */}
        <div className="lg:hidden mb-6">
          <div className="flex border-b border-border overflow-x-auto">
            <button
              onClick={() => setActiveSection('details')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-smooth ${
                activeSection === 'details' ?'text-primary border-b-2 border-primary' :'text-muted-foreground'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveSection('reviews')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-smooth ${
                activeSection === 'reviews' ?'text-primary border-b-2 border-primary' :'text-muted-foreground'
              }`}
            >
              Reviews ({productData?.reviews?.totalReviews})
            </button>
            <button
              onClick={() => setActiveSection('related')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-smooth ${
                activeSection === 'related' ?'text-primary border-b-2 border-primary' :'text-muted-foreground'
              }`}
            >
              Related
            </button>
          </div>
        </div>

        {/* Desktop Layout / Mobile Conditional */}
        <div className="space-y-12">
          {/* Product Details Tabs */}
          <div className={activeSection === 'details' || isDesktop ? 'block' : 'hidden'}>
            <ProductTabs
              description={productData?.details?.description}
              specifications={productData?.details?.specifications}
              shipping={productData?.details?.shipping}
              returns={productData?.details?.returns}
            />
          </div>

          {/* Reviews Section */}
          <div className={activeSection === 'reviews' || isDesktop ? 'block' : 'hidden'}>
            <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
            <ReviewSection
              reviews={productData?.reviews?.list}
              ratingBreakdown={productData?.reviews?.breakdown}
              averageRating={productData?.product?.rating}
              totalReviews={productData?.reviews?.totalReviews}
            />
          </div>

          {/* Related Products */}
          <div className={activeSection === 'related' || isDesktop ? 'block' : 'hidden'}>
            <RelatedProducts products={productData?.relatedProducts} />
          </div>
        </div>
      </div>
      {/* Sticky Mobile Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 shadow-lg z-50">
        <div className="flex items-center space-x-3">
          <button className="w-12 h-12 border-2 border-border rounded-lg flex items-center justify-center hover:border-primary transition-smooth">
            <Icon name="HeartIcon" size={24} className="text-foreground" />
          </button>
          <button className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-smooth">
            Add to Cart
          </button>
          <button className="flex-1 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-smooth">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

ProductDetailsInteractive.propTypes = {
  productData: PropTypes?.shape({
    product: PropTypes?.object?.isRequired,
    seller: PropTypes?.object?.isRequired,
    images: PropTypes?.array?.isRequired,
    details: PropTypes?.object?.isRequired,
    reviews: PropTypes?.object?.isRequired,
    relatedProducts: PropTypes?.array?.isRequired,
  })?.isRequired,
};