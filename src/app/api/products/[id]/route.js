import { NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db';

// GET /api/products/[id] - Get a single product
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if product exists
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // TODO: Add auth check - only the seller who owns this product should be able to update it

    const updates = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.price !== undefined) updates.price = parseFloat(body.price);
    if (body.originalPrice !== undefined) updates.originalPrice = parseFloat(body.originalPrice);
    if (body.categoryId !== undefined) updates.categoryId = body.categoryId;
    if (body.stock !== undefined) updates.stock = parseInt(body.stock);
    if (body.image !== undefined) updates.image = body.image;
    if (body.imageAlt !== undefined) updates.imageAlt = body.imageAlt;
    if (body.images !== undefined) updates.images = body.images;
    if (body.location !== undefined) updates.location = body.location;
    if (body.isActive !== undefined) updates.isActive = body.isActive;
    if (body.isFeatured !== undefined) updates.isFeatured = body.isFeatured;
    if (body.freeShipping !== undefined) updates.freeShipping = body.freeShipping;

    const product = await updateProduct(id, updates);

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product (soft delete)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if product exists
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // TODO: Add auth check - only the seller who owns this product should be able to delete it

    await deleteProduct(id);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
