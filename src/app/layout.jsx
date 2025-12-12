import '../styles/index.css';
import AuthProviderWrapper from '@/components/providers/AuthProviderWrapper';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'ZApp - Your Marketplace',
  description: 'ZApp - Your one-stop marketplace for everything you need',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
