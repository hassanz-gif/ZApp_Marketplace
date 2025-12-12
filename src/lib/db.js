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
