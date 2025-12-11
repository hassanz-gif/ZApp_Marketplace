import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/db';

// GET /api/auth/users - List all registered users (for development/debugging)
export async function GET() {
  try {
    const users = getAllUsers();

    return NextResponse.json({
      message: 'Users retrieved successfully',
      count: users.length,
      users: users
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
