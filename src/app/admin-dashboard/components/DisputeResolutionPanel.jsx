'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function DisputeResolutionPanel({ disputes, onDisputeAction }) {
  const [filterStatus, setFilterStatus] = useState('open');

  const filteredDisputes = disputes?.filter(dispute => 
    filterStatus === 'all' || dispute?.status === filterStatus
  );

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-red-100 text-red-700',
      'in-progress': 'bg-yellow-100 text-yellow-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700'
    };
    return styles?.[status] || styles?.open;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-blue-100 text-blue-700'
    };
    return styles?.[priority] || styles?.medium;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Dispute Resolution</h3>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e?.target?.value)}
          className="h-10 px-4 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
        >
          <option value="all">All Disputes</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <div className="space-y-4">
        {filteredDisputes?.map((dispute) => (
          <div key={dispute?.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-smooth">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-base font-semibold text-foreground">Dispute #{dispute?.id}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(dispute?.status)}`}>
                    {dispute?.status?.charAt(0)?.toUpperCase() + dispute?.status?.slice(1)?.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(dispute?.priority)}`}>
                    {dispute?.priority?.charAt(0)?.toUpperCase() + dispute?.priority?.slice(1)} Priority
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{dispute?.category}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start space-x-2">
                <Icon name="UserIcon" size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Complainant</p>
                  <p className="text-sm font-medium text-foreground">{dispute?.complainant}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="UserIcon" size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Respondent</p>
                  <p className="text-sm font-medium text-foreground">{dispute?.respondent}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="ShoppingBagIcon" size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="text-sm font-medium text-foreground">{dispute?.orderId}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="ClockIcon" size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Filed Date</p>
                  <p className="text-sm font-medium text-foreground">{dispute?.filedDate}</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg mb-4">
              <p className="text-sm font-medium text-foreground mb-1">Dispute Description</p>
              <p className="text-sm text-muted-foreground">{dispute?.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onDisputeAction('view', dispute?.id)}
                className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-smooth"
              >
                View Full Details
              </button>
              {dispute?.status === 'open' && (
                <button
                  onClick={() => onDisputeAction('assign', dispute?.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-smooth"
                >
                  Assign to Me
                </button>
              )}
              {dispute?.status === 'in-progress' && (
                <>
                  <button
                    onClick={() => onDisputeAction('resolve', dispute?.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-success hover:bg-success/90 rounded-md transition-smooth"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => onDisputeAction('escalate', dispute?.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-warning hover:bg-warning/90 rounded-md transition-smooth"
                  >
                    Escalate
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredDisputes?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="ShieldCheckIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No disputes found in this category</p>
        </div>
      )}
    </div>
  );
}

DisputeResolutionPanel.propTypes = {
  disputes: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      category: PropTypes?.string?.isRequired,
      complainant: PropTypes?.string?.isRequired,
      respondent: PropTypes?.string?.isRequired,
      orderId: PropTypes?.string?.isRequired,
      description: PropTypes?.string?.isRequired,
      status: PropTypes?.oneOf(['open', 'in-progress', 'resolved', 'closed'])?.isRequired,
      priority: PropTypes?.oneOf(['high', 'medium', 'low'])?.isRequired,
      filedDate: PropTypes?.string?.isRequired
    })
  )?.isRequired,
  onDisputeAction: PropTypes?.func?.isRequired
};