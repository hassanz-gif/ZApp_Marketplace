'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function ReturnRequestModal({ isOpen, onClose, order, onSubmit }) {
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    photos: []
  });

  const returnReasons = [
    'Product damaged or defective',
    'Wrong item received',
    'Item not as described',
    'Changed my mind',
    'Better price available',
    'Quality not satisfactory',
    'Other'
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (formData?.reason && formData?.description?.trim()) {
      onSubmit(order?.id, formData);
      setFormData({ reason: '', description: '', photos: [] });
      onClose();
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e?.target?.files);
    const newPhotos = files?.map(file => ({
      id: Math.random()?.toString(36)?.substr(2, 9),
      name: file?.name,
      url: URL.createObjectURL(file)
    }));
    setFormData(prev => ({
      ...prev,
      photos: [...prev?.photos, ...newPhotos]?.slice(0, 5)
    }));
  };

  const removePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev?.photos?.filter(p => p?.id !== photoId)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Request Return</h2>
            <p className="text-sm text-muted-foreground mt-1">Order #{order?.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-smooth"
            aria-label="Close modal"
          >
            <Icon name="XMarkIcon" size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Return Reason */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Reason for Return <span className="text-error">*</span>
            </label>
            <div className="space-y-2">
              {returnReasons?.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center space-x-3 p-3 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-smooth"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={formData?.reason === reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e?.target?.value }))}
                    className="w-4 h-4 text-primary focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-foreground">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">
              Additional Details <span className="text-error">*</span>
            </label>
            <textarea
              id="description"
              value={formData?.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
              placeholder="Please provide more details about your return request..."
              rows={4}
              className="w-full px-4 py-3 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-smooth"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum 20 characters ({formData?.description?.length}/20)
            </p>
          </div>

          {/* Photo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Upload Photos (Optional)
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Add up to 5 photos to support your return request
            </p>
            
            {formData?.photos?.length < 5 && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-muted/30 transition-smooth">
                <Icon name="PhotoIcon" size={32} className="text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}

            {formData?.photos?.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {formData?.photos?.map((photo) => (
                  <div key={photo?.id} className="relative group">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img
                        src={photo?.url}
                        alt={photo?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo?.id)}
                      className="absolute top-2 right-2 p-1 bg-error text-error-foreground rounded-full opacity-0 group-hover:opacity-100 transition-smooth"
                      aria-label="Remove photo"
                    >
                      <Icon name="XMarkIcon" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Return Policy Notice */}
          <div className="p-4 bg-muted rounded-lg border border-border">
            <div className="flex items-start space-x-3">
              <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-1">Return Policy</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Returns accepted within 30 days of delivery</li>
                  <li>• Items must be unused and in original packaging</li>
                  <li>• Refund processed within 5-7 business days</li>
                  <li>• Return shipping costs may apply</li>
                </ul>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-muted text-foreground text-sm font-medium rounded-md hover:bg-muted/80 transition-smooth"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData?.reason || formData?.description?.length < 20}
            className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            Submit Return Request
          </button>
        </div>
      </div>
    </div>
  );
}

ReturnRequestModal.propTypes = {
  isOpen: PropTypes?.bool?.isRequired,
  onClose: PropTypes?.func?.isRequired,
  order: PropTypes?.shape({
    id: PropTypes?.string,
    orderNumber: PropTypes?.string
  }),
  onSubmit: PropTypes?.func?.isRequired
};