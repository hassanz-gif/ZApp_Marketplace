import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/db';

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await getAllCategories();

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
