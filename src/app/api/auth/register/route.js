import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      password,
      accountType,
      phone,
      businessName,
      businessType,
      taxId,
      marketingOptIn
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email, and password are required' },
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

    // Password validation
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with 1 uppercase letter and 1 number' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const user = await createUser({
      firstName,
      lastName,
      email,
      password,
      accountType,
      phone,
      businessName,
      businessType,
      taxId,
      marketingOptIn
    });

    // Return success (don't return password)
    const { password: _, ...safeUser } = user;

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: safeUser
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);

    if (error.message === 'User already exists') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
