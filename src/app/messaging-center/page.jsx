import Header from '@/components/common/Header';
import MessagingInteractive from './components/MessagingInteractive';

export const metadata = {
  title: 'Messaging Center - ZApp',
  description: 'Secure communication between buyers and sellers with real-time chat capabilities and comprehensive conversation management'
};

export default function MessagingCenterPage() {
  const mockConversations = [
  {
    id: 'conv-1',
    name: 'Sarah Johnson',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_10df5a971-1765003957966.png",
    altText: 'Professional woman with brown hair in business attire smiling at camera',
    lastMessage: 'Thanks for the quick response! When can you ship?',
    timestamp: '2025-12-07T16:45:00.000Z',
    unreadCount: 2,
    isOnline: true,
    isArchived: false,
    orderReference: '12345',
    lastSeen: '2 minutes ago'
  },
  {
    id: 'conv-2',
    name: 'Michael Chen',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1032f2f96-1763294555184.png",
    altText: 'Asian man with glasses and casual shirt in outdoor setting',
    lastMessage: 'Is the product still available?',
    timestamp: '2025-12-07T15:30:00.000Z',
    unreadCount: 0,
    isOnline: false,
    isArchived: false,
    orderReference: null,
    lastSeen: '1 hour ago'
  },
  {
    id: 'conv-3',
    name: 'Emma Williams',
    avatar: "https://images.unsplash.com/photo-1597094622619-5c94ac083578",
    altText: 'Young woman with long dark hair wearing white top outdoors',
    lastMessage: 'Perfect! I will place the order today.',
    timestamp: '2025-12-07T14:20:00.000Z',
    unreadCount: 0,
    isOnline: true,
    isArchived: false,
    orderReference: '12346',
    lastSeen: 'Active now'
  },
  {
    id: 'conv-4',
    name: 'David Martinez',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_16105ed6d-1763296582884.png",
    altText: 'Hispanic man in blue shirt smiling in professional headshot',
    lastMessage: 'Can you provide more details about shipping?',
    timestamp: '2025-12-07T12:15:00.000Z',
    unreadCount: 1,
    isOnline: false,
    isArchived: false,
    orderReference: null,
    lastSeen: '3 hours ago'
  },
  {
    id: 'conv-5',
    name: 'Lisa Anderson',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_117fb6100-1764990439709.png",
    altText: 'Blonde woman in casual attire with natural lighting',
    lastMessage: 'Thank you for the excellent service!',
    timestamp: '2025-12-06T18:30:00.000Z',
    unreadCount: 0,
    isOnline: false,
    isArchived: false,
    orderReference: '12347',
    lastSeen: 'Yesterday'
  }];


  const mockMessages = {
    'conv-1': [
    {
      id: 'msg-1',
      senderId: 'conv-1',
      type: 'text',
      content: 'Hi! I am interested in the Wireless Bluetooth Headphones.',
      timestamp: '2025-12-07T16:30:00.000Z',
      status: 'read'
    },
    {
      id: 'msg-2',
      senderId: 'current-user',
      type: 'text',
      content: 'Hello! Thank you for your interest. They are available and in excellent condition.',
      timestamp: '2025-12-07T16:32:00.000Z',
      status: 'read'
    },
    {
      id: 'msg-3',
      senderId: 'conv-1',
      type: 'order',
      content: 'Can you tell me more about this product?',
      orderId: '12345',
      orderTitle: 'Wireless Bluetooth Headphones',
      orderAmount: '89.99',
      timestamp: '2025-12-07T16:35:00.000Z',
      status: 'read'
    },
    {
      id: 'msg-4',
      senderId: 'current-user',
      type: 'text',
      content: 'Sure! These headphones feature active noise cancellation, 30-hour battery life, and premium sound quality. They come with a carrying case and all original accessories.',
      timestamp: '2025-12-07T16:38:00.000Z',
      status: 'read'
    },
    {
      id: 'msg-5',
      senderId: 'conv-1',
      type: 'text',
      content: 'Thanks for the quick response! When can you ship?',
      timestamp: '2025-12-07T16:45:00.000Z',
      status: 'delivered'
    }],

    'conv-2': [
    {
      id: 'msg-6',
      senderId: 'conv-2',
      type: 'text',
      content: 'Hello, I saw your listing for the laptop.',
      timestamp: '2025-12-07T15:20:00.000Z',
      status: 'read'
    },
    {
      id: 'msg-7',
      senderId: 'current-user',
      type: 'text',
      content: 'Hi! Yes, it is still available. What would you like to know?',
      timestamp: '2025-12-07T15:25:00.000Z',
      status: 'read'
    },
    {
      id: 'msg-8',
      senderId: 'conv-2',
      type: 'text',
      content: 'Is the product still available?',
      timestamp: '2025-12-07T15:30:00.000Z',
      status: 'read'
    }],

    'conv-3': [
    {
      id: 'msg-9',
      senderId: 'conv-3',
      type: 'text',
      content: 'Hi! I would like to purchase the camera lens.',
      timestamp: '2025-12-07T14:10:00.000Z',
      status: 'read'
    },
    {
      id: 'msg-10',
      senderId: 'current-user',
      type: 'image',
      content: 'Here are some additional photos of the lens condition.',
      imageUrl: "https://images.unsplash.com/photo-1638503387695-654324bdc8d9",
      imageAlt: 'Professional camera lens with black body on white surface showing optical elements',
      timestamp: '2025-12-07T14:15:00.000Z',
      status: 'read'
    },
    {
      id: 'msg-11',
      senderId: 'conv-3',
      type: 'text',
      content: 'Perfect! I will place the order today.',
      timestamp: '2025-12-07T14:20:00.000Z',
      status: 'read'
    }]

  };

  return (
    <>
      <Header    notificationCount={2} />
      <main className="pt-[60px]">
        <MessagingInteractive
          initialConversations={mockConversations}
          initialMessages={mockMessages} />

      </main>
    </>);

}