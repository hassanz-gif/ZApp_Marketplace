import { Suspense } from 'react';
import Header from '@/components/common/Header';
import ProductDetailsInteractive from './components/ProductDetailsInteractive';

export const metadata = {
  title: 'Product Details - ZApp',
  description: 'View detailed product information, specifications, reviews, and make informed purchase decisions on ZApp'
};

function ProductDetailsContent({ mockProductData }) {
  return (
    <div className="pt-[60px]">
      <ProductDetailsInteractive productData={mockProductData} />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="pt-[60px] min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

export default function ProductDetailsPage() {
  const mockProductData = {
    product: {
      title: "Premium Wireless Bluetooth Headphones with Active Noise Cancellation",
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.7,
      reviewCount: 2847,
      soldCount: 15234,
      stock: 47,
      freeShipping: true,
      category: "Electronics",
      variants: [
      { id: 1, name: "Black" },
      { id: 2, name: "Silver" },
      { id: 3, name: "Rose Gold" }],

      variantType: "Color",
      features: [
      "Active Noise Cancellation (ANC) technology blocks external sounds",
      "40-hour battery life with quick charge support (10 min = 5 hours)",
      "Premium memory foam ear cushions for all-day comfort",
      "Bluetooth 5.2 with multi-device connectivity",
      "Built-in microphone with crystal-clear call quality",
      "Foldable design with premium carrying case included",
      "Touch controls for music, calls, and voice assistant",
      "Compatible with iOS, Android, and all Bluetooth devices"]

    },
    seller: {
      name: "TechGear Official Store",
      verified: true,
      rating: 4.8,
      responseRate: 98,
      responseTime: "2 hours"
    },
    images: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1119295e3-1765076790006.png",
      alt: "Black wireless headphones with active noise cancellation on white background front view"
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_169e48f2c-1764795501663.png",
      alt: "Side profile of premium wireless headphones showing cushioned ear cups"
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1581a3095-1764745941985.png",
      alt: "Wireless headphones folded in compact carrying case"
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1b3a7c763-1764882857273.png",
      alt: "Close-up of headphone controls and touch panel"
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_10e153dc6-1764693532822.png",
      alt: "Wireless headphones being worn showing comfortable fit"
    }],

    details: {
      description: `Experience premium audio quality with our flagship wireless headphones featuring industry-leading Active Noise Cancellation technology. Designed for audiophiles and everyday users alike, these headphones deliver exceptional sound clarity across all frequencies.\n\nThe advanced ANC system uses multiple microphones to detect and cancel ambient noise, creating your personal sound sanctuary whether you're commuting, working, or relaxing. Switch to Transparency mode when you need to stay aware of your surroundings.\n\nWith an impressive 40-hour battery life, these headphones keep up with your longest days. The quick charge feature provides 5 hours of playback from just 10 minutes of charging. Premium memory foam ear cushions ensure all-day comfort, while the adjustable headband fits all head sizes perfectly.\n\nBluetooth 5.2 technology ensures stable connectivity up to 30 feet, and multi-device pairing lets you seamlessly switch between your phone, tablet, and laptop. The built-in microphone with noise reduction delivers crystal-clear calls even in noisy environments.\n\nIntuitive touch controls on the ear cups let you play, pause, skip tracks, adjust volume, and activate your voice assistant without reaching for your device. The foldable design and included premium carrying case make these headphones perfect for travel.`,
      specifications: [
      { label: "Driver Size", value: "40mm dynamic drivers" },
      { label: "Frequency Response", value: "20Hz - 20kHz" },
      { label: "Impedance", value: "32 Ohms" },
      { label: "Bluetooth Version", value: "5.2" },
      { label: "Bluetooth Range", value: "Up to 30 feet (10 meters)" },
      { label: "Battery Life", value: "40 hours (ANC on), 50 hours (ANC off)" },
      { label: "Charging Time", value: "2 hours (full charge)" },
      { label: "Quick Charge", value: "10 min = 5 hours playback" },
      { label: "Weight", value: "250 grams" },
      { label: "Dimensions (Folded)", value: "7.5 x 6.5 x 3 inches" },
      { label: "Included Accessories", value: "USB-C cable, 3.5mm audio cable, carrying case, user manual" },
      { label: "Warranty", value: "2 years manufacturer warranty" }],

      shipping: {
        standard: "Free standard shipping (5-7 business days). Orders placed before 2 PM EST ship same day.",
        express: "Express shipping available for $9.99 (2-3 business days). Guaranteed delivery or your money back.",
        international: "International shipping available to 150+ countries. Delivery time varies by location (7-21 business days). Customs fees may apply."
      },
      returns: {
        window: "30-day hassle-free return policy. Return for any reason within 30 days of delivery for a full refund.",
        conditions: "Items must be in original condition with all accessories and packaging. Product must not show signs of wear or damage. Return shipping is free for defective items.",
        refund: "Refunds processed within 3-5 business days after we receive your return. Original payment method will be credited. Exchanges available for different colors or sizes."
      }
    },
    reviews: {
      totalReviews: 2847,
      breakdown: [
      { stars: 5, percentage: 68 },
      { stars: 4, percentage: 20 },
      { stars: 3, percentage: 7 },
      { stars: 2, percentage: 3 },
      { stars: 1, percentage: 2 }],

      list: [
      {
        id: 1,
        userName: "Sarah Mitchell",
        userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_10df5a971-1765003957966.png",
        userAvatarAlt: "Professional woman with brown hair in business attire smiling",
        rating: 5,
        date: "December 5, 2025",
        verified: true,
        variant: "Black",
        comment: "Absolutely love these headphones! The noise cancellation is incredible - I use them daily for my commute and they block out all the subway noise. Battery life is exactly as advertised, and the sound quality is phenomenal. The comfort level is outstanding even after wearing them for 8+ hours. Best purchase I've made this year!",
        helpful: 234,
        images: [
        {
          url: "https://images.unsplash.com/photo-1638532557756-f7ff701ddb8b", alt: "User photo showing headphones in use"
        }]

      },
      {
        id: 2,
        userName: "Michael Chen", userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_122c30919-1763293878826.png", userAvatarAlt: "Asian man with glasses in casual shirt smiling outdoors", rating: 5, date: "December 3, 2025",
        verified: true,
        variant: "Silver", comment: "As an audio engineer, I'm very picky about sound quality. These headphones exceeded my expectations. The frequency response is balanced, bass is punchy without being overwhelming, and the mids and highs are crystal clear. ANC works flawlessly. Highly recommend for both casual listening and professional use.",
        helpful: 189,
        images: []
      },
      {
        id: 3,
        userName: "Emily Rodriguez",
        userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17c0179e8-1763295822377.png",
        userAvatarAlt: "Hispanic woman with long dark hair in white top smiling",
        rating: 4,
        date: "November 30, 2025",
        verified: true,
        variant: "Rose Gold",
        comment: "Great headphones overall! Sound quality is excellent and the noise cancellation works really well. Only giving 4 stars because the touch controls can be a bit sensitive sometimes - I accidentally pause music when adjusting them. But that\'s a minor issue compared to all the positives. Would definitely buy again.",
        helpful: 156,
        images: []
      },
      {
        id: 4,
        userName: "David Thompson",
        userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a68054ef-1764690567621.png",
        userAvatarAlt: "Caucasian man with beard in blue shirt outdoors",
        rating: 5,
        date: "November 28, 2025",
        verified: true,
        variant: "Black",
        comment: "Perfect for working from home! The ANC blocks out all household noise, and the comfort is unmatched. I wear these for 6-8 hours daily during video calls and never experience any discomfort. The microphone quality is excellent - colleagues say I sound crystal clear. Battery life is insane - I only charge them once a week!",
        helpful: 142,
        images: []
      },
      {
        id: 5,
        userName: "Jessica Park",
        userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1942f84c5-1763299419465.png",
        userAvatarAlt: "Asian woman with short black hair in red sweater smiling",
        rating: 5,
        date: "November 25, 2025",
        verified: true,
        variant: "Rose Gold",
        comment: "These headphones are worth every penny! The build quality feels premium, the case is sturdy, and the rose gold color is gorgeous. Sound quality is amazing for all music genres. The quick charge feature is a lifesaver when I forget to charge them overnight. Customer service was also excellent when I had a question about pairing.",
        helpful: 128,
        images: [
        {
          url: "https://images.unsplash.com/photo-1618213520536-ce37aabcd9e5",
          alt: "User photo showing rose gold headphones with case"
        }]

      },
      {
        id: 6,
        userName: "Robert Anderson",
        userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1577af203-1764932649558.png",
        userAvatarAlt: "Middle-aged man with gray hair in black shirt",
        rating: 4,
        date: "November 22, 2025",
        verified: false,
        variant: "Silver",
        comment: "Very good headphones for the price. Sound is clear, ANC works well, and they're comfortable. The only reason I'm not giving 5 stars is because I wish the carrying case was a bit more compact for travel. Otherwise, no complaints!",
        helpful: 95,
        images: []
      }]

    },
    relatedProducts: [
    {
      id: 1,
      title: "Wireless Earbuds Pro with Charging Case", image: "https://images.unsplash.com/photo-1722040456443-c644d014d43f", imageAlt: "White wireless earbuds in open charging case on marble surface",
      price: 89.99,
      originalPrice: 129.99,
      discount: 31,
      rating: 4.6,
      reviews: 1523
    },
    {
      id: 2,
      title: "Premium USB-C to 3.5mm Audio Adapter", image: "https://images.unsplash.com/photo-1688864606835-219d43661fcb", imageAlt: "Black USB-C audio adapter cable on white background",
      price: 19.99,
      rating: 4.4,
      reviews: 892
    },
    {
      id: 3,
      title: "Portable Bluetooth Speaker Waterproof", image: "https://img.rocket.new/generatedImages/rocket_gen_img_1aae88582-1764660840888.png", imageAlt: "Cylindrical black bluetooth speaker with mesh grille",
      price: 59.99,
      originalPrice: 79.99,
      discount: 25,
      rating: 4.5,
      reviews: 2341
    },
    {
      id: 4,
      title: "Wireless Charging Pad Fast Charge", image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c664a820-1764670565959.png", imageAlt: "Round black wireless charging pad with LED indicator",
      price: 29.99,
      rating: 4.3,
      reviews: 756
    },
    {
      id: 5,
      title: "Premium Headphone Stand Aluminum", image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f9ea2001-1764658995251.png", imageAlt: "Silver aluminum headphone stand with curved design",
      price: 34.99,
      rating: 4.7,
      reviews: 445
    },
    {
      id: 6,
      title: "Noise Cancelling Earbuds Sport Edition", image: "https://img.rocket.new/generatedImages/rocket_gen_img_1184ffd99-1764645391633.png", imageAlt: "Black sport earbuds with ear hooks in charging case",
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
      rating: 4.5,
      reviews: 1876
    },
    {
      id: 7,
      title: "Bluetooth Audio Transmitter Receiver", image: "https://images.unsplash.com/photo-1735041477758-62d76707ea42", imageAlt: "Small black bluetooth transmitter device with buttons",
      price: 24.99,
      rating: 4.2,
      reviews: 623
    },
    {
      id: 8,
      title: "Over-Ear Gaming Headset RGB Lighting", image: "https://images.unsplash.com/photo-1586837033998-87881d891d49", imageAlt: "Black gaming headset with colorful RGB lighting effects",
      price: 119.99,
      originalPrice: 159.99,
      discount: 25,
      rating: 4.6,
      reviews: 3421
    }]

  };

  return (
    <>
      <Header notificationCount={5} />
      <Suspense fallback={<LoadingFallback />}>
        <ProductDetailsContent mockProductData={mockProductData} />
      </Suspense>
    </>
  );
}