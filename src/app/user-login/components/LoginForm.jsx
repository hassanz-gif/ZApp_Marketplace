'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function LoginForm({ onSubmit }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockCredentials = {
        buyer: { email: 'buyer@marketplace.com', password: 'buyer123' },
        seller: { email: 'seller@marketplace.com', password: 'seller123' },
        admin: { email: 'admin@marketplace.com', password: 'admin123' }
      };

      let userRole = null;
      let isValid = false;

      if (formData?.email === mockCredentials?.buyer?.email && formData?.password === mockCredentials?.buyer?.password) {
        userRole = 'buyer';
        isValid = true;
      } else if (formData?.email === mockCredentials?.seller?.email && formData?.password === mockCredentials?.seller?.password) {
        userRole = 'seller';
        isValid = true;
      } else if (formData?.email === mockCredentials?.admin?.email && formData?.password === mockCredentials?.admin?.password) {
        userRole = 'admin';
        isValid = true;
      }

      if (isValid) {
        if (formData?.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        if (onSubmit) {
          onSubmit({ ...formData, role: userRole });
        }

        if (userRole === 'admin') {
          router?.push('/admin-dashboard');
        } else if (userRole === 'seller') {
          router?.push('/seller-dashboard');
        } else {
          router?.push('/user-dashboard');
        }
      } else {
        setErrors({ 
          submit: 'Invalid email or password. Please check your credentials and try again.' 
        });
      }
    } catch (error) {
      setErrors({ 
        submit: 'An error occurred during login. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {errors?.submit && (
        <div className="p-4 bg-error/10 border border-error rounded-lg flex items-start space-x-3">
          <Icon name="ExclamationCircleIcon" size={20} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{errors?.submit}</p>
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData?.email}
            onChange={handleChange}
            className={`w-full h-12 pl-11 pr-4 text-sm bg-surface border ${
              errors?.email ? 'border-error' : 'border-input'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth`}
            placeholder="Enter your email"
            disabled={isLoading}
          />
          <Icon 
            name="EnvelopeIcon" 
            size={20} 
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              errors?.email ? 'text-error' : 'text-muted-foreground'
            }`}
          />
        </div>
        {errors?.email && (
          <p className="mt-1.5 text-sm text-error flex items-center space-x-1">
            <Icon name="ExclamationCircleIcon" size={16} />
            <span>{errors?.email}</span>
          </p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData?.password}
            onChange={handleChange}
            className={`w-full h-12 pl-11 pr-12 text-sm bg-surface border ${
              errors?.password ? 'border-error' : 'border-input'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth`}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <Icon 
            name="LockClosedIcon" 
            size={20} 
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              errors?.password ? 'text-error' : 'text-muted-foreground'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
            disabled={isLoading}
          >
            <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} />
          </button>
        </div>
        {errors?.password && (
          <p className="mt-1.5 text-sm text-error flex items-center space-x-1">
            <Icon name="ExclamationCircleIcon" size={16} />
            <span>{errors?.password}</span>
          </p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData?.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-ring transition-smooth"
            disabled={isLoading}
          />
          <span className="text-sm text-foreground">Remember me</span>
        </label>
        <Link 
          href="/user-registration" 
          className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
        >
          Forgot Password?
        </Link>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
            <span>Signing In...</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <Icon name="ArrowRightIcon" size={20} />
          </>
        )}
      </button>
    </form>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes?.func
};