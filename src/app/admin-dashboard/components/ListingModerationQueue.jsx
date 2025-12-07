'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

export default function ListingModerationQueue({ listings, onListingAction }) {
  const [filterStatus, setFilterStatus] = useState('pending');

  const filteredListings = listings?.filter(listing => 
    filterStatus === 'all' || listing?.status === filterStatus
  );

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      flagged: 'bg-orange-100 text-orange-700'
    };
    return styles?.[status] || styles?.pending;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Listing Moderation Queue</h3>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e?.target?.value)}
          className="h-10 px-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending Review</option>
          <option value="flagged">Flagged</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="space-y-4">
        {filteredListings?.map((listing) => (
          <div key={listing?.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-smooth">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                <AppImage
                  src={listing?.image}
                  alt={listing?.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-foreground mb-1">{listing?.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{listing?.category}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(listing?.status)}`}>
                    {listing?.status?.charAt(0)?.toUpperCase() + listing?.status?.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{listing?.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="UserIcon" size={16} />
                    <span>{listing?.seller}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="CurrencyDollarIcon" size={16} />
                    <span className="font-semibold text-foreground">{listing?.price}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="ClockIcon" size={16} />
                    <span>{listing?.submittedDate}</span>
                  </div>
                </div>
                {listing?.flagReason && (
                  <div className="flex items-start space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg mb-3">
                    <Icon name="ExclamationTriangleIcon" size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-orange-900">Flagged Content</p>
                      <p className="text-sm text-orange-700">{listing?.flagReason}</p>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onListingAction('view', listing?.id)}
                    className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-smooth"
                  >
                    View Details
                  </button>
                  {listing?.status === 'pending' || listing?.status === 'flagged' ? (
                    <>
                      <button
                        onClick={() => onListingAction('approve', listing?.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-success hover:bg-success/90 rounded-md transition-smooth"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onListingAction('reject', listing?.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-error hover:bg-error/90 rounded-md transition-smooth"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onListingAction('revert', listing?.id)}
                      className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-smooth"
                    >
                      Revert Status
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredListings?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="ClipboardDocumentCheckIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No listings found in this category</p>
        </div>
      )}
    </div>
  );
}

ListingModerationQueue.propTypes = {
  listings: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      title: PropTypes?.string?.isRequired,
      description: PropTypes?.string?.isRequired,
      category: PropTypes?.string?.isRequired,
      price: PropTypes?.string?.isRequired,
      seller: PropTypes?.string?.isRequired,
      image: PropTypes?.string?.isRequired,
      imageAlt: PropTypes?.string?.isRequired,
      status: PropTypes?.oneOf(['pending', 'approved', 'rejected', 'flagged'])?.isRequired,
      submittedDate: PropTypes?.string?.isRequired,
      flagReason: PropTypes?.string
    })
  )?.isRequired,
  onListingAction: PropTypes?.func?.isRequired
};