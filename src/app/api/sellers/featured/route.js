import { NextResponse } from 'next/server';
import { getFeaturedSellers } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/sellers/featured - Get featured sellers
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '4');

    const sellers = await getFeaturedSellers(limit);

    return NextResponse.json({
      success: true,
      sellers
    });
  } catch (error) {
    console.error('Error fetching featured sellers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured sellers' },
      { status: 500 }
    );
  }
}
