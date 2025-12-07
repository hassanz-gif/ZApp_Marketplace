import PropTypes from 'prop-types';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function CategoryGrid({ categories }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories?.map((category) => (
        <Link
          key={category?.id}
          href={`/product-search-results?category=${category?.slug}`}
          className="flex flex-col items-center p-6 bg-surface border border-border rounded-lg hover:shadow-card hover:border-primary transition-smooth group"
        >
          <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-3 group-hover:bg-primary/20 transition-smooth">
            <Icon name={category?.icon} size={32} className="text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground text-center">
            {category?.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {category?.count} items
          </p>
        </Link>
      ))}
    </div>
  );
}

CategoryGrid.propTypes = {
  categories: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      name: PropTypes?.string?.isRequired,
      slug: PropTypes?.string?.isRequired,
      icon: PropTypes?.string?.isRequired,
      count: PropTypes?.number?.isRequired,
    })
  )?.isRequired,
};