import Header from '@/components/common/Header';
import ShoppingCartInteractive from './components/ShoppingCartInteractive';

export const metadata = {
  title: 'Shopping Cart - MarketPlace Pro',
  description: 'Review and manage your cart items before checkout with secure payment options and fast shipping.'
};

export default function ShoppingCartPage() {
  const mockCartItems = [
  {
    id: "cart-1",
    name: "Premium Wireless Headphones with Active Noise Cancellation",
    price: 199.99,
    quantity: 1,
    stock: 15,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_13e126511-1765030295691.png",
    imageAlt: "Black wireless over-ear headphones with silver accents on white background",
    sellerId: "seller-1",
    sellerName: "TechGear Pro",
    sellerVerified: true,
    variant: "Midnight Black",
    estimatedDelivery: "Dec 12-14, 2025"
  },
  {
    id: "cart-2",
    name: "Organic Cotton T-Shirt - Unisex Crew Neck",
    price: 29.99,
    quantity: 2,
    stock: 8,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_19fe7ad69-1764712498074.png",
    imageAlt: "White cotton crew neck t-shirt laid flat on wooden surface",
    sellerId: "seller-2",
    sellerName: "EcoWear Fashion",
    sellerVerified: true,
    variant: "White - Size M",
    estimatedDelivery: "Dec 10-12, 2025"
  },
  {
    id: "cart-3",
    name: "Stainless Steel Water Bottle - 32oz Insulated",
    price: 34.99,
    quantity: 1,
    stock: 25,
    image: "https://images.unsplash.com/photo-1657053213307-05c602af793a",
    imageAlt: "Blue insulated stainless steel water bottle with black lid on outdoor background",
    sellerId: "seller-3",
    sellerName: "HydroLife",
    sellerVerified: false,
    variant: "Ocean Blue",
    estimatedDelivery: "Dec 13-15, 2025"
  }];


  const mockSavedItems = [
  {
    id: "saved-1",
    name: "Leather Laptop Messenger Bag",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1648465234633-2322de3766ad",
    imageAlt: "Brown leather messenger bag with brass buckles on wooden table"
  },
  {
    id: "saved-2",
    name: "Smart Fitness Watch with Heart Rate Monitor",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1523475341152-7d478c4d6875",
    imageAlt: "Black smartwatch displaying fitness metrics on wrist with athletic wear"
  }];


  const mockRecommendedProducts = [
  {
    id: "rec-1",
    name: "Wireless Charging Pad",
    price: 24.99,
    rating: 4.5,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c664a820-1764670565959.png",
    imageAlt: "White circular wireless charging pad with smartphone on modern desk"
  },
  {
    id: "rec-2",
    name: "USB-C Cable 6ft",
    price: 12.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1708922692309-50a25e76ee99",
    imageAlt: "Black braided USB-C charging cable coiled on white surface"
  },
  {
    id: "rec-3",
    name: "Phone Case - Clear",
    price: 19.99,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1605000977407-2771f2f8e908",
    imageAlt: "Transparent protective phone case showing device design underneath"
  }];


  return (
    <div className="min-h-screen bg-background">
      <Header userRole="buyer" isAuthenticated={true} cartItemCount={4} notificationCount={2} />
      
      <main className="pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              Review your items and proceed to checkout when ready
            </p>
          </div>

          {/* Cart Content */}
          <ShoppingCartInteractive
            initialCartItems={mockCartItems}
            initialSavedItems={mockSavedItems}
            recommendedProducts={mockRecommendedProducts} />

        </div>
      </main>
    </div>);

}