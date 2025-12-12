import { NextResponse } from 'next/server';
import { getProducts, createProduct, getProductCount } from '@/lib/db';

// GET /api/products - Get all products with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const options = {
      categoryId: searchParams.get('categoryId'),
      sellerId: searchParams.get('sellerId'),
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : undefined,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')) : undefined,
      search: searchParams.get('search'),
      inStockOnly: searchParams.get('inStockOnly') === 'true',
      isFeatured: searchParams.get('featured') === 'true',
      sortBy: searchParams.get('sortBy') || 'created_at',
      sortOrder: searchParams.get('sortOrder') || 'DESC',
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0')
    };

    const products = await getProducts(options);
    const totalCount = await getProductCount(options);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total: totalCount,
        limit: options.limit,
        offset: options.offset,
        hasMore: options.offset + products.length < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (requires seller auth)
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.price || !body.sellerId) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and sellerId are required' },
        { status: 400 }
      );
    }

    const product = await createProduct({
      sellerId: body.sellerId,
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      categoryId: body.categoryId,
      stock: parseInt(body.stock || '0'),
      image: body.image,
      imageAlt: body.imageAlt || body.name,
      images: body.images || [],
      location: body.location,
      isFeatured: body.isFeatured || false,
      freeShipping: body.freeShipping || false
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
