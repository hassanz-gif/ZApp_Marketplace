'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function ImageGallery({ images }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images?.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev === images?.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative bg-muted rounded-lg overflow-hidden group">
        <div className="aspect-square relative">
          <AppImage
            src={images?.[selectedImageIndex]?.url}
            alt={images?.[selectedImageIndex]?.alt}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={toggleZoom}
          />
          
          {/* Navigation Arrows */}
          {images?.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface/90 hover:bg-surface rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                aria-label="Previous image"
              >
                <Icon name="ChevronLeftIcon" size={24} className="text-foreground" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface/90 hover:bg-surface rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                aria-label="Next image"
              >
                <Icon name="ChevronRightIcon" size={24} className="text-foreground" />
              </button>
            </>
          )}

          {/* Zoom Indicator */}
          <div className="absolute top-4 right-4 bg-surface/90 px-3 py-1.5 rounded-full flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Icon name="MagnifyingGlassPlusIcon" size={16} className="text-foreground" />
            <span className="text-xs font-medium text-foreground">Click to zoom</span>
          </div>

          {/* Image Counter */}
          {images?.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface/90 px-3 py-1.5 rounded-full">
              <span className="text-xs font-medium text-foreground">
                {selectedImageIndex + 1} / {images?.length}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Thumbnail Navigation */}
      {images?.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images?.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === index
                  ? 'border-primary ring-2 ring-primary/20' :'border-border hover:border-primary/50'
              }`}
            >
              <AppImage
                src={image?.url}
                alt={image?.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

ImageGallery.propTypes = {
  images: PropTypes?.arrayOf(
    PropTypes?.shape({
      url: PropTypes?.string?.isRequired,
      alt: PropTypes?.string?.isRequired,
    })
  )?.isRequired,
};