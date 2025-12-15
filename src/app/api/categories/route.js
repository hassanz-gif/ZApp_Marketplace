import { NextResponse } from 'next/server';
import { getAllCategories, getCategoriesWithCounts } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/categories - Get all categories
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const withCounts = searchParams.get('withCounts') === 'true';

    const categories = withCounts
      ? await getCategoriesWithCounts()
      : await getAllCategories();

    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
