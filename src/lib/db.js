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
