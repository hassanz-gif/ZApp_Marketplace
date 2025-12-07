import Header from '@/components/common/Header';
import SellerDashboardInteractive from './components/SellerDashboardInteractive';

export const metadata = {
  title: 'Seller Dashboard - MarketPlace Pro',
  description: 'Manage your listings, orders, and business performance on MarketPlace Pro'
};

export default function SellerDashboard() {
  const mockData = {
    metrics: {
      totalRevenue: 45680,
      totalOrders: 234,
      activeListings: 18,
      conversionRate: 3.8
    },
    revenueData: [
    { month: 'Jul', revenue: 6500 },
    { month: 'Aug', revenue: 7200 },
    { month: 'Sep', revenue: 6800 },
    { month: 'Oct', revenue: 8100 },
    { month: 'Nov', revenue: 7900 },
    { month: 'Dec', revenue: 9180 }],

    performanceData: [
    { date: '12/01', views: 450, orders: 12 },
    { date: '12/02', views: 520, orders: 15 },
    { date: '12/03', views: 480, orders: 11 },
    { date: '12/04', views: 610, orders: 18 },
    { date: '12/05', views: 590, orders: 16 },
    { date: '12/06', views: 680, orders: 21 },
    { date: '12/07', views: 720, orders: 24 }],

    listings: [
    {
      id: 1,
      title: 'Premium Wireless Headphones',
      category: 'Electronics',
      price: 149.99,
      stock: 45,
      views: 1250,
      orders: 38,
      rating: 4.7,
      reviews: 124,
      status: 'active',
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_13e126511-1765030295691.png",
      imageAlt: 'Black wireless over-ear headphones with silver accents on white background'
    },
    {
      id: 2,
      title: 'Organic Cotton T-Shirt',
      category: 'Clothing',
      price: 29.99,
      stock: 120,
      views: 890,
      orders: 56,
      rating: 4.5,
      reviews: 89,
      status: 'active',
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e372c598-1764694740244.png",
      imageAlt: 'White organic cotton t-shirt laid flat on wooden surface'
    },
    {
      id: 3,
      title: 'Smart Fitness Watch',
      category: 'Electronics',
      price: 199.99,
      stock: 8,
      views: 2100,
      orders: 72,
      rating: 4.8,
      reviews: 156,
      status: 'active',
      image: "https://images.unsplash.com/photo-1674845476666-240fc4a86c24",
      imageAlt: 'Black smart fitness watch with digital display showing time and heart rate'
    },
    {
      id: 4,
      title: 'Leather Messenger Bag',
      category: 'Accessories',
      price: 89.99,
      stock: 0,
      views: 560,
      orders: 23,
      rating: 4.6,
      reviews: 45,
      status: 'inactive',
      image: "https://images.unsplash.com/photo-1648465234633-2322de3766ad",
      imageAlt: 'Brown leather messenger bag with brass buckles on wooden table'
    },
    {
      id: 5,
      title: 'Stainless Steel Water Bottle',
      category: 'Home & Kitchen',
      price: 24.99,
      stock: 200,
      views: 1450,
      orders: 145,
      rating: 4.9,
      reviews: 234,
      status: 'active',
      image: "https://images.unsplash.com/photo-1664714628878-9d2aa898b9e3",
      imageAlt: 'Silver stainless steel insulated water bottle with black cap'
    }],

    orders: [
    {
      id: 10234,
      customer: 'Sarah Johnson',
      items: 2,
      total: 179.98,
      status: 'pending',
      date: '12/07/2025 10:30 AM',
      shippingAddress: '123 Main St, New York, NY 10001'
    },
    {
      id: 10233,
      customer: 'Michael Chen',
      items: 1,
      total: 149.99,
      status: 'processing',
      date: '12/07/2025 09:15 AM',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90001'
    },
    {
      id: 10232,
      customer: 'Emily Rodriguez',
      items: 3,
      total: 284.97,
      status: 'shipped',
      date: '12/06/2025 04:20 PM',
      shippingAddress: '789 Pine Rd, Chicago, IL 60601'
    },
    {
      id: 10231,
      customer: 'David Kim',
      items: 1,
      total: 199.99,
      status: 'delivered',
      date: '12/05/2025 02:45 PM',
      shippingAddress: '321 Elm St, Houston, TX 77001'
    },
    {
      id: 10230,
      customer: 'Jessica Martinez',
      items: 2,
      total: 114.98,
      status: 'pending',
      date: '12/07/2025 11:00 AM',
      shippingAddress: '654 Maple Dr, Phoenix, AZ 85001'
    },
    {
      id: 10229,
      customer: 'Robert Taylor',
      items: 1,
      total: 89.99,
      status: 'processing',
      date: '12/06/2025 03:30 PM',
      shippingAddress: '987 Cedar Ln, Philadelphia, PA 19101'
    }],

    messages: [
    {
      id: 1,
      sender: 'Sarah Johnson',
      preview: 'Hi, I have a question about the shipping time for my order. When can I expect delivery?',
      time: '2 hours ago',
      orderId: 10234,
      unread: true
    },
    {
      id: 2,
      sender: 'Michael Chen',
      preview: 'Thank you for the quick response! The product looks great in the photos.',
      time: '5 hours ago',
      orderId: 10233,
      unread: true
    },
    {
      id: 3,
      sender: 'Emily Rodriguez',
      preview: 'I received my order today and everything is perfect. Thanks for the excellent service!',
      time: '1 day ago',
      orderId: 10232,
      unread: false
    },
    {
      id: 4,
      sender: 'David Kim',
      preview: 'Is it possible to get a bulk discount if I order 10 or more units?',
      time: '2 days ago',
      orderId: 10231,
      unread: false
    }]

  };

  return (
    <>
      <Header userRole="seller" isAuthenticated={true} cartItemCount={0} notificationCount={3} />
      <SellerDashboardInteractive initialData={mockData} />
    </>);

}