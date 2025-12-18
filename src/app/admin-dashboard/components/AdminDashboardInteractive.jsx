'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import MetricsCard from './MetricsCard';
import RecentActivityItem from './RecentActivityItem';
import UserManagementTable from './UserManagementTable';
import ListingModerationQueue from './ListingModerationQueue';
import DisputeResolutionPanel from './DisputeResolutionPanel';
import PlatformAnalyticsChart from './PlatformAnalyticsChart';

export default function AdminDashboardInteractive({
  metricsData: initialMetrics,
  recentActivities: initialActivities,
  usersData: initialUsers,
  listingsData,
  disputesData,
  analyticsData: initialAnalytics
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [metricsData, setMetricsData] = useState(initialMetrics);
  const [recentActivities, setRecentActivities] = useState(initialActivities);
  const [usersData, setUsersData] = useState(initialUsers);
  const [analyticsData, setAnalyticsData] = useState(initialAnalytics);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch stats with activities, users, and analytics
        const response = await fetch('/api/admin/stats?includeActivities=true&includeUsers=true&includeAnalytics=true');
        const data = await response.json();

        if (data.success) {
          // Update metrics if we got data
          if (data.metricsData && data.metricsData.length > 0) {
            setMetricsData(data.metricsData);
          }

          // Update activities if we got data
          if (data.recentActivities && data.recentActivities.length > 0) {
            setRecentActivities(data.recentActivities);
          }

          // Update users if we got data
          if (data.usersData && data.usersData.length > 0) {
            setUsersData(data.usersData);
          }

          // Update analytics if we got data
          if (data.analyticsData) {
            setAnalyticsData(prev => ({
              ...prev,
              categoryDistribution: data.analyticsData.categoryDistribution || prev.categoryDistribution
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        // Keep using initial data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'ChartBarIcon' },
    { id: 'users', label: 'User Management', icon: 'UserGroupIcon' },
    { id: 'listings', label: 'Listing Moderation', icon: 'ClipboardDocumentListIcon' },
    { id: 'disputes', label: 'Dispute Resolution', icon: 'ScaleIcon' },
    { id: 'analytics', label: 'Platform Analytics', icon: 'ChartPieIcon' }
  ];

  const handleUserAction = (action, userId) => {
    console.log(`User action: ${action} for user ID: ${userId}`);
  };

  const handleListingAction = (action, listingId) => {
    console.log(`Listing action: ${action} for listing ID: ${listingId}`);
  };

  const handleDisputeAction = (action, disputeId) => {
    console.log(`Dispute action: ${action} for dispute ID: ${disputeId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive platform oversight and management</p>
        </div>

        <div className="mb-6 border-b border-border overflow-x-auto">
          <nav className="flex space-x-1 min-w-max">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon name={tab?.icon} size={20} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Icon name="ArrowPathIcon" size={24} className="animate-spin text-primary mr-2" />
                <span className="text-muted-foreground">Loading dashboard data...</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsData?.map((metric) => (
                <MetricsCard key={metric?.id} {...metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Platform Activity</h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {recentActivities?.map((activity) => (
                    <RecentActivityItem key={activity?.id} activity={activity} />
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-smooth text-left">
                    <Icon name="UserPlusIcon" size={24} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Create Admin Account</p>
                      <p className="text-xs text-muted-foreground">Add new administrator to the platform</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-smooth text-left">
                    <Icon name="MegaphoneIcon" size={24} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Send Platform Announcement</p>
                      <p className="text-xs text-muted-foreground">Broadcast message to all users</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-smooth text-left">
                    <Icon name="DocumentTextIcon" size={24} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Generate Platform Report</p>
                      <p className="text-xs text-muted-foreground">Export comprehensive analytics data</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-smooth text-left">
                    <Icon name="Cog6ToothIcon" size={24} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Platform Settings</p>
                      <p className="text-xs text-muted-foreground">Configure system parameters</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <UserManagementTable users={usersData} onUserAction={handleUserAction} />
        )}

        {activeTab === 'listings' && (
          <ListingModerationQueue listings={listingsData} onListingAction={handleListingAction} />
        )}

        {activeTab === 'disputes' && (
          <DisputeResolutionPanel disputes={disputesData} onDisputeAction={handleDisputeAction} />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PlatformAnalyticsChart 
                data={analyticsData?.userGrowth} 
                chartType="line" 
                title="User Growth Trend" 
              />
              <PlatformAnalyticsChart 
                data={analyticsData?.revenueByMonth} 
                chartType="bar" 
                title="Monthly Revenue" 
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PlatformAnalyticsChart 
                data={analyticsData?.transactionVolume} 
                chartType="line" 
                title="Transaction Volume" 
              />
              <PlatformAnalyticsChart 
                data={analyticsData?.categoryDistribution} 
                chartType="bar" 
                title="Listings by Category" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

AdminDashboardInteractive.propTypes = {
  metricsData: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      title: PropTypes?.string?.isRequired,
      value: PropTypes?.string?.isRequired,
      change: PropTypes?.string,
      changeType: PropTypes?.oneOf(['positive', 'negative', 'neutral']),
      icon: PropTypes?.string?.isRequired,
      iconColor: PropTypes?.string?.isRequired
    })
  )?.isRequired,
  recentActivities: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      type: PropTypes?.string?.isRequired,
      title: PropTypes?.string?.isRequired,
      description: PropTypes?.string?.isRequired,
      timestamp: PropTypes?.string?.isRequired
    })
  )?.isRequired,
  usersData: PropTypes?.array?.isRequired,
  listingsData: PropTypes?.array?.isRequired,
  disputesData: PropTypes?.array?.isRequired,
  analyticsData: PropTypes?.shape({
    userGrowth: PropTypes?.array?.isRequired,
    revenueByMonth: PropTypes?.array?.isRequired,
    transactionVolume: PropTypes?.array?.isRequired,
    categoryDistribution: PropTypes?.array?.isRequired
  })?.isRequired
};