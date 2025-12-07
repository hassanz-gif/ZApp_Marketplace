'use client';

import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function SocialLogin({ onSocialLogin }) {
  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'GlobeAltIcon',
      bgColor: 'bg-white hover:bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'UserGroupIcon',
      bgColor: 'bg-[#1877F2] hover:bg-[#166FE5]',
      textColor: 'text-white',
      borderColor: 'border-[#1877F2]'
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: 'DevicePhoneMobileIcon',
      bgColor: 'bg-black hover:bg-gray-900',
      textColor: 'text-white',
      borderColor: 'border-black'
    }
  ];

  const handleSocialClick = (providerId) => {
    if (onSocialLogin) {
      onSocialLogin(providerId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {socialProviders?.map((provider) => (
          <button
            key={provider?.id}
            type="button"
            onClick={() => handleSocialClick(provider?.id)}
            className={`h-11 px-4 ${provider?.bgColor} ${provider?.textColor} border ${provider?.borderColor} rounded-lg font-medium text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-center space-x-2`}
          >
            <Icon name={provider?.icon} size={20} />
            <span className="hidden sm:inline">{provider?.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

SocialLogin.propTypes = {
  onSocialLogin: PropTypes?.func
};