import Header from '@/components/common/Header';
import AdminDashboardInteractive from './components/AdminDashboardInteractive';

export const metadata = {
  title: 'Admin Dashboard - MarketPlace Pro',
  description: 'Comprehensive platform oversight enabling administrators to monitor marketplace health, manage users, and maintain system integrity effectively.'
};

export default function AdminDashboard() {
  const metricsData = [
  {
    id: 1,
    title: "Total Users",
    value: "12,458",
    change: "+12.5%",
    changeType: "positive",
    icon: "UserGroupIcon",
    iconColor: "bg-blue-500"
  },
  {
    id: 2,
    title: "Active Listings",
    value: "3,247",
    change: "+8.3%",
    changeType: "positive",
    icon: "ShoppingBagIcon",
    iconColor: "bg-green-500"
  },
  {
    id: 3,
    title: "Monthly Revenue",
    value: "$284,592",
    change: "+15.2%",
    changeType: "positive",
    icon: "CurrencyDollarIcon",
    iconColor: "bg-purple-500"
  },
  {
    id: 4,
    title: "Open Disputes",
    value: "23",
    change: "-5.4%",
    changeType: "positive",
    icon: "ExclamationTriangleIcon",
    iconColor: "bg-red-500"
  }];


  const recentActivities = [
  {
    id: 1,
    type: "user_registration",
    title: "New User Registration",
    description: "Sarah Johnson registered as a buyer",
    timestamp: "5 minutes ago"
  },
  {
    id: 2,
    type: "listing_created",
    title: "New Listing Created",
    description: "Vintage Camera Collection posted by Mike Chen",
    timestamp: "12 minutes ago"
  },
  {
    id: 3,
    type: "transaction",
    title: "Transaction Completed",
    description: "Order #12847 completed - $459.99",
    timestamp: "28 minutes ago"
  },
  {
    id: 4,
    type: "dispute",
    title: "Dispute Filed",
    description: "Order #12834 - Item not as described",
    timestamp: "1 hour ago"
  },
  {
    id: 5,
    type: "review",
    title: "New Review Posted",
    description: "5-star review for Electronics Store",
    timestamp: "2 hours ago"
  },
  {
    id: 6,
    type: "user_registration",
    title: "Seller Account Approved",
    description: "Tech Gadgets Pro verified and activated",
    timestamp: "3 hours ago"
  },
  {
    id: 7,
    type: "transaction",
    title: "High-Value Transaction",
    description: "Order #12845 completed - $2,349.00",
    timestamp: "4 hours ago"
  },
  {
    id: 8,
    type: "listing_created",
    title: "Listing Flagged for Review",
    description: "Suspicious pricing detected on item #5847",
    timestamp: "5 hours ago"
  }];


  const usersData = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_10df5a971-1765003957966.png",
    avatarAlt: "Professional woman with brown hair in business attire smiling at camera",
    role: "buyer",
    status: "active",
    joinedDate: "Dec 1, 2025"
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@email.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_122c30919-1763293878826.png",
    avatarAlt: "Asian man with glasses in casual shirt smiling outdoors",
    role: "seller",
    status: "active",
    joinedDate: "Nov 28, 2025"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19dc372df-1763294269106.png",
    avatarAlt: "Hispanic woman with long dark hair in professional attire",
    role: "buyer",
    status: "active",
    joinedDate: "Nov 25, 2025"
  },
  {
    id: 4,
    name: "David Thompson",
    email: "david.thompson@email.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a68054ef-1764690567621.png",
    avatarAlt: "Caucasian man with beard in blue shirt smiling",
    role: "seller",
    status: "pending",
    joinedDate: "Dec 5, 2025"
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    avatar: "https://images.unsplash.com/photo-1727312839549-e4611e77d5bb",
    avatarAlt: "Blonde woman in white top with friendly smile",
    role: "buyer",
    status: "suspended",
    joinedDate: "Oct 15, 2025"
  },
  {
    id: 6,
    name: "James Wilson",
    email: "james.wilson@email.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1574ea1a1-1763295992729.png",
    avatarAlt: "African American man in formal suit with confident expression",
    role: "admin",
    status: "active",
    joinedDate: "Jan 10, 2025"
  }];


  const listingsData = [
  {
    id: 1,
    title: "Vintage Canon AE-1 Camera with 50mm Lens",
    description: "Excellent condition vintage camera from 1980s. Fully functional with original leather case and manual. Perfect for film photography enthusiasts.",
    category: "Electronics > Cameras",
    price: "$349.99",
    seller: "Mike Chen",
    image: "https://images.unsplash.com/photo-1720170717112-5b985b48ab0d",
    imageAlt: "Classic vintage Canon camera with black body and silver lens on wooden surface",
    status: "pending",
    submittedDate: "Dec 7, 2025"
  },
  {
    id: 2,
    title: "Handmade Leather Messenger Bag",
    description: "Premium full-grain leather messenger bag. Hand-stitched with brass hardware. Dimensions: 15x11x4 inches. Perfect for laptop and daily essentials.",
    category: "Fashion > Bags",
    price: "$189.00",
    seller: "Artisan Crafts Co",
    image: "https://images.unsplash.com/photo-1648465234633-2322de3766ad",
    imageAlt: "Brown leather messenger bag with brass buckles on rustic wooden table",
    status: "flagged",
    submittedDate: "Dec 6, 2025",
    flagReason: "Price significantly below market average for similar items"
  },
  {
    id: 3,
    title: "Professional Gaming Setup - Complete Bundle",
    description: "High-end gaming setup including RGB mechanical keyboard, gaming mouse, mousepad, and headset stand. All items barely used, like new condition.",
    category: "Electronics > Gaming",
    price: "$299.99",
    seller: "Tech Gadgets Pro",
    image: "https://images.unsplash.com/photo-1636036764024-c6a83e8e416d",
    imageAlt: "Modern gaming desk setup with RGB keyboard, mouse, and colorful LED lights",
    status: "approved",
    submittedDate: "Dec 5, 2025"
  },
  {
    id: 4,
    title: "Antique Wooden Bookshelf - Oak Wood",
    description: "Beautiful antique bookshelf from early 1900s. Solid oak construction with intricate carvings. Some wear consistent with age. Dimensions: 72x48x12 inches.",
    category: "Home & Garden > Furniture",
    price: "$450.00",
    seller: "Vintage Finds",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f25dd3de-1764684031226.png",
    imageAlt: "Tall wooden bookshelf with ornate carvings filled with vintage books",
    status: "pending",
    submittedDate: "Dec 7, 2025"
  }];


  const disputesData = [
  {
    id: 12847,
    category: "Item Not As Described",
    complainant: "Sarah Johnson",
    respondent: "Electronics Hub",
    orderId: "ORD-2025-12847",
    description: "Received laptop with different specifications than listed. Advertisement stated 16GB RAM but received unit has only 8GB. Requesting full refund or replacement with correct specifications.",
    status: "open",
    priority: "high",
    filedDate: "Dec 7, 2025"
  },
  {
    id: 12834,
    category: "Damaged Item Received",
    complainant: "Michael Brown",
    respondent: "Home Decor Plus",
    orderId: "ORD-2025-12834",
    description: "Glass vase arrived with visible cracks despite being marked as fragile. Packaging was insufficient for the item. Photos of damage attached to case file.",
    status: "in-progress",
    priority: "medium",
    filedDate: "Dec 6, 2025"
  },
  {
    id: 12821,
    category: "Non-Delivery",
    complainant: "Emily Rodriguez",
    respondent: "Fashion Trends Store",
    orderId: "ORD-2025-12821",
    description: "Order marked as delivered but never received. Tracking shows delivery to wrong address. Seller unresponsive to messages for past 3 days.",
    status: "open",
    priority: "high",
    filedDate: "Dec 5, 2025"
  },
  {
    id: 12815,
    category: "Counterfeit Product",
    complainant: "David Lee",
    respondent: "Luxury Goods Co",
    orderId: "ORD-2025-12815",
    description: "Purchased designer watch that appears to be counterfeit. Serial number does not match manufacturer records. Requesting investigation and full refund.",
    status: "in-progress",
    priority: "high",
    filedDate: "Dec 4, 2025"
  },
  {
    id: 12808,
    category: "Refund Not Processed",
    complainant: "Jessica Martinez",
    respondent: "Tech Solutions",
    orderId: "ORD-2025-12808",
    description: "Returned item 10 days ago with tracking confirmation but refund still not processed. Seller confirmed receipt but claims processing delay.",
    status: "resolved",
    priority: "medium",
    filedDate: "Dec 3, 2025"
  }];


  const analyticsData = {
    userGrowth: [
    { name: "Jan", value: 8500 },
    { name: "Feb", value: 9200 },
    { name: "Mar", value: 9800 },
    { name: "Apr", value: 10200 },
    { name: "May", value: 10800 },
    { name: "Jun", value: 11200 },
    { name: "Jul", value: 11600 },
    { name: "Aug", value: 11900 },
    { name: "Sep", value: 12100 },
    { name: "Oct", value: 12300 },
    { name: "Nov", value: 12400 },
    { name: "Dec", value: 12458 }],

    revenueByMonth: [
    { name: "Jan", value: 185000 },
    { name: "Feb", value: 198000 },
    { name: "Mar", value: 215000 },
    { name: "Apr", value: 228000 },
    { name: "May", value: 242000 },
    { name: "Jun", value: 255000 },
    { name: "Jul", value: 248000 },
    { name: "Aug", value: 262000 },
    { name: "Sep", value: 271000 },
    { name: "Oct", value: 278000 },
    { name: "Nov", value: 282000 },
    { name: "Dec", value: 284592 }],

    transactionVolume: [
    { name: "Jan", value: 1250 },
    { name: "Feb", value: 1380 },
    { name: "Mar", value: 1520 },
    { name: "Apr", value: 1640 },
    { name: "May", value: 1780 },
    { name: "Jun", value: 1850 },
    { name: "Jul", value: 1920 },
    { name: "Aug", value: 2050 },
    { name: "Sep", value: 2180 },
    { name: "Oct", value: 2280 },
    { name: "Nov", value: 2350 },
    { name: "Dec", value: 2420 }],

    categoryDistribution: [
    { name: "Electronics", value: 1245 },
    { name: "Fashion", value: 892 },
    { name: "Home & Garden", value: 654 },
    { name: "Sports", value: 456 },
    { name: "Books", value: 378 },
    { name: "Toys", value: 312 },
    { name: "Automotive", value: 289 },
    { name: "Other", value: 521 }]

  };

  return (
    <>
      <Header userRole="admin" isAuthenticated={true} cartItemCount={0} notificationCount={5} />
      <div className="pt-[60px]">
        <AdminDashboardInteractive
          metricsData={metricsData}
          recentActivities={recentActivities}
          usersData={usersData}
          listingsData={listingsData}
          disputesData={disputesData}
          analyticsData={analyticsData} />

      </div>
    </>);

}