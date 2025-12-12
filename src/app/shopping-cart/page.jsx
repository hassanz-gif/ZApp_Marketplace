import Header from '@/components/common/Header';
import ShoppingCartInteractive from './components/ShoppingCartInteractive';

export const metadata = {
  title: 'Shopping Cart - ZApp',
  description: 'Review and manage your cart items before checkout with secure payment options and fast shipping.'
};

export default function ShoppingCartPage() {
  const recommendedProducts = [
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
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header notificationCount={2} />

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
          <ShoppingCartInteractive recommendedProducts={recommendedProducts} />
        </div>
      </main>
    </div>
  );
}