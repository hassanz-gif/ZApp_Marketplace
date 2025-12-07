import Icon from '@/components/ui/AppIcon';

export default function SecurityBadges() {
  const securityFeatures = [
    {
      icon: 'ShieldCheckIcon',
      text: 'SSL Encrypted'
    },
    {
      icon: 'LockClosedIcon',
      text: 'Secure Login'
    },
    {
      icon: 'CheckBadgeIcon',
      text: 'Verified Platform'
    }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      {securityFeatures?.map((feature, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Icon name={feature?.icon} size={20} className="text-success" />
          <span className="text-xs sm:text-sm text-muted-foreground">{feature?.text}</span>
        </div>
      ))}
    </div>
  );
}