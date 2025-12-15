import { NextResponse } from 'next/server';
import { getUserMessages, getUnreadMessageCount, markMessageAsRead, createMessage } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/seller/messages - Get messages for a seller
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Seller ID is required' },
        { status: 400 }
      );
    }

    const messages = await getUserMessages(sellerId, { unreadOnly, limit, offset });
    const unreadCount = await getUnreadMessageCount(sellerId);

    return NextResponse.json({
      success: true,
      messages,
      unreadCount,
      pagination: {
        limit,
        offset,
        hasMore: messages.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching seller messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/seller/messages - Send a new message
export async function POST(request) {
  try {
    const body = await request.json();
    const { senderId, receiverId, orderId, subject, content } = body;

    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { success: false, error: 'Sender ID, receiver ID, and content are required' },
        { status: 400 }
      );
    }

    const message = await createMessage({
      senderId,
      receiverId,
      orderId,
      subject,
      content
    });

    return NextResponse.json({
      success: true,
      message
    }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// PUT /api/seller/messages - Mark message as read
export async function PUT(request) {
  try {
    const body = await request.json();
    const { messageId } = body;

    if (!messageId) {
      return NextResponse.json(
        { success: false, error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const result = await markMessageAsRead(messageId);

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
      { status: 500 }
    );
  }
}
