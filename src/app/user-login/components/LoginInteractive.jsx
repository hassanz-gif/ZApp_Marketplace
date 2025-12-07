'use client';

import { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import SocialLogin from './SocialLogin';
import SecurityBadges from './SecurityBadges';

export default function LoginInteractive({ mockCredentials }) {
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleLoginSubmit = (formData) => {
    setLoginAttempts(prev => prev + 1);
  };

  const handleSocialLogin = (providerId) => {
    console.log(`Social login attempted with: ${providerId}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-modal p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="6" fill="var(--color-primary)" />
                <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 8V16M16 16L24 12M16 16L8 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Sign in to access your MarketPlace Pro account</p>
          </div>

          <LoginForm onSubmit={handleLoginSubmit} />

          <div className="mt-6">
            <SocialLogin onSocialLogin={handleSocialLogin} />
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/user-registration" className="text-primary hover:text-primary/80 font-semibold transition-smooth">
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <SecurityBadges />
          </div>

          {mockCredentials && (
            <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
              <p className="text-xs font-semibold text-foreground mb-2">Demo Credentials:</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p><span className="font-medium">Buyer:</span> {mockCredentials?.buyer?.email} / {mockCredentials?.buyer?.password}</p>
                <p><span className="font-medium">Seller:</span> {mockCredentials?.seller?.email} / {mockCredentials?.seller?.password}</p>
                <p><span className="font-medium">Admin:</span> {mockCredentials?.admin?.email} / {mockCredentials?.admin?.password}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/marketplace-home" 
            className="text-sm text-muted-foreground hover:text-foreground transition-smooth inline-flex items-center space-x-1"
          >
            <span>← Back to Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

LoginInteractive.propTypes = {
  mockCredentials: PropTypes?.shape({
    buyer: PropTypes?.shape({
      email: PropTypes?.string?.isRequired,
      password: PropTypes?.string?.isRequired
    })?.isRequired,
    seller: PropTypes?.shape({
      email: PropTypes?.string?.isRequired,
      password: PropTypes?.string?.isRequired
    })?.isRequired,
    admin: PropTypes?.shape({
      email: PropTypes?.string?.isRequired,
      password: PropTypes?.string?.isRequired
    })?.isRequired
  })
};