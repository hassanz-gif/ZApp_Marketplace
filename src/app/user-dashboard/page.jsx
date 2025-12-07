import Header from '@/components/common/Header';
import UserDashboardInteractive from './components/UserDashboardInteractive';

export const metadata = {
  title: 'My Dashboard - MarketPlace Pro',
  description: 'Manage your account, track orders, and explore personalized recommendations on MarketPlace Pro'
};

export default function UserDashboard() {
  const mockData = {
    userName: "Sarah Johnson",
    userRole: "buyer",
    stats: {
      activeOrders: 3,
      totalSpent: 2847,
      wishlistItems: 12,
      savedSearches: 5
    },
    recentOrders: [
    {
      id: 1,
      orderNumber: "ORD-2025-001234",
      productName: "Wireless Bluetooth Headphones with Active Noise Cancellation",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_13e126511-1765030295691.png",
      imageAlt: "Black wireless over-ear headphones with silver accents on white background",
      price: 149.99,
      status: "In Transit",
      date: "Dec 5, 2025"
    },
    {
      id: 2,
      orderNumber: "ORD-2025-001198",
      productName: "Smart Fitness Watch with Heart Rate Monitor",
      image: "https://images.unsplash.com/photo-1523475341152-7d478c4d6875",
      imageAlt: "Black smartwatch with digital display showing fitness metrics on wrist",
      price: 299.99,
      status: "Processing",
      date: "Dec 4, 2025"
    },
    {
      id: 3,
      orderNumber: "ORD-2025-001156",
      productName: "Premium Leather Laptop Bag - 15 inch",
      image: "https://images.unsplash.com/photo-1648465234633-2322de3766ad",
      imageAlt: "Brown leather messenger bag with brass buckles on wooden surface",
      price: 89.99,
      status: "Delivered",
      date: "Dec 1, 2025"
    }],

    recommendedProducts: [
    {
      id: 101,
      name: "Portable Bluetooth Speaker - Waterproof",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1aae88582-1764660840888.png",
      imageAlt: "Cylindrical black portable speaker with blue LED lights on dark background",
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.5,
      reviews: 328
    },
    {
      id: 102,
      name: "USB-C Fast Charging Cable - 6ft",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_14f97e896-1764794994418.png",
      imageAlt: "White braided USB-C charging cable coiled on gray surface",
      price: 19.99,
      rating: 4.8,
      reviews: 892
    },
    {
      id: 103,
      name: "Wireless Phone Charger Stand",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_194127c40-1764872627513.png",
      imageAlt: "Black wireless charging stand with smartphone in vertical position",
      price: 34.99,
      originalPrice: 49.99,
      rating: 4.6,
      reviews: 445
    }],

    wishlistItems: [
    {
      id: 201,
      name: "4K Ultra HD Action Camera",
      image: "https://images.unsplash.com/photo-1568355688771-6413e9fc8df0",
      imageAlt: "Compact black action camera with wide-angle lens on tripod mount",
      price: 249.99,
      inStock: true
    },
    {
      id: 202,
      name: "Mechanical Gaming Keyboard RGB",
      image: "https://images.unsplash.com/photo-1636059151106-5471f93f1dc9",
      imageAlt: "Black mechanical keyboard with multicolor RGB backlighting on desk",
      price: 129.99,
      inStock: true
    },
    {
      id: 203,
      name: "Ergonomic Office Chair",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1fdab09ed-1764692605518.png",
      imageAlt: "Modern gray mesh office chair with adjustable armrests and lumbar support",
      price: 349.99,
      inStock: false
    },
    {
      id: 204,
      name: "Portable SSD 1TB External Drive",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_171a50fe4-1764673877279.png",
      imageAlt: "Silver compact external solid state drive with USB cable",
      price: 119.99,
      inStock: true
    }],

    savedSearches: [
    {
      id: 1,
      query: "Wireless headphones under $200",
      url: "/product-search-results?q=wireless+headphones&max=200",
      filters: ["Electronics", "Audio", "Under $200"],
      results: 47,
      savedDate: "3 days ago"
    },
    {
      id: 2,
      query: "Gaming laptops with RTX graphics",
      url: "/product-search-results?q=gaming+laptops+rtx",
      filters: ["Computers", "Gaming", "RTX Graphics"],
      results: 23,
      savedDate: "1 week ago"
    },
    {
      id: 3,
      query: "Organic cotton t-shirts",
      url: "/product-search-results?q=organic+cotton+tshirts",
      filters: ["Clothing", "Organic", "T-Shirts"],
      results: 156,
      savedDate: "2 weeks ago"
    }],

    notifications: [
    {
      id: 1,
      type: "order",
      title: "Order Shipped",
      message: "Your order #ORD-2025-001234 has been shipped and is on the way",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "message",
      title: "New Message from Seller",
      message: "TechGear Store replied to your inquiry about product availability",
      time: "5 hours ago"
    },
    {
      id: 3,
      type: "promotion",
      title: "Flash Sale Alert",
      message: "Items in your wishlist are now on sale - up to 40% off",
      time: "1 day ago"
    },
    {
      id: 4,
      type: "system",
      title: "Account Security",
      message: "New login detected from Chrome on Windows - was this you?",
      time: "2 days ago"
    }],

    recentlyViewed: [
    {
      id: 301,
      name: "Wireless Mouse - Ergonomic Design",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_104d5d70c-1765064258284.png",
      imageAlt: "White ergonomic wireless mouse with side buttons on desk",
      price: 29.99
    },
    {
      id: 302,
      name: "USB Hub 7-Port with Power Adapter",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_131ba0a6d-1764641912026.png",
      imageAlt: "Black USB hub with multiple ports and blue LED indicators",
      price: 24.99
    },
    {
      id: 303,
      name: "Laptop Stand Aluminum Adjustable",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f9ea2001-1764658995251.png",
      imageAlt: "Silver aluminum laptop stand with MacBook on modern desk setup",
      price: 44.99
    },
    {
      id: 304,
      name: "Webcam 1080p HD with Microphone",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_14094b40a-1764673878586.png",
      imageAlt: "Black HD webcam with clip mount on laptop screen",
      price: 59.99
    }]

  };

  return (
    <>
      <Header
        userRole={mockData?.userRole}
        isAuthenticated={true}
        cartItemCount={2}
        notificationCount={4} />

      <UserDashboardInteractive initialData={mockData} />
    </>);

}