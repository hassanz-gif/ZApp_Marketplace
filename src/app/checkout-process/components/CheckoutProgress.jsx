import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function CheckoutProgress({ currentStep, steps }) {
  return (
    <div className="w-full bg-surface border-b border-border py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps?.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep;

            return (
              <div key={step?.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-smooth ${
                      isCompleted
                        ? 'bg-success border-success'
                        : isCurrent
                        ? 'bg-primary border-primary' :'bg-muted border-border'
                    }`}
                  >
                    {isCompleted ? (
                      <Icon name="CheckIcon" size={20} className="text-success-foreground" />
                    ) : (
                      <span
                        className={`text-sm font-semibold ${
                          isCurrent ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs sm:text-sm font-medium text-center ${
                      isCurrent ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                    }`}
                  >
                    {step?.label}
                  </span>
                </div>
                {index < steps?.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-smooth ${
                      isCompleted ? 'bg-success' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

CheckoutProgress.propTypes = {
  currentStep: PropTypes?.number?.isRequired,
  steps: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      label: PropTypes?.string?.isRequired,
    })
  )?.isRequired,
};