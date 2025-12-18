import { NextResponse } from 'next/server';
import { getAdminUsers } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/users - Get all users for admin management
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const role = searchParams.get('role'); // buyer, seller, both, admin

    const users = await getAdminUsers({ limit, offset, role });

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        limit,
        offset,
        hasMore: users.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
