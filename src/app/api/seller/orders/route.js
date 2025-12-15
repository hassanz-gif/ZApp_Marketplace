import { NextResponse } from 'next/server';
import { getSellerOrders, getSellerOrderCount, updateOrderStatus } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/seller/orders - Get orders for a seller
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Seller ID is required' },
        { status: 400 }
      );
    }

    const orders = await getSellerOrders(sellerId, { status, limit, offset });
    const totalCount = await getSellerOrderCount(sellerId, status);
    const pendingCount = await getSellerOrderCount(sellerId, 'pending');

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total: totalCount,
        pending: pendingCount,
        limit,
        offset,
        hasMore: offset + orders.length < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// PUT /api/seller/orders - Update order status
export async function PUT(request) {
  try {
    const body = await request.json();
    const { orderId, status, trackingNumber } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const result = await updateOrderStatus(orderId, status, trackingNumber);

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
