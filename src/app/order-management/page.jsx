import Header from '@/components/common/Header';
import OrderManagementInteractive from './components/OrderManagementInteractive';

export const metadata = {
  title: 'Order Management - ZApp',
  description: 'Track, manage, and review your marketplace orders with comprehensive order lifecycle visibility and transaction management tools.'
};

export default function OrderManagementPage() {
  const mockOrders = [
  {
    id: "ORD001",
    orderNumber: "MP2025-001234",
    orderDate: "12/05/2025",
    status: "delivered",
    total: 299.97,
    items: [
    {
      id: "ITEM001",
      name: "Wireless Bluetooth Headphones with Active Noise Cancellation",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_13e126511-1765030295691.png",
      alt: "Black wireless over-ear headphones with silver accents on white background",
      seller: "TechGear Store",
      quantity: 1,
      price: 149.99
    },
    {
      id: "ITEM002",
      name: "Premium Leather Laptop Bag - 15 inch",
      image: "https://images.unsplash.com/photo-1679038138004-4162c92209e9",
      alt: "Brown leather messenger bag with brass buckles and adjustable strap",
      seller: "Luxury Accessories Co",
      quantity: 1,
      price: 89.99
    },
    {
      id: "ITEM003",
      name: "Stainless Steel Water Bottle - 32oz",
      image: "https://images.unsplash.com/photo-1597685866437-1116da6f4046",
      alt: "Matte black insulated water bottle with screw-top lid",
      seller: "EcoLife Products",
      quantity: 2,
      price: 29.99
    }],

    shippingAddress: "123 Main Street, Apartment 4B, New York, NY 10001",
    paymentMethod: "Visa ending in 4242",
    trackingNumber: "1Z999AA10123456784",
    estimatedDelivery: "Delivered on 12/03/2025",
    returnEligible: true
  },
  {
    id: "ORD002",
    orderNumber: "MP2025-001235",
    orderDate: "12/04/2025",
    status: "shipped",
    total: 459.98,
    items: [
    {
      id: "ITEM004",
      name: "Smart Watch Series 7 - GPS + Cellular",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c62cab06-1764998842930.png",
      alt: "Silver smartwatch with blue sport band displaying fitness metrics",
      seller: "Digital Wearables Hub",
      quantity: 1,
      price: 399.99
    },
    {
      id: "ITEM005",
      name: "Wireless Charging Pad - Fast Charge",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c664a820-1764670565959.png",
      alt: "White circular wireless charging pad with LED indicator light",
      seller: "TechGear Store",
      quantity: 2,
      price: 29.99
    }],

    shippingAddress: "123 Main Street, Apartment 4B, New York, NY 10001",
    paymentMethod: "Mastercard ending in 8888",
    trackingNumber: "1Z999AA10123456785",
    estimatedDelivery: "Expected by 12/08/2025",
    returnEligible: false
  },
  {
    id: "ORD003",
    orderNumber: "MP2025-001236",
    orderDate: "12/02/2025",
    status: "processing",
    total: 1299.99,
    items: [
    {
      id: "ITEM006",
      name: "4K Ultra HD Smart TV - 55 inch",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_11652f0de-1764656705832.png",
      alt: "Large flat screen television displaying vibrant nature scene",
      seller: "Home Electronics Plus",
      quantity: 1,
      price: 1299.99
    }],

    shippingAddress: "123 Main Street, Apartment 4B, New York, NY 10001",
    paymentMethod: "Visa ending in 4242",
    trackingNumber: null,
    estimatedDelivery: "Expected by 12/10/2025",
    returnEligible: false
  },
  {
    id: "ORD004",
    orderNumber: "MP2025-001237",
    orderDate: "11/28/2025",
    status: "delivered",
    total: 179.97,
    items: [
    {
      id: "ITEM007",
      name: "Organic Cotton Bed Sheet Set - Queen Size",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_195939aee-1764715129299.png",
      alt: "White cotton bedding set with decorative pillows on modern bed",
      seller: "Home Comfort Essentials",
      quantity: 1,
      price: 89.99
    },
    {
      id: "ITEM008",
      name: "Memory Foam Pillow - Set of 2",
      image: "https://images.unsplash.com/photo-1661375519253-933bd56a0b2d",
      alt: "Two white memory foam pillows with breathable mesh covers",
      seller: "Sleep Well Store",
      quantity: 1,
      price: 89.98
    }],

    shippingAddress: "123 Main Street, Apartment 4B, New York, NY 10001",
    paymentMethod: "PayPal",
    trackingNumber: "1Z999AA10123456786",
    estimatedDelivery: "Delivered on 11/30/2025",
    returnEligible: true
  },
  {
    id: "ORD005",
    orderNumber: "MP2025-001238",
    orderDate: "11/25/2025",
    status: "pending",
    total: 549.99,
    items: [
    {
      id: "ITEM009",
      name: "Professional DSLR Camera with 18-55mm Lens",
      image: "https://images.unsplash.com/photo-1548348914-1596523128e4",
      alt: "Black DSLR camera with attached zoom lens on wooden surface",
      seller: "Photography Pro Shop",
      quantity: 1,
      price: 549.99
    }],

    shippingAddress: "123 Main Street, Apartment 4B, New York, NY 10001",
    paymentMethod: "Visa ending in 4242",
    trackingNumber: null,
    estimatedDelivery: "Processing - Expected by 12/12/2025",
    returnEligible: false
  },
  {
    id: "ORD006",
    orderNumber: "MP2025-001239",
    orderDate: "11/20/2025",
    status: "delivered",
    total: 89.99,
    items: [
    {
      id: "ITEM010",
      name: "Yoga Mat with Carrying Strap - Extra Thick",
      image: "https://images.unsplash.com/photo-1567281105305-11c3e4ace86b",
      alt: "Purple rolled yoga mat with black carrying strap on wooden floor",
      seller: "Fitness Lifestyle",
      quantity: 1,
      price: 49.99
    },
    {
      id: "ITEM011",
      name: "Resistance Bands Set - 5 Levels",
      image: "https://images.unsplash.com/photo-1585942778436-2e13373303d8",
      alt: "Colorful resistance bands in various strengths arranged in a row",
      seller: "Fitness Lifestyle",
      quantity: 1,
      price: 39.99
    }],

    shippingAddress: "123 Main Street, Apartment 4B, New York, NY 10001",
    paymentMethod: "Mastercard ending in 8888",
    trackingNumber: "1Z999AA10123456787",
    estimatedDelivery: "Delivered on 11/23/2025",
    returnEligible: true
  },
  {
    id: "ORD007",
    orderNumber: "MP2025-001240",
    orderDate: "11/15/2025",
    status: "cancelled",
    total: 199.99,
    items: [
    {
      id: "ITEM012",
      name: "Gaming Keyboard - RGB Mechanical",
      image: "https://images.unsplash.com/photo-1672211775632-bcb4b68eb2bd",
      alt: "Black mechanical gaming keyboard with colorful RGB backlighting",
      seller: "Gaming Gear Central",
      quantity: 1,
      price: 199.99
    }],

    shippingAddress: "123 Main Street, Apartment 4B, New York, NY 10001",
    paymentMethod: "Visa ending in 4242",
    trackingNumber: null,
    estimatedDelivery: "Cancelled on 11/16/2025",
    returnEligible: false
  }];


  const mockStats = {
    totalOrders: 45,
    inProgress: 20,
    delivered: 22,
    totalSpent: 4567.89
  };

  return (
    <>
      <Header    notificationCount={2} />
      <OrderManagementInteractive
        initialOrders={mockOrders}
        initialStats={mockStats} />

    </>);

}