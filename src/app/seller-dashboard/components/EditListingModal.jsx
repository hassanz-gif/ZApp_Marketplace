'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function EditListingModal({ isOpen, onClose, onSuccess, listing }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    image: '',
    imageAlt: '',
    location: '',
    freeShipping: false,
    isFeatured: false
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Populate form with listing data when modal opens
  useEffect(() => {
    if (isOpen && listing) {
      setFormData({
        name: listing.title || listing.name || '',
        description: listing.description || '',
        price: listing.price?.toString() || '',
        originalPrice: listing.originalPrice?.toString() || '',
        category: listing.categoryId || listing.category || '',
        stock: listing.stock?.toString() || '',
        image: listing.image || '',
        imageAlt: listing.imageAlt || '',
        location: listing.location || '',
        freeShipping: listing.freeShipping || false,
        isFeatured: listing.isFeatured || false
      });
      setError('');
    }
  }, [isOpen, listing]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success && data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Fallback categories
        setCategories([
          { id: 1, slug: 'electronics', name: 'Electronics' },
          { id: 2, slug: 'fashion', name: 'Fashion' },
          { id: 3, slug: 'home-garden', name: 'Home & Garden' },
          { id: 4, slug: 'sports', name: 'Sports' },
          { id: 5, slug: 'books', name: 'Books' },
          { id: 6, slug: 'toys', name: 'Toys' }
        ]);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name || !formData.price || !formData.stock) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        categoryId: formData.category,
        stock: parseInt(formData.stock),
        image: formData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        imageAlt: formData.imageAlt || formData.name,
        location: formData.location || 'United States',
        freeShipping: formData.freeShipping,
        isFeatured: formData.isFeatured
      };

      const response = await fetch(`/api/products/${listing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (data.success) {
        onSuccess?.(data.product, listing.id);
        onClose();
      } else {
        setError(data.error || 'Failed to update listing');
      }
    } catch (err) {
      console.error('Error updating listing:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-surface rounded-xl shadow-modal overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Edit Listing</h2>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
            >
              <Icon name="XMarkIcon" size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-lg flex items-center space-x-3">
                <Icon name="ExclamationCircleIcon" size={20} className="text-error" />
                <span className="text-sm text-error">{error}</span>
              </div>
            )}

            {/* Product Name */}
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-foreground mb-2">
                Product Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full h-11 px-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows={4}
                className="w-full px-4 py-3 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
              />
            </div>

            {/* Price and Original Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-price" className="block text-sm font-medium text-foreground mb-2">
                  Price ($) <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  id="edit-price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full h-11 px-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-originalPrice" className="block text-sm font-medium text-foreground mb-2">
                  Original Price ($) <span className="text-muted-foreground text-xs">(optional, for discounts)</span>
                </label>
                <input
                  type="number"
                  id="edit-originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full h-11 px-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                />
              </div>
            </div>

            {/* Category and Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full h-11 px-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id || cat.slug} value={cat.id || cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-stock" className="block text-sm font-medium text-foreground mb-2">
                  Stock Quantity <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  id="edit-stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full h-11 px-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                  required
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="edit-image" className="block text-sm font-medium text-foreground mb-2">
                Image URL
              </label>
              <input
                type="url"
                id="edit-image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full h-11 px-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              />
              <p className="mt-1 text-xs text-muted-foreground">Leave empty for a default product image</p>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="edit-location" className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <input
                type="text"
                id="edit-location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                className="w-full h-11 px-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="freeShipping"
                  checked={formData.freeShipping}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-input text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">Free Shipping</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-input text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">Featured Product</span>
              </label>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-border bg-muted/30">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-smooth"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Icon name="CheckIcon" size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

EditListingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  listing: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    originalPrice: PropTypes.number,
    category: PropTypes.string,
    categoryId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    stock: PropTypes.number,
    image: PropTypes.string,
    imageAlt: PropTypes.string,
    location: PropTypes.string,
    freeShipping: PropTypes.bool,
    isFeatured: PropTypes.bool
  })
};
