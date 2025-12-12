import Header from '@/components/common/Header';
import MarketplaceHomeInteractive from './components/MarketplaceHomeInteractive';

export const metadata = {
  title: 'Marketplace Home - ZApp',
  description: 'Discover trending products, explore categories, and connect with trusted sellers on ZApp. Your one-stop marketplace for everything you need.'
};

export default function MarketplaceHomePage() {
  const pageData = {
    banners: [
    {
      id: 1,
      title: "Discover Amazing Deals",
      description: "Shop from thousands of verified sellers and get the best prices on quality products",
      image: "https://images.unsplash.com/photo-1652270101634-ae8a39c83089",
      alt: "Modern shopping mall interior with bright lighting and multiple retail stores showcasing various products"
    }],


    categories: [
    { id: 1, name: "Electronics", slug: "electronics", icon: "ComputerDesktopIcon", count: 1234 },
    { id: 2, name: "Fashion", slug: "fashion", icon: "SparklesIcon", count: 2456 },
    { id: 3, name: "Home & Garden", slug: "home-garden", icon: "HomeIcon", count: 987 },
    { id: 4, name: "Sports", slug: "sports", icon: "TrophyIcon", count: 654 },
    { id: 5, name: "Books", slug: "books", icon: "BookOpenIcon", count: 1876 },
    { id: 6, name: "Toys", slug: "toys", icon: "PuzzlePieceIcon", count: 543 }],


    liveActivities: [
    { user: "Sarah M.", action: "just purchased Wireless Headphones", icon: "ShoppingBagIcon" },
    { user: "John D.", action: "added Smart Watch to cart", icon: "ShoppingCartIcon" },
    { user: "Emma R.", action: "left a 5-star review", icon: "StarIcon" },
    { user: "Mike T.", action: "just purchased Gaming Mouse", icon: "ShoppingBagIcon" },
    { user: "Lisa K.", action: "added Laptop Stand to wishlist", icon: "HeartIcon" }],


    trendingProducts: [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones with Noise Cancellation",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.5,
      reviews: 234,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_13e126511-1765030295691.png",
      alt: "Black wireless over-ear headphones with silver accents on white background",
      badge: "30% OFF",
      location: "New York, NY"
    },
    {
      id: 2,
      name: "Smart Watch Series 7 with Fitness Tracking",
      price: 299.99,
      rating: 4.8,
      reviews: 567,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1dd51548c-1764641911784.png",
      alt: "Silver smartwatch with black sport band displaying fitness metrics on screen",
      location: "Los Angeles, CA"
    },
    {
      id: 3,
      name: "Professional DSLR Camera with 18-55mm Lens",
      price: 649.99,
      originalPrice: 799.99,
      rating: 4.7,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1548348914-1596523128e4",
      alt: "Black professional DSLR camera with attached zoom lens on wooden surface",
      badge: "SALE",
      location: "Chicago, IL"
    },
    {
      id: 4,
      name: "Ergonomic Office Chair with Lumbar Support",
      price: 199.99,
      rating: 4.6,
      reviews: 423,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_18708439b-1765030625603.png",
      alt: "Modern black mesh office chair with adjustable armrests and chrome base",
      location: "Houston, TX"
    },
    {
      id: 5,
      name: "4K Ultra HD Smart TV 55 Inch",
      price: 499.99,
      originalPrice: 699.99,
      rating: 4.9,
      reviews: 891,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_11652f0de-1764656705832.png",
      alt: "Large flat screen television displaying vibrant nature scene in modern living room",
      badge: "HOT",
      location: "Phoenix, AZ"
    }],


    recentlyViewed: [
    {
      id: 6,
      name: "Mechanical Gaming Keyboard RGB Backlit",
      price: 79.99,
      rating: 4.4,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1636059151106-5471f93f1dc9",
      alt: "Black mechanical keyboard with colorful RGB lighting effects on dark desk",
      location: "Philadelphia, PA"
    },
    {
      id: 7,
      name: "Portable Bluetooth Speaker Waterproof",
      price: 49.99,
      rating: 4.3,
      reviews: 267,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1aae88582-1764660840888.png",
      alt: "Compact cylindrical bluetooth speaker in blue color with rubber exterior",
      location: "San Antonio, TX"
    },
    {
      id: 8,
      name: "Wireless Gaming Mouse with Precision Sensor",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.7,
      reviews: 445,
      image: "https://images.unsplash.com/photo-1616296425622-4560a2ad83de",
      alt: "Sleek black gaming mouse with blue LED accents and ergonomic design",
      badge: "DEAL",
      location: "San Diego, CA"
    },
    {
      id: 9,
      name: "USB-C Hub Multi-Port Adapter",
      price: 34.99,
      rating: 4.5,
      reviews: 178,
      image: "https://images.unsplash.com/photo-1723084361651-07961a486ca0",
      alt: "Gray aluminum USB-C hub with multiple ports connected to laptop",
      location: "Dallas, TX"
    },
    {
      id: 10,
      name: "Laptop Stand Aluminum Adjustable",
      price: 39.99,
      rating: 4.6,
      reviews: 523,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f9ea2001-1764658995251.png",
      alt: "Silver aluminum laptop stand with adjustable height on modern desk setup",
      location: "San Jose, CA"
    }],


    featuredSellers: [
    {
      id: 1,
      name: "TechGear Pro",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1e68ec39e-1763298711603.png",
      alt: "Professional headshot of Asian man in navy blue suit with confident smile",
      rating: 4.9,
      reviews: 1234,
      products: 156,
      location: "Seattle, WA",
      verified: true
    },
    {
      id: 2,
      name: "Fashion Hub",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_12b5e8ad3-1763296664938.png",
      alt: "Professional portrait of woman with long brown hair in white blazer",
      rating: 4.8,
      reviews: 987,
      products: 234,
      location: "Miami, FL",
      verified: true
    },
    {
      id: 3,
      name: "Home Essentials",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1559b8ce3-1763295391955.png",
      alt: "Casual portrait of bearded man in plaid shirt with friendly expression",
      rating: 4.7,
      reviews: 756,
      products: 189,
      location: "Denver, CO",
      verified: true
    },
    {
      id: 4,
      name: "Sports World",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1c659845b-1763295689639.png",
      alt: "Professional headshot of woman with short blonde hair in black top",
      rating: 4.9,
      reviews: 1456,
      products: 278,
      location: "Boston, MA",
      verified: true
    }],


    popularNearby: [
    {
      id: 11,
      name: "Stainless Steel Water Bottle Insulated",
      price: 24.99,
      rating: 4.6,
      reviews: 234,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1fb97d46e-1764683597174.png",
      alt: "Sleek stainless steel water bottle in silver color with vacuum insulation",
      location: "Austin, TX"
    },
    {
      id: 12,
      name: "Yoga Mat Non-Slip Exercise Fitness",
      price: 29.99,
      rating: 4.5,
      reviews: 345,
      image: "https://images.unsplash.com/photo-1567281105305-11c3e4ace86b",
      alt: "Purple yoga mat rolled up with carrying strap on wooden floor",
      location: "Austin, TX"
    },
    {
      id: 13,
      name: "LED Desk Lamp with USB Charging Port",
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.7,
      reviews: 456,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e7a14a69-1764656591353.png",
      alt: "Modern white LED desk lamp with adjustable arm and USB port",
      badge: "SAVE",
      location: "Austin, TX"
    },
    {
      id: 14,
      name: "Wireless Charging Pad Fast Charge",
      price: 19.99,
      rating: 4.4,
      reviews: 289,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c664a820-1764670565959.png",
      alt: "Black circular wireless charging pad with LED indicator light",
      location: "Austin, TX"
    },
    {
      id: 15,
      name: "Backpack Laptop Travel Business",
      price: 49.99,
      rating: 4.8,
      reviews: 678,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1582a6795-1764834105622.png",
      alt: "Gray professional backpack with multiple compartments and laptop sleeve",
      location: "Austin, TX"
    }],


    recommendedProducts: [
    {
      id: 16,
      name: "Coffee Maker Programmable 12-Cup",
      price: 79.99,
      rating: 4.6,
      reviews: 567,
      image: "https://images.unsplash.com/photo-1607448683126-a69a9dbedd61",
      alt: "Stainless steel coffee maker with glass carafe and digital display",
      location: "Portland, OR"
    },
    {
      id: 17,
      name: "Air Purifier HEPA Filter for Home",
      price: 129.99,
      originalPrice: 179.99,
      rating: 4.7,
      reviews: 432,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1536efeed-1764706527508.png",
      alt: "White cylindrical air purifier with touch controls and LED display",
      badge: "NEW",
      location: "Seattle, WA"
    },
    {
      id: 18,
      name: "Electric Toothbrush Rechargeable Sonic",
      price: 59.99,
      rating: 4.8,
      reviews: 789,
      image: "https://images.unsplash.com/photo-1575325345210-a65324e66537",
      alt: "White electric toothbrush with charging base and multiple brush heads",
      location: "San Francisco, CA"
    },
    {
      id: 19,
      name: "Fitness Tracker Smart Band Heart Rate",
      price: 39.99,
      rating: 4.5,
      reviews: 345,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1889135d6-1764680248899.png",
      alt: "Black fitness tracker band with color touchscreen display showing heart rate",
      location: "Las Vegas, NV"
    },
    {
      id: 20,
      name: "Portable Power Bank 20000mAh Fast Charge",
      price: 34.99,
      rating: 4.6,
      reviews: 456,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_131ba0a6d-1764641912026.png",
      alt: "Compact black power bank with LED battery indicator and dual USB ports",
      location: "Nashville, TN"
    }]

  };

  return (
    <>
      <Header  notificationCount={0} />

      <main className="pt-[60px]">
        <MarketplaceHomeInteractive pageData={pageData} />
      </main>
    </>);

}