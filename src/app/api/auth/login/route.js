import { NextResponse } from 'next/server';
import { validateUserCredentials } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate credentials
    const user = await validateUserCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Determine user role based on account type
    let role = 'buyer';
    if (user.accountType === 'seller') {
      role = 'seller';
    } else if (user.accountType === 'both') {
      role = 'seller'; // Default to seller dashboard for users with both capabilities
    } else if (user.accountType === 'admin') {
      role = 'admin';
    }

    // In production, you would generate a JWT token here
    // For now, we return the user data for client-side storage

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          ...user,
          role
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}
