import LoginInteractive from './components/LoginInteractive';

export const metadata = {
  title: 'Sign In - ZApp',
  description: 'Sign in to your ZApp account to access your dashboard, manage orders, and connect with sellers.',
};

export default function UserLoginPage() {
  const mockCredentials = {
    buyer: {
      email: 'buyer@marketplace.com',
      password: 'buyer123'
    },
    seller: {
      email: 'seller@marketplace.com',
      password: 'seller123'
    },
    admin: {
      email: 'admin@marketplace.com',
      password: 'admin123'
    }
  };

  return <LoginInteractive mockCredentials={mockCredentials} />;
}