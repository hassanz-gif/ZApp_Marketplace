import Header from '@/components/common/Header';
import CheckoutInteractive from './components/CheckoutInteractive';

export const metadata = {
  title: 'Checkout - ZApp',
  description: 'Complete your purchase securely with our streamlined checkout process'
};

export default function CheckoutProcessPage() {
  const mockData = {
    cartItems: [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      price: 79.99,
      quantity: 1,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_13e126511-1765030295691.png",
      alt: 'Black wireless over-ear headphones with silver accents on white background'
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      price: 199.99,
      quantity: 1,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1dd51548c-1764641911784.png",
      alt: 'Modern black smartwatch with digital display showing fitness metrics'
    },
    {
      id: '3',
      name: 'Portable Phone Charger',
      price: 29.99,
      quantity: 2,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1767e7570-1765107318893.png",
      alt: 'Compact white portable battery charger with USB ports'
    }],

    savedAddresses: [
    {
      id: 'addr_1',
      fullName: 'John Doe',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '(555) 123-4567',
      isDefault: true
    },
    {
      id: 'addr_2',
      fullName: 'John Doe',
      addressLine1: '456 Oak Avenue',
      addressLine2: '',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      country: 'United States',
      phone: '(555) 987-6543',
      isDefault: false
    }],

    deliveryOptions: [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Delivery in 5-7 business days',
      estimatedDelivery: 'Dec 14 - Dec 18',
      price: 0,
      icon: 'TruckIcon'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Delivery in 2-3 business days',
      estimatedDelivery: 'Dec 10 - Dec 12',
      price: 9.99,
      icon: 'BoltIcon'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day delivery',
      estimatedDelivery: 'Dec 8',
      price: 24.99,
      icon: 'RocketLaunchIcon'
    }],

    savedPaymentMethods: [
    {
      id: 'pm_1',
      type: 'Visa',
      lastFour: '4242',
      expiry: '12/25'
    },
    {
      id: 'pm_2',
      type: 'Mastercard',
      lastFour: '5555',
      expiry: '08/26'
    }]

  };

  return (
    <>
      <Header   cartItemCount={3} notificationCount={2} />
      <div className="pt-[60px]">
        <CheckoutInteractive initialData={mockData} />
      </div>
    </>);

}