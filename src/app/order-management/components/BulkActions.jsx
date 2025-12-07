'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function BulkActions({ selectedOrders, onClearSelection, onBulkAction }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const bulkActionOptions = [
    { id: 'download-invoices', label: 'Download Invoices', icon: 'DocumentArrowDownIcon' },
    { id: 'print-receipts', label: 'Print Receipts', icon: 'PrinterIcon' },
    { id: 'export-csv', label: 'Export to CSV', icon: 'TableCellsIcon' },
    { id: 'mark-reviewed', label: 'Mark as Reviewed', icon: 'CheckIcon' }
  ];

  const handleBulkAction = (actionId) => {
    onBulkAction(actionId, selectedOrders);
    setIsMenuOpen(false);
  };

  if (selectedOrders?.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-in">
      <div className="bg-card border border-border rounded-lg shadow-modal p-4 min-w-[320px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
              {selectedOrders?.length}
            </div>
            <span className="text-sm font-medium text-foreground">
              {selectedOrders?.length} {selectedOrders?.length === 1 ? 'order' : 'orders'} selected
            </span>
          </div>
          <button
            onClick={onClearSelection}
            className="p-1 text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Clear selection"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
          >
            <span>Bulk Actions</span>
            <Icon name={isMenuOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
          </button>

          {isMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-lg shadow-modal overflow-hidden animate-fade-in">
              {bulkActionOptions?.map((option) => (
                <button
                  key={option?.id}
                  onClick={() => handleBulkAction(option?.id)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-smooth"
                >
                  <Icon name={option?.icon} size={18} />
                  <span>{option?.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

BulkActions.propTypes = {
  selectedOrders: PropTypes?.arrayOf(PropTypes?.string)?.isRequired,
  onClearSelection: PropTypes?.func?.isRequired,
  onBulkAction: PropTypes?.func?.isRequired
};