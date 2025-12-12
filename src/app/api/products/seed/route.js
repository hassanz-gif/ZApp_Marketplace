import { NextResponse } from 'next/server';
import { createProduct, createCategory, getAllCategories, getProducts } from '@/lib/db';

// Sample products data based on current mock data
const sampleCategories = [
  { name: 'Electronics', slug: 'electronics', icon: 'ComputerDesktopIcon' },
  { name: 'Fashion', slug: 'fashion', icon: 'SparklesIcon' },
  { name: 'Home & Garden', slug: 'home-garden', icon: 'HomeIcon' },
  { name: 'Sports', slug: 'sports', icon: 'TrophyIcon' },
  { name: 'Books', slug: 'books', icon: 'BookOpenIcon' },
  { name: 'Toys', slug: 'toys', icon: 'PuzzlePieceIcon' }
];

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones with Noise Cancellation',
    description: 'Premium wireless over-ear headphones featuring active noise cancellation, 30-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals.',
    price: 89.99,
    originalPrice: 129.99,
    category: 'electronics',
    stock: 50,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13e126511-1765030295691.png',
    imageAlt: 'Black wireless over-ear headphones with silver accents on white background',
    rating: 4.5,
    reviewCount: 234,
    soldCount: 1250,
    location: 'New York, NY',
    isFeatured: true,
    freeShipping: true
  },
  {
    name: 'Smart Watch Series 7 with Fitness Tracking',
    description: 'Advanced smartwatch with comprehensive fitness tracking, heart rate monitoring, GPS, and 5-day battery life. Water-resistant and perfect for active lifestyles.',
    price: 299.99,
    category: 'electronics',
    stock: 35,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1dd51548c-1764641911784.png',
    imageAlt: 'Silver smartwatch with black sport band displaying fitness metrics on screen',
    rating: 4.8,
    reviewCount: 567,
    soldCount: 890,
    location: 'Los Angeles, CA',
    isFeatured: true
  },
  {
    name: 'Professional DSLR Camera with 18-55mm Lens',
    description: 'High-quality DSLR camera kit perfect for photography enthusiasts. Includes 18-55mm lens, 24.1 megapixel sensor, and 4K video recording capability.',
    price: 649.99,
    originalPrice: 799.99,
    category: 'electronics',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1548348914-1596523128e4',
    imageAlt: 'Black professional DSLR camera with attached zoom lens on wooden surface',
    rating: 4.7,
    reviewCount: 189,
    soldCount: 445,
    location: 'Chicago, IL',
    isFeatured: true
  },
  {
    name: 'Ergonomic Office Chair with Lumbar Support',
    description: 'Premium ergonomic office chair designed for long hours of comfortable sitting. Features adjustable lumbar support, breathable mesh back, and 4D armrests.',
    price: 199.99,
    category: 'home-garden',
    stock: 45,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_18708439b-1765030625603.png',
    imageAlt: 'Modern black mesh office chair with adjustable armrests and chrome base',
    rating: 4.6,
    reviewCount: 423,
    soldCount: 780,
    location: 'Houston, TX',
    isFeatured: true
  },
  {
    name: '4K Ultra HD Smart TV 55 Inch',
    description: 'Stunning 55-inch 4K UHD smart TV with HDR support, built-in streaming apps, voice control, and immersive Dolby Atmos sound.',
    price: 499.99,
    originalPrice: 699.99,
    category: 'electronics',
    stock: 25,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_11652f0de-1764656705832.png',
    imageAlt: 'Large flat screen television displaying vibrant nature scene in modern living room',
    rating: 4.9,
    reviewCount: 891,
    soldCount: 2100,
    location: 'Phoenix, AZ',
    isFeatured: true
  },
  {
    name: 'Mechanical Gaming Keyboard RGB Backlit',
    description: 'High-performance mechanical gaming keyboard with customizable RGB backlighting, Cherry MX switches, and programmable macro keys.',
    price: 79.99,
    category: 'electronics',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1636059151106-5471f93f1dc9',
    imageAlt: 'Black mechanical keyboard with colorful RGB lighting effects on dark desk',
    rating: 4.4,
    reviewCount: 312,
    soldCount: 920,
    location: 'Philadelphia, PA'
  },
  {
    name: 'Portable Bluetooth Speaker Waterproof',
    description: 'Compact waterproof Bluetooth speaker with 360-degree sound, 12-hour battery, and IP67 rating. Perfect for outdoor adventures.',
    price: 49.99,
    category: 'electronics',
    stock: 80,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1aae88582-1764660840888.png',
    imageAlt: 'Compact cylindrical bluetooth speaker in blue color with rubber exterior',
    rating: 4.3,
    reviewCount: 267,
    soldCount: 650,
    location: 'San Antonio, TX'
  },
  {
    name: 'Wireless Gaming Mouse with Precision Sensor',
    description: 'Professional wireless gaming mouse featuring 25K DPI sensor, ultra-lightweight design, and 70-hour battery life.',
    price: 59.99,
    originalPrice: 79.99,
    category: 'electronics',
    stock: 70,
    image: 'https://images.unsplash.com/photo-1616296425622-4560a2ad83de',
    imageAlt: 'Sleek black gaming mouse with blue LED accents and ergonomic design',
    rating: 4.7,
    reviewCount: 445,
    soldCount: 1100,
    location: 'San Diego, CA'
  },
  {
    name: 'Stainless Steel Water Bottle Insulated',
    description: 'Premium vacuum-insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.',
    price: 24.99,
    category: 'sports',
    stock: 120,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1fb97d46e-1764683597174.png',
    imageAlt: 'Sleek stainless steel water bottle in silver color with vacuum insulation',
    rating: 4.6,
    reviewCount: 234,
    soldCount: 540,
    location: 'Austin, TX'
  },
  {
    name: 'Yoga Mat Non-Slip Exercise Fitness',
    description: 'Extra thick yoga mat with superior grip and cushioning. Perfect for yoga, pilates, and floor exercises. Includes carrying strap.',
    price: 29.99,
    category: 'sports',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1567281105305-11c3e4ace86b',
    imageAlt: 'Purple yoga mat rolled up with carrying strap on wooden floor',
    rating: 4.5,
    reviewCount: 345,
    soldCount: 780,
    location: 'Austin, TX'
  },
  {
    name: 'LED Desk Lamp with USB Charging Port',
    description: 'Modern LED desk lamp with adjustable brightness, color temperature control, and built-in USB charging port. Energy-efficient design.',
    price: 39.99,
    originalPrice: 59.99,
    category: 'home-garden',
    stock: 55,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e7a14a69-1764656591353.png',
    imageAlt: 'Modern white LED desk lamp with adjustable arm and USB port',
    rating: 4.7,
    reviewCount: 456,
    soldCount: 890,
    location: 'Austin, TX'
  },
  {
    name: 'Wireless Charging Pad Fast Charge',
    description: '15W fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and overcharge protection.',
    price: 19.99,
    category: 'electronics',
    stock: 100,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c664a820-1764670565959.png',
    imageAlt: 'Black circular wireless charging pad with LED indicator light',
    rating: 4.4,
    reviewCount: 289,
    soldCount: 670,
    location: 'Austin, TX'
  },
  {
    name: 'Backpack Laptop Travel Business',
    description: 'Professional travel backpack with dedicated laptop compartment, anti-theft design, USB charging port, and water-resistant material.',
    price: 49.99,
    category: 'fashion',
    stock: 65,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1582a6795-1764834105622.png',
    imageAlt: 'Gray professional backpack with multiple compartments and laptop sleeve',
    rating: 4.8,
    reviewCount: 678,
    soldCount: 1450,
    location: 'Austin, TX'
  },
  {
    name: 'Coffee Maker Programmable 12-Cup',
    description: '12-cup programmable coffee maker with built-in grinder, thermal carafe, and customizable brew strength settings.',
    price: 79.99,
    category: 'home-garden',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1607448683126-a69a9dbedd61',
    imageAlt: 'Stainless steel coffee maker with glass carafe and digital display',
    rating: 4.6,
    reviewCount: 567,
    soldCount: 920,
    location: 'Portland, OR'
  },
  {
    name: 'Air Purifier HEPA Filter for Home',
    description: 'True HEPA air purifier covering up to 500 sq ft. Removes 99.97% of allergens, dust, and pollutants. Quiet operation with sleep mode.',
    price: 129.99,
    originalPrice: 179.99,
    category: 'home-garden',
    stock: 30,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1536efeed-1764706527508.png',
    imageAlt: 'White cylindrical air purifier with touch controls and LED display',
    rating: 4.7,
    reviewCount: 432,
    soldCount: 680,
    location: 'Seattle, WA',
    isFeatured: true
  },
  {
    name: 'Fitness Tracker Smart Band Heart Rate',
    description: 'Slim fitness tracker with continuous heart rate monitoring, sleep tracking, step counter, and 7-day battery life.',
    price: 39.99,
    category: 'electronics',
    stock: 85,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1889135d6-1764680248899.png',
    imageAlt: 'Black fitness tracker band with color touchscreen display showing heart rate',
    rating: 4.5,
    reviewCount: 345,
    soldCount: 890,
    location: 'Las Vegas, NV'
  },
  {
    name: 'Portable Power Bank 20000mAh Fast Charge',
    description: 'High-capacity 20000mAh power bank with 65W fast charging, dual USB-C ports, and LED battery indicator.',
    price: 34.99,
    category: 'electronics',
    stock: 75,
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_131ba0a6d-1764641912026.png',
    imageAlt: 'Compact black power bank with LED battery indicator and dual USB ports',
    rating: 4.6,
    reviewCount: 456,
    soldCount: 1230,
    location: 'Nashville, TN'
  }
];

// POST /api/products/seed - Seed the database with sample data
export async function POST(request) {
  try {
    // Check if products already exist
    const existingProducts = await getProducts({ limit: 1 });
    if (existingProducts.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Database already has products. Clear the database first if you want to reseed.'
      }, { status: 400 });
    }

    // Create categories
    const categoryMap = {};
    for (const cat of sampleCategories) {
      const created = await createCategory(cat);
      categoryMap[cat.slug] = created.id;
    }

    // Create products with a default seller ID
    // In production, this would be linked to actual seller accounts
    const defaultSellerId = 'seed-seller-001';
    const createdProducts = [];

    for (const product of sampleProducts) {
      const categoryId = categoryMap[product.category] || null;
      const created = await createProduct({
        ...product,
        sellerId: defaultSellerId,
        categoryId
      });
      createdProducts.push(created);
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${sampleCategories.length} categories and ${createdProducts.length} products`,
      categories: Object.keys(categoryMap).length,
      products: createdProducts.length
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database: ' + error.message },
      { status: 500 }
    );
  }
}

// GET /api/products/seed - Check seed status
export async function GET() {
  try {
    const products = await getProducts({ limit: 1 });
    const categories = await getAllCategories();

    return NextResponse.json({
      success: true,
      seeded: products.length > 0,
      categoryCount: categories.length,
      message: products.length > 0
        ? 'Database has been seeded'
        : 'Database is empty. POST to this endpoint to seed.'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
