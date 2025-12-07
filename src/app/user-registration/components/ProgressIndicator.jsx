import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function ProgressIndicator({ currentStep, totalSteps, accountType }) {
  const steps = accountType === 'seller' || accountType === 'both'
    ? [
        { number: 1, label: 'Account Info', icon: 'UserIcon' },
        { number: 2, label: 'Business Details', icon: 'BuildingStorefrontIcon' },
        { number: 3, label: 'Terms & Policies', icon: 'DocumentCheckIcon' }
      ]
    : [
        { number: 1, label: 'Account Info', icon: 'UserIcon' },
        { number: 2, label: 'Terms & Policies', icon: 'DocumentCheckIcon' }
      ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => (
          <div key={step?.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-smooth ${
                  currentStep > step?.number
                    ? 'bg-success text-success-foreground'
                    : currentStep === step?.number
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step?.number ? (
                  <Icon name="CheckIcon" size={20} />
                ) : (
                  <Icon name={step?.icon} size={20} />
                )}
              </div>
              <p
                className={`mt-2 text-xs font-medium text-center hidden sm:block ${
                  currentStep >= step?.number ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step?.label}
              </p>
            </div>
            {index < steps?.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 sm:mx-4">
                <div
                  className={`h-full transition-smooth ${
                    currentStep > step?.number ? 'bg-success' : 'bg-border'
                  }`}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
}

ProgressIndicator.propTypes = {
  currentStep: PropTypes?.number?.isRequired,
  totalSteps: PropTypes?.number?.isRequired,
  accountType: PropTypes?.oneOf(['buyer', 'seller', 'both'])?.isRequired
};