'use client';

import PropTypes from 'prop-types';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function SavedForLater({ items, onMoveToCart, onRemove }) {
  if (!items || items?.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-foreground mb-4">Saved for Later ({items?.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items?.map((item) => (
          <div key={item?.id} className="bg-card border border-border rounded-lg overflow-hidden group">
            <Link href={`/product-details?id=${item?.id}`}>
              <div className="aspect-square overflow-hidden bg-muted">
                <AppImage
                  src={item?.image}
                  alt={item?.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/product-details?id=${item?.id}`}>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-smooth truncate mb-1">
                  {item?.name}
                </h3>
              </Link>
              <p className="text-lg font-bold text-primary mb-3">${item?.price?.toFixed(2)}</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onMoveToCart(item?.id)}
                  className="w-full h-9 flex items-center justify-center gap-1 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
                >
                  <Icon name="ShoppingCartIcon" size={16} />
                  Move to Cart
                </button>
                <button
                  onClick={() => onRemove(item?.id)}
                  className="w-full h-9 flex items-center justify-center gap-1 text-sm text-error hover:bg-error/10 rounded-md transition-smooth"
                >
                  <Icon name="TrashIcon" size={16} />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

SavedForLater.propTypes = {
  items: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      name: PropTypes?.string?.isRequired,
      price: PropTypes?.number?.isRequired,
      image: PropTypes?.string?.isRequired,
      imageAlt: PropTypes?.string?.isRequired,
    })
  ),
  onMoveToCart: PropTypes?.func?.isRequired,
  onRemove: PropTypes?.func?.isRequired,
};