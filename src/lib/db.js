// Cloudflare D1 Database Connection
// Uses REST API to connect to D1 from Next.js

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID;

// Execute SQL query on D1
async function executeQuery(sql, params = []) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_DATABASE_ID}/query`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sql: sql,
      params: params,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    console.error('D1 Query Error:', data.errors);
    throw new Error(data.errors?.[0]?.message || 'Database query failed');
  }

  return data.result[0];
}

// Password hashing using Web Crypto API
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const salt = process.env.PASSWORD_SALT || 'marketplace-zapp-2024';
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password, hashedPassword) {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}

// Create a new user
export async function createUser(userData) {
  const hashedPassword = await hashPassword(userData.password);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const sql = `
    INSERT INTO users (id, first_name, last_name, email, password, account_type, phone, business_name, business_type, tax_id, marketing_opt_in, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    userData.firstName.trim(),
    userData.lastName.trim(),
    userData.email.toLowerCase().trim(),
    hashedPassword,
    userData.accountType || 'buyer',
    userData.phone || null,
    userData.businessName || null,
    userData.businessType || null,
    userData.taxId || null,
    userData.marketingOptIn ? 1 : 0,
    now,
    now
  ];

  await executeQuery(sql, params);

  return {
    id,
    firstName: userData.firstName.trim(),
    lastName: userData.lastName.trim(),
    email: userData.email.toLowerCase().trim(),
    accountType: userData.accountType || 'buyer',
    phone: userData.phone || null,
    businessName: userData.businessName || null,
    businessType: userData.businessType || null,
    taxId: userData.taxId || null,
    marketingOptIn: userData.marketingOptIn || false,
    createdAt: now,
    updatedAt: now
  };
}

// Find user by email
export async function findUserByEmail(email) {
  const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
  const result = await executeQuery(sql, [email.toLowerCase().trim()]);

  if (!result.results || result.results.length === 0) {
    return null;
  }

  const user = result.results[0];
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    password: user.password,
    accountType: user.account_type,
    phone: user.phone,
    businessName: user.business_name,
    businessType: user.business_type,
    taxId: user.tax_id,
    marketingOptIn: user.marketing_opt_in === 1,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
}

// Validate user credentials
export async function validateUserCredentials(email, password) {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return null;
  }

  // Return user without password
  const { password: _, ...safeUser } = user;
  return safeUser;
}

// Get all users (for admin/debugging)
export async function getAllUsers() {
  const sql = `SELECT id, first_name, last_name, email, account_type, phone, business_name, business_type, marketing_opt_in, created_at, updated_at FROM users ORDER BY created_at DESC`;
  const result = await executeQuery(sql, []);

  if (!result.results) {
    return [];
  }

  return result.results.map(user => ({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    accountType: user.account_type,
    phone: user.phone,
    businessName: user.business_name,
    businessType: user.business_type,
    marketingOptIn: user.marketing_opt_in === 1,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  }));
}

// ==================== CATEGORY FUNCTIONS ====================

// Create a category
export async function createCategory(categoryData) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const sql = `INSERT INTO categories (id, name, slug, icon, parent_id, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    id,
    categoryData.name,
    categoryData.slug,
    categoryData.icon || null,
    categoryData.parentId || null,
    now
  ];

  await executeQuery(sql, params);
  return { id, ...categoryData, createdAt: now };
}

// Get all categories
export async function getAllCategories() {
  const sql = `SELECT * FROM categories ORDER BY name ASC`;
  const result = await executeQuery(sql, []);

  if (!result.results) return [];

  return result.results.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    parentId: cat.parent_id,
    createdAt: cat.created_at
  }));
}

// Get all categories with product counts
export async function getCategoriesWithCounts() {
  const sql = `
    SELECT c.*, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
    GROUP BY c.id
    ORDER BY product_count DESC, c.name ASC
  `;
  const result = await executeQuery(sql, []);

  if (!result.results) return [];

  return result.results.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    parentId: cat.parent_id,
    count: cat.product_count || 0,
    createdAt: cat.created_at
  }));
}

// Get featured sellers (sellers with products, ordered by rating/sales)
export async function getFeaturedSellers(limit = 4) {
  const sql = `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.business_name,
      u.email,
      COUNT(DISTINCT p.id) as product_count,
      COALESCE(SUM(p.sold_count), 0) as total_sold,
      COALESCE(AVG(p.rating), 0) as avg_rating,
      COALESCE(SUM(p.review_count), 0) as total_reviews
    FROM users u
    INNER JOIN products p ON u.id = p.seller_id AND p.is_active = 1
    WHERE u.account_type IN ('seller', 'both')
    GROUP BY u.id
    HAVING product_count > 0
    ORDER BY total_sold DESC, avg_rating DESC
    LIMIT ?
  `;

  const result = await executeQuery(sql, [limit]);

  if (!result.results) return [];

  return result.results.map(seller => ({
    id: seller.id,
    name: seller.business_name || `${seller.first_name} ${seller.last_name}`,
    firstName: seller.first_name,
    lastName: seller.last_name,
    businessName: seller.business_name,
    products: seller.product_count,
    rating: Math.round(seller.avg_rating * 10) / 10,
    reviews: seller.total_reviews,
    totalSold: seller.total_sold,
    verified: true
  }));
}

// ==================== PRODUCT FUNCTIONS ====================

// Helper to map DB product to JS object
function mapProductFromDb(product) {
  return {
    id: product.id,
    sellerId: product.seller_id,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.original_price,
    categoryId: product.category_id,
    stock: product.stock,
    image: product.image,
    imageAlt: product.image_alt,
    images: product.images ? JSON.parse(product.images) : [],
    rating: product.rating,
    reviewCount: product.review_count,
    soldCount: product.sold_count,
    location: product.location,
    isActive: product.is_active === 1,
    isFeatured: product.is_featured === 1,
    freeShipping: product.free_shipping === 1,
    createdAt: product.created_at,
    updatedAt: product.updated_at
  };
}

// Create a new product
export async function createProduct(productData) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const sql = `
    INSERT INTO products (id, seller_id, name, description, price, original_price, category_id, stock, image, image_alt, images, rating, review_count, sold_count, location, is_active, is_featured, free_shipping, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    productData.sellerId,
    productData.name,
    productData.description || null,
    productData.price,
    productData.originalPrice || null,
    productData.categoryId || null,
    productData.stock || 0,
    productData.image || null,
    productData.imageAlt || productData.name,
    productData.images ? JSON.stringify(productData.images) : null,
    productData.rating || 0,
    productData.reviewCount || 0,
    productData.soldCount || 0,
    productData.location || null,
    productData.isActive !== false ? 1 : 0,
    productData.isFeatured ? 1 : 0,
    productData.freeShipping ? 1 : 0,
    now,
    now
  ];

  await executeQuery(sql, params);

  return {
    id,
    ...productData,
    createdAt: now,
    updatedAt: now
  };
}

// Get product by ID
export async function getProductById(id) {
  const sql = `SELECT p.*, u.first_name as seller_first_name, u.last_name as seller_last_name, u.business_name as seller_business_name
    FROM products p
    LEFT JOIN users u ON p.seller_id = u.id
    WHERE p.id = ? AND p.is_active = 1
    LIMIT 1`;

  const result = await executeQuery(sql, [id]);

  if (!result.results || result.results.length === 0) {
    return null;
  }

  const product = result.results[0];
  return {
    ...mapProductFromDb(product),
    seller: {
      id: product.seller_id,
      name: product.seller_business_name || `${product.seller_first_name} ${product.seller_last_name}`,
      firstName: product.seller_first_name,
      lastName: product.seller_last_name,
      businessName: product.seller_business_name
    }
  };
}

// Get all products with optional filters
export async function getProducts(options = {}) {
  const {
    categoryId,
    sellerId,
    minPrice,
    maxPrice,
    minRating,
    search,
    inStockOnly,
    isFeatured,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    limit = 50,
    offset = 0
  } = options;

  let sql = `SELECT p.*, u.first_name as seller_first_name, u.last_name as seller_last_name, u.business_name as seller_business_name
    FROM products p
    LEFT JOIN users u ON p.seller_id = u.id
    WHERE p.is_active = 1`;

  const params = [];

  if (categoryId) {
    sql += ` AND p.category_id = ?`;
    params.push(categoryId);
  }

  if (sellerId) {
    sql += ` AND p.seller_id = ?`;
    params.push(sellerId);
  }

  if (minPrice !== undefined) {
    sql += ` AND p.price >= ?`;
    params.push(minPrice);
  }

  if (maxPrice !== undefined) {
    sql += ` AND p.price <= ?`;
    params.push(maxPrice);
  }

  if (minRating !== undefined) {
    sql += ` AND p.rating >= ?`;
    params.push(minRating);
  }

  if (search) {
    sql += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  if (inStockOnly) {
    sql += ` AND p.stock > 0`;
  }

  if (isFeatured) {
    sql += ` AND p.is_featured = 1`;
  }

  // Sorting
  const validSortColumns = ['created_at', 'price', 'rating', 'sold_count', 'name'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  sql += ` ORDER BY p.${sortColumn} ${order}`;

  // Pagination
  sql += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const result = await executeQuery(sql, params);

  if (!result.results) return [];

  return result.results.map(product => ({
    ...mapProductFromDb(product),
    seller: {
      id: product.seller_id,
      name: product.seller_business_name || `${product.seller_first_name} ${product.seller_last_name}`,
      verified: true // TODO: Add verified field to users
    }
  }));
}

// Get featured/trending products
export async function getFeaturedProducts(limit = 10) {
  return getProducts({ isFeatured: true, limit, sortBy: 'rating', sortOrder: 'DESC' });
}

// Update a product
export async function updateProduct(id, updates) {
  const now = new Date().toISOString();
  const fields = [];
  const params = [];

  const fieldMap = {
    name: 'name',
    description: 'description',
    price: 'price',
    originalPrice: 'original_price',
    categoryId: 'category_id',
    stock: 'stock',
    image: 'image',
    imageAlt: 'image_alt',
    location: 'location',
    isActive: 'is_active',
    isFeatured: 'is_featured',
    freeShipping: 'free_shipping'
  };

  for (const [key, dbField] of Object.entries(fieldMap)) {
    if (updates[key] !== undefined) {
      fields.push(`${dbField} = ?`);
      if (key === 'isActive' || key === 'isFeatured' || key === 'freeShipping') {
        params.push(updates[key] ? 1 : 0);
      } else {
        params.push(updates[key]);
      }
    }
  }

  if (updates.images !== undefined) {
    fields.push('images = ?');
    params.push(JSON.stringify(updates.images));
  }

  fields.push('updated_at = ?');
  params.push(now);
  params.push(id);

  const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
  await executeQuery(sql, params);

  return getProductById(id);
}

// Delete a product (soft delete by setting is_active = 0)
export async function deleteProduct(id) {
  const sql = `UPDATE products SET is_active = 0, updated_at = ? WHERE id = ?`;
  await executeQuery(sql, [new Date().toISOString(), id]);
  return true;
}

// Get products by seller
export async function getProductsBySeller(sellerId, limit = 50) {
  return getProducts({ sellerId, limit });
}

// Get product count
export async function getProductCount(options = {}) {
  let sql = `SELECT COUNT(*) as count FROM products WHERE is_active = 1`;
  const params = [];

  if (options.categoryId) {
    sql += ` AND category_id = ?`;
    params.push(options.categoryId);
  }

  if (options.sellerId) {
    sql += ` AND seller_id = ?`;
    params.push(options.sellerId);
  }

  const result = await executeQuery(sql, params);
  return result.results?.[0]?.count || 0;
}

// ==================== SELLER ANALYTICS ====================

// Get seller statistics
export async function getSellerStats(sellerId) {
  // Get active listings count
  const activeListingsSql = `
    SELECT COUNT(*) as count
    FROM products
    WHERE seller_id = ? AND is_active = 1
  `;
  const activeResult = await executeQuery(activeListingsSql, [sellerId]);
  const activeListings = activeResult.results?.[0]?.count || 0;

  // Get total listings (including inactive)
  const totalListingsSql = `
    SELECT COUNT(*) as count
    FROM products
    WHERE seller_id = ?
  `;
  const totalResult = await executeQuery(totalListingsSql, [sellerId]);
  const totalListings = totalResult.results?.[0]?.count || 0;

  // Get total items sold and revenue
  const salesSql = `
    SELECT
      COALESCE(SUM(sold_count), 0) as total_sold,
      COALESCE(SUM(price * sold_count), 0) as total_revenue,
      COALESCE(SUM(stock), 0) as total_stock
    FROM products
    WHERE seller_id = ? AND is_active = 1
  `;
  const salesResult = await executeQuery(salesSql, [sellerId]);
  const salesData = salesResult.results?.[0] || {};

  // Get top performing products
  const topProductsSql = `
    SELECT id, name, price, sold_count, rating, review_count, image
    FROM products
    WHERE seller_id = ? AND is_active = 1
    ORDER BY sold_count DESC
    LIMIT 5
  `;
  const topProductsResult = await executeQuery(topProductsSql, [sellerId]);
  const topProducts = (topProductsResult.results || []).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    soldCount: p.sold_count,
    rating: p.rating,
    reviewCount: p.review_count,
    image: p.image,
    revenue: p.price * p.sold_count
  }));

  // Get products by category breakdown
  const categoryBreakdownSql = `
    SELECT
      COALESCE(c.name, 'Uncategorized') as category_name,
      COUNT(*) as product_count,
      COALESCE(SUM(p.sold_count), 0) as total_sold
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.seller_id = ? AND p.is_active = 1
    GROUP BY p.category_id
    ORDER BY total_sold DESC
  `;
  const categoryResult = await executeQuery(categoryBreakdownSql, [sellerId]);
  const categoryBreakdown = (categoryResult.results || []).map(c => ({
    category: c.category_name,
    productCount: c.product_count,
    totalSold: c.total_sold
  }));

  // Get recent products (last 30 days activity simulation based on created_at)
  const recentActivitySql = `
    SELECT
      DATE(created_at) as date,
      COUNT(*) as new_listings
    FROM products
    WHERE seller_id = ? AND created_at >= datetime('now', '-30 days')
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT 30
  `;
  const recentResult = await executeQuery(recentActivitySql, [sellerId]);
  const recentActivity = recentResult.results || [];

  return {
    activeListings,
    totalListings,
    totalSold: salesData.total_sold || 0,
    totalRevenue: salesData.total_revenue || 0,
    totalStock: salesData.total_stock || 0,
    topProducts,
    categoryBreakdown,
    recentActivity,
    // Calculated metrics
    averagePrice: activeListings > 0 ? (salesData.total_revenue || 0) / Math.max(salesData.total_sold || 1, 1) : 0,
    conversionRate: 0 // Would need view tracking to calculate this properly
  };
}

// ==================== ORDER FUNCTIONS ====================

// Get next order number
async function getNextOrderNumber() {
  const sql = `SELECT MAX(order_number) as max_num FROM orders`;
  const result = await executeQuery(sql, []);
  return (result.results?.[0]?.max_num || 10000) + 1;
}

// Create a new order
export async function createOrder(orderData) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const orderNumber = await getNextOrderNumber();

  const sql = `
    INSERT INTO orders (id, order_number, buyer_id, seller_id, status, subtotal, shipping_cost, tax, total, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    orderNumber,
    orderData.buyerId,
    orderData.sellerId,
    orderData.status || 'pending',
    orderData.subtotal,
    orderData.shippingCost || 0,
    orderData.tax || 0,
    orderData.total,
    orderData.shippingAddress,
    orderData.shippingCity,
    orderData.shippingState,
    orderData.shippingZip,
    orderData.shippingCountry || 'USA',
    orderData.notes || null,
    now,
    now
  ];

  await executeQuery(sql, params);

  // Add order items if provided
  if (orderData.items && orderData.items.length > 0) {
    for (const item of orderData.items) {
      await addOrderItem(id, item);
    }
  }

  return { id, orderNumber, ...orderData, createdAt: now, updatedAt: now };
}

// Add item to order
export async function addOrderItem(orderId, itemData) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const sql = `
    INSERT INTO order_items (id, order_id, product_id, product_name, product_image, quantity, unit_price, total_price, variant, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    orderId,
    itemData.productId,
    itemData.productName,
    itemData.productImage || null,
    itemData.quantity || 1,
    itemData.unitPrice,
    itemData.totalPrice || (itemData.unitPrice * (itemData.quantity || 1)),
    itemData.variant || null,
    now
  ];

  await executeQuery(sql, params);
  return { id, ...itemData };
}

// Get orders for a seller
export async function getSellerOrders(sellerId, options = {}) {
  const { status, limit = 50, offset = 0 } = options;

  let sql = `
    SELECT o.*, u.first_name as buyer_first_name, u.last_name as buyer_last_name, u.email as buyer_email
    FROM orders o
    LEFT JOIN users u ON o.buyer_id = u.id
    WHERE o.seller_id = ?
  `;
  const params = [sellerId];

  if (status) {
    sql += ` AND o.status = ?`;
    params.push(status);
  }

  sql += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const result = await executeQuery(sql, params);

  if (!result.results) return [];

  // Get order items for each order
  const orders = await Promise.all(result.results.map(async (order) => {
    const itemsSql = `SELECT * FROM order_items WHERE order_id = ?`;
    const itemsResult = await executeQuery(itemsSql, [order.id]);

    return {
      id: order.id,
      orderNumber: order.order_number,
      customer: `${order.buyer_first_name} ${order.buyer_last_name}`,
      customerEmail: order.buyer_email,
      buyerId: order.buyer_id,
      status: order.status,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      tax: order.tax,
      total: order.total,
      shippingAddress: `${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state} ${order.shipping_zip}`,
      trackingNumber: order.tracking_number,
      items: (itemsResult.results || []).map(item => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        productImage: item.product_image,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalPrice: item.total_price,
        variant: item.variant
      })),
      itemCount: itemsResult.results?.length || 0,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      date: new Date(order.created_at).toLocaleString()
    };
  }));

  return orders;
}

// Get orders for a buyer
export async function getBuyerOrders(buyerId, options = {}) {
  const { status, limit = 50, offset = 0 } = options;

  let sql = `
    SELECT o.*, u.first_name as seller_first_name, u.last_name as seller_last_name, u.business_name as seller_business_name
    FROM orders o
    LEFT JOIN users u ON o.seller_id = u.id
    WHERE o.buyer_id = ?
  `;
  const params = [buyerId];

  if (status) {
    sql += ` AND o.status = ?`;
    params.push(status);
  }

  sql += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const result = await executeQuery(sql, params);

  if (!result.results) return [];

  const orders = await Promise.all(result.results.map(async (order) => {
    const itemsSql = `SELECT * FROM order_items WHERE order_id = ?`;
    const itemsResult = await executeQuery(itemsSql, [order.id]);

    return {
      id: order.id,
      orderNumber: order.order_number,
      seller: order.seller_business_name || `${order.seller_first_name} ${order.seller_last_name}`,
      sellerId: order.seller_id,
      status: order.status,
      total: order.total,
      items: (itemsResult.results || []).map(item => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        productImage: item.product_image,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalPrice: item.total_price
      })),
      itemCount: itemsResult.results?.length || 0,
      createdAt: order.created_at,
      date: new Date(order.created_at).toLocaleString()
    };
  }));

  return orders;
}

// Update order status
export async function updateOrderStatus(orderId, status, trackingNumber = null) {
  const now = new Date().toISOString();
  let sql = `UPDATE orders SET status = ?, updated_at = ?`;
  const params = [status, now];

  if (trackingNumber) {
    sql += `, tracking_number = ?`;
    params.push(trackingNumber);
  }

  sql += ` WHERE id = ?`;
  params.push(orderId);

  await executeQuery(sql, params);
  return { orderId, status, trackingNumber, updatedAt: now };
}

// Get order count for seller
export async function getSellerOrderCount(sellerId, status = null) {
  let sql = `SELECT COUNT(*) as count FROM orders WHERE seller_id = ?`;
  const params = [sellerId];

  if (status) {
    sql += ` AND status = ?`;
    params.push(status);
  }

  const result = await executeQuery(sql, params);
  return result.results?.[0]?.count || 0;
}

// ==================== MESSAGE FUNCTIONS ====================

// Create a new message
export async function createMessage(messageData) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const conversationId = messageData.conversationId || crypto.randomUUID();

  const sql = `
    INSERT INTO messages (id, conversation_id, sender_id, receiver_id, order_id, subject, content, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id,
    conversationId,
    messageData.senderId,
    messageData.receiverId,
    messageData.orderId || null,
    messageData.subject || null,
    messageData.content,
    0,
    now
  ];

  await executeQuery(sql, params);
  return { id, conversationId, ...messageData, isRead: false, createdAt: now };
}

// Get messages for a user (as receiver - their inbox)
export async function getUserMessages(userId, options = {}) {
  const { unreadOnly = false, limit = 50, offset = 0 } = options;

  let sql = `
    SELECT m.*,
      u.first_name as sender_first_name,
      u.last_name as sender_last_name,
      o.order_number
    FROM messages m
    LEFT JOIN users u ON m.sender_id = u.id
    LEFT JOIN orders o ON m.order_id = o.id
    WHERE m.receiver_id = ?
  `;
  const params = [userId];

  if (unreadOnly) {
    sql += ` AND m.is_read = 0`;
  }

  sql += ` ORDER BY m.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const result = await executeQuery(sql, params);

  if (!result.results) return [];

  return result.results.map(msg => ({
    id: msg.id,
    conversationId: msg.conversation_id,
    senderId: msg.sender_id,
    sender: `${msg.sender_first_name} ${msg.sender_last_name}`,
    orderId: msg.order_id,
    orderNumber: msg.order_number,
    subject: msg.subject,
    content: msg.content,
    preview: msg.content.length > 100 ? msg.content.substring(0, 100) + '...' : msg.content,
    unread: msg.is_read === 0,
    createdAt: msg.created_at,
    time: getRelativeTime(msg.created_at)
  }));
}

// Mark message as read
export async function markMessageAsRead(messageId) {
  const sql = `UPDATE messages SET is_read = 1 WHERE id = ?`;
  await executeQuery(sql, [messageId]);
  return { messageId, isRead: true };
}

// Mark all messages in conversation as read
export async function markConversationAsRead(conversationId, userId) {
  const sql = `UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND receiver_id = ?`;
  await executeQuery(sql, [conversationId, userId]);
  return { conversationId, isRead: true };
}

// Get unread message count
export async function getUnreadMessageCount(userId) {
  const sql = `SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0`;
  const result = await executeQuery(sql, [userId]);
  return result.results?.[0]?.count || 0;
}

// Helper function to get relative time
function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}
