import Header from '@/components/common/Header';
import RegistrationInteractive from './components/RegistrationInteractive';

export const metadata = {
  title: 'Create Account - MarketPlace Pro',
  description: 'Join MarketPlace Pro and start buying or selling products. Create your account as a buyer, seller, or both with our simple registration process.',
};

export default function UserRegistrationPage() {
  return (
    <>
      <Header isAuthenticated={false} />
      <RegistrationInteractive />
    </>
  );
}