'use client';

import { useState } from 'react';
import Link from 'next/link';

import RegistrationForm from './RegistrationForm';
import ProgressIndicator from './ProgressIndicator';

export default function RegistrationInteractive() {
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState('buyer');

  const totalSteps = accountType === 'seller' || accountType === 'both' ? 3 : 2;

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-background pt-[60px]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-card border border-border rounded-xl shadow-card p-6 sm:p-8">
          <ProgressIndicator 
            currentStep={currentStep} 
            totalSteps={totalSteps}
            accountType={accountType}
          />
          
          <RegistrationForm onStepChange={handleStepChange} />

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/user-login" className="text-primary hover:underline font-medium">
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

RegistrationInteractive.propTypes = {};