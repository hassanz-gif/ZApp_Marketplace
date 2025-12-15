import { NextResponse } from 'next/server';
import { getSellerStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/seller/stats?sellerId=xxx - Get seller analytics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Seller ID is required' },
        { status: 400 }
      );
    }

    const stats = await getSellerStats(sellerId);

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch seller statistics' },
      { status: 500 }
    );
  }
}
