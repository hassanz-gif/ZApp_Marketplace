import { NextResponse } from 'next/server';
import { getBuyerOrders, createOrder } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/orders - Get orders for a buyer
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!buyerId) {
      return NextResponse.json(
        { success: false, error: 'Buyer ID is required' },
        { status: 400 }
      );
    }

    const orders = await getBuyerOrders(buyerId, { status, limit, offset });

    // Calculate stats
    const allOrders = await getBuyerOrders(buyerId, { limit: 1000 });
    const stats = {
      totalOrders: allOrders.length,
      inProgress: allOrders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length,
      delivered: allOrders.filter(o => o.status === 'delivered').length,
      totalSpent: allOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    };

    return NextResponse.json({
      success: true,
      orders,
      stats,
      pagination: {
        total: allOrders.length,
        limit,
        offset,
        hasMore: offset + orders.length < allOrders.length
      }
    });
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Creating order with data:', JSON.stringify(body, null, 2));

    const { buyerId, sellerId, items, shippingAddress, shippingCity, shippingState, shippingZip, subtotal, shippingCost, tax, total } = body;

    if (!buyerId || !sellerId || !items || items.length === 0) {
      console.log('Validation failed:', { buyerId, sellerId, itemsLength: items?.length });
      return NextResponse.json(
        { success: false, error: `Validation failed: buyerId=${!!buyerId}, sellerId=${!!sellerId}, items=${items?.length || 0}` },
        { status: 400 }
      );
    }

    const order = await createOrder({
      buyerId,
      sellerId,
      items,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZip,
      subtotal: subtotal || total,
      shippingCost: shippingCost || 0,
      tax: tax || 0,
      total,
      status: 'pending'
    });

    console.log('Order created successfully:', order);

    return NextResponse.json({
      success: true,
      order
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error.message, error.stack);
    return NextResponse.json(
      { success: false, error: `Failed to create order: ${error.message}` },
      { status: 500 }
    );
  }
}
