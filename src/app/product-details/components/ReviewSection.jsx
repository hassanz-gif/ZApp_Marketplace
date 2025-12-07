'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function ReviewSection({ reviews, ratingBreakdown, averageRating, totalReviews }) {
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredReviews = reviews?.filter((review) => {
    if (filterRating === 'all') return true;
    if (filterRating === 'verified') return review?.verified;
    return review?.rating === parseInt(filterRating);
  });

  const sortedReviews = [...filteredReviews]?.sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'helpful') return b?.helpful - a?.helpful;
    if (sortBy === 'rating-high') return b?.rating - a?.rating;
    if (sortBy === 'rating-low') return a?.rating - b?.rating;
    return 0;
  });

  const handleHelpful = (reviewId) => {
    console.log('Marked helpful:', reviewId);
  };

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-bold text-foreground mb-2">{averageRating}</div>
            <div className="flex items-center space-x-1 mb-2">
              {[...Array(5)]?.map((_, index) => (
                <Icon
                  key={index}
                  name="StarIcon"
                  size={24}
                  variant={index < Math.floor(averageRating) ? 'solid' : 'outline'}
                  className={index < Math.floor(averageRating) ? 'text-accent' : 'text-muted-foreground'}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{totalReviews} reviews</p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {ratingBreakdown?.map((breakdown) => (
              <div key={breakdown?.stars} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-foreground w-8">{breakdown?.stars}★</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${breakdown?.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {breakdown?.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterRating('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-smooth ${
              filterRating === 'all' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setFilterRating('verified')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-smooth ${
              filterRating === 'verified'
                ? 'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            Verified Only
          </button>
          {[5, 4, 3, 2, 1]?.map((rating) => (
            <button
              key={rating}
              onClick={() => setFilterRating(rating?.toString())}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-smooth ${
                filterRating === rating?.toString()
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {rating}★
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e?.target?.value)}
          className="px-4 py-2 bg-muted border border-input rounded-lg text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating-high">Highest Rating</option>
          <option value="rating-low">Lowest Rating</option>
        </select>
      </div>
      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews?.map((review) => (
          <div key={review?.id} className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-muted rounded-full overflow-hidden flex-shrink-0">
                <AppImage
                  src={review?.userAvatar}
                  alt={review?.userAvatarAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-semibold text-foreground">{review?.userName}</h4>
                      {review?.verified && (
                        <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{review?.date}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)]?.map((_, index) => (
                      <Icon
                        key={index}
                        name="StarIcon"
                        size={16}
                        variant={index < review?.rating ? 'solid' : 'outline'}
                        className={index < review?.rating ? 'text-accent' : 'text-muted-foreground'}
                      />
                    ))}
                  </div>
                </div>

                {review?.variant && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Variant: {review?.variant}
                  </p>
                )}

                <p className="text-sm text-foreground leading-relaxed mb-3">{review?.comment}</p>

                {review?.images && review?.images?.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {review?.images?.map((image, index) => (
                      <div key={index} className="w-20 h-20 rounded-lg overflow-hidden">
                        <AppImage
                          src={image?.url}
                          alt={image?.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleHelpful(review?.id)}
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    <Icon name="HandThumbUpIcon" size={16} />
                    <span>Helpful ({review?.helpful})</span>
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
                    <Icon name="FlagIcon" size={16} />
                    <span>Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {sortedReviews?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="ChatBubbleLeftRightIcon" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium mb-1">No reviews found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}

ReviewSection.propTypes = {
  reviews: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      userName: PropTypes?.string?.isRequired,
      userAvatar: PropTypes?.string?.isRequired,
      userAvatarAlt: PropTypes?.string?.isRequired,
      rating: PropTypes?.number?.isRequired,
      date: PropTypes?.string?.isRequired,
      verified: PropTypes?.bool?.isRequired,
      variant: PropTypes?.string,
      comment: PropTypes?.string?.isRequired,
      helpful: PropTypes?.number?.isRequired,
      images: PropTypes?.arrayOf(
        PropTypes?.shape({
          url: PropTypes?.string?.isRequired,
          alt: PropTypes?.string?.isRequired,
        })
      ),
    })
  )?.isRequired,
  ratingBreakdown: PropTypes?.arrayOf(
    PropTypes?.shape({
      stars: PropTypes?.number?.isRequired,
      percentage: PropTypes?.number?.isRequired,
    })
  )?.isRequired,
  averageRating: PropTypes?.number?.isRequired,
  totalReviews: PropTypes?.number?.isRequired,
};