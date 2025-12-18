import { NextResponse } from 'next/server';
import { getAdminStats, getRecentActivities, getAdminUsers, getListingsByCategory } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/stats - Get platform-wide statistics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeActivities = searchParams.get('includeActivities') === 'true';
    const includeUsers = searchParams.get('includeUsers') === 'true';
    const includeAnalytics = searchParams.get('includeAnalytics') === 'true';

    // Get basic stats
    const stats = await getAdminStats();

    // Format metrics for the dashboard
    const metricsData = [
      {
        id: 1,
        title: "Total Users",
        value: stats.totalUsers.toLocaleString(),
        change: "+0%", // Would need historical data for real change
        changeType: "positive",
        icon: "UserGroupIcon",
        iconColor: "bg-blue-500"
      },
      {
        id: 2,
        title: "Active Listings",
        value: stats.activeListings.toLocaleString(),
        change: "+0%",
        changeType: "positive",
        icon: "ShoppingBagIcon",
        iconColor: "bg-green-500"
      },
      {
        id: 3,
        title: "Monthly Revenue",
        value: `$${stats.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: "+0%",
        changeType: "positive",
        icon: "CurrencyDollarIcon",
        iconColor: "bg-purple-500"
      },
      {
        id: 4,
        title: "Pending Orders",
        value: stats.pendingOrders.toString(),
        change: "0",
        changeType: "neutral",
        icon: "ClockIcon",
        iconColor: "bg-orange-500"
      }
    ];

    const response = {
      success: true,
      stats,
      metricsData
    };

    // Include recent activities if requested
    if (includeActivities) {
      response.recentActivities = await getRecentActivities(10);
    }

    // Include users if requested
    if (includeUsers) {
      response.usersData = await getAdminUsers({ limit: 10 });
    }

    // Include analytics data if requested
    if (includeAnalytics) {
      const categoryDistribution = await getListingsByCategory();
      response.analyticsData = {
        categoryDistribution
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}
