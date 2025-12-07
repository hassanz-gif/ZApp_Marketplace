'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function RegistrationForm({ onStepChange }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState('buyer');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    businessType: '',
    taxId: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    marketingOptIn: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const totalSteps = accountType === 'seller' || accountType === 'both' ? 3 : 2;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validatePassword = (password) => {
    return password?.length >= 8 && /[A-Z]/?.test(password) && /[0-9]/?.test(password);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.firstName?.trim()) newErrors.firstName = 'First name is required';
      if (!formData?.lastName?.trim()) newErrors.lastName = 'Last name is required';
      if (!formData?.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData?.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData?.password) {
        newErrors.password = 'Password is required';
      } else if (!validatePassword(formData?.password)) {
        newErrors.password = 'Password must be at least 8 characters with 1 uppercase and 1 number';
      }
      if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 2 && (accountType === 'seller' || accountType === 'both')) {
      if (!formData?.businessName?.trim()) newErrors.businessName = 'Business name is required';
      if (!formData?.businessType) newErrors.businessType = 'Business type is required';
      if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
    }

    if (step === totalSteps) {
      if (!formData?.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms of service';
      if (!formData?.agreeToPrivacy) newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setErrors({});
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange(nextStep);
    }
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    onStepChange(prevStep);
  };

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files)?.map(file => ({
      id: Date.now() + Math.random(),
      name: file?.name,
      size: (file?.size / 1024)?.toFixed(2) + ' KB',
      type: file?.type
    }));
    setUploadedDocuments(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    handleFileUpload(e?.dataTransfer?.files);
  };

  const handleFileInputChange = (e) => {
    handleFileUpload(e?.target?.files);
  };

  const removeDocument = (id) => {
    setUploadedDocuments(prev => prev?.filter(doc => doc?.id !== id));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateStep(totalSteps)) {
      router?.push('/user-login');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Create Your Account</h2>
            <p className="text-sm text-muted-foreground">Join MarketPlace Pro and start your journey</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Account Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleAccountTypeChange('buyer')}
                className={`p-4 border-2 rounded-lg transition-smooth text-left ${
                  accountType === 'buyer' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <Icon name="ShoppingBagIcon" size={24} className={accountType === 'buyer' ? 'text-primary' : 'text-muted-foreground'} />
                <div className="mt-2">
                  <p className="font-medium text-foreground">Buyer</p>
                  <p className="text-xs text-muted-foreground mt-1">Shop and purchase products</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleAccountTypeChange('seller')}
                className={`p-4 border-2 rounded-lg transition-smooth text-left ${
                  accountType === 'seller' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <Icon name="BuildingStorefrontIcon" size={24} className={accountType === 'seller' ? 'text-primary' : 'text-muted-foreground'} />
                <div className="mt-2">
                  <p className="font-medium text-foreground">Seller</p>
                  <p className="text-xs text-muted-foreground mt-1">List and sell products</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleAccountTypeChange('both')}
                className={`p-4 border-2 rounded-lg transition-smooth text-left ${
                  accountType === 'both' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <Icon name="UserGroupIcon" size={24} className={accountType === 'both' ? 'text-primary' : 'text-muted-foreground'} />
                <div className="mt-2">
                  <p className="font-medium text-foreground">Both</p>
                  <p className="text-xs text-muted-foreground mt-1">Buy and sell products</p>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                First Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData?.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors?.firstName ? 'border-error' : 'border-input'
                }`}
                placeholder="John"
              />
              {errors?.firstName && (
                <p className="mt-1 text-sm text-error flex items-center gap-1">
                  <Icon name="ExclamationCircleIcon" size={16} />
                  {errors?.firstName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                Last Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData?.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors?.lastName ? 'border-error' : 'border-input'
                }`}
                placeholder="Doe"
              />
              {errors?.lastName && (
                <p className="mt-1 text-sm text-error flex items-center gap-1">
                  <Icon name="ExclamationCircleIcon" size={16} />
                  {errors?.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address <span className="text-error">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData?.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                errors?.email ? 'border-error' : 'border-input'
              }`}
              placeholder="john.doe@example.com"
            />
            {errors?.email && (
              <p className="mt-1 text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors?.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData?.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 pr-12 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors?.password ? 'border-error' : 'border-input'
                }`}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} />
              </button>
            </div>
            {errors?.password && (
              <p className="mt-1 text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors?.password}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Must be at least 8 characters with 1 uppercase and 1 number</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
              Confirm Password <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData?.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 pr-12 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors?.confirmPassword ? 'border-error' : 'border-input'
                }`}
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Icon name={showConfirmPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} />
              </button>
            </div>
            {errors?.confirmPassword && (
              <p className="mt-1 text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors?.confirmPassword}
              </p>
            )}
          </div>
        </div>
      )}
      {currentStep === 2 && (accountType === 'seller' || accountType === 'both') && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Business Information</h2>
            <p className="text-sm text-muted-foreground">Tell us about your business</p>
          </div>

          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-foreground mb-2">
              Business Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData?.businessName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                errors?.businessName ? 'border-error' : 'border-input'
              }`}
              placeholder="Your Business Name"
            />
            {errors?.businessName && (
              <p className="mt-1 text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors?.businessName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-foreground mb-2">
              Business Type <span className="text-error">*</span>
            </label>
            <select
              id="businessType"
              name="businessType"
              value={formData?.businessType}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                errors?.businessType ? 'border-error' : 'border-input'
              }`}
            >
              <option value="">Select business type</option>
              <option value="individual">Individual/Sole Proprietor</option>
              <option value="llc">Limited Liability Company (LLC)</option>
              <option value="corporation">Corporation</option>
              <option value="partnership">Partnership</option>
              <option value="nonprofit">Non-Profit Organization</option>
            </select>
            {errors?.businessType && (
              <p className="mt-1 text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors?.businessType}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone Number <span className="text-error">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData?.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                errors?.phone ? 'border-error' : 'border-input'
              }`}
              placeholder="+1 (555) 123-4567"
            />
            {errors?.phone && (
              <p className="mt-1 text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors?.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="taxId" className="block text-sm font-medium text-foreground mb-2">
              Tax ID / EIN (Optional)
            </label>
            <input
              type="text"
              id="taxId"
              name="taxId"
              value={formData?.taxId}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-surface border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              placeholder="XX-XXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Business Documents (Optional)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-smooth ${
                isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <Icon name="CloudArrowUpIcon" size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-foreground mb-1">Drag and drop files here, or click to browse</p>
              <p className="text-xs text-muted-foreground mb-4">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
              <input
                type="file"
                id="fileUpload"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <label
                htmlFor="fileUpload"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 cursor-pointer transition-smooth"
              >
                <Icon name="DocumentPlusIcon" size={20} className="mr-2" />
                Choose Files
              </label>
            </div>

            {uploadedDocuments?.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedDocuments?.map((doc) => (
                  <div key={doc?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Icon name="DocumentIcon" size={20} className="text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{doc?.name}</p>
                        <p className="text-xs text-muted-foreground">{doc?.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(doc?.id)}
                      className="ml-3 p-1 text-error hover:bg-error/10 rounded transition-smooth flex-shrink-0"
                    >
                      <Icon name="XMarkIcon" size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {currentStep === 2 && accountType === 'buyer' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Terms & Agreements</h2>
            <p className="text-sm text-muted-foreground">Please review and accept our policies</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData?.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-ring"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-foreground">
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> <span className="text-error">*</span>
              </label>
            </div>
            {errors?.agreeToTerms && (
              <p className="ml-7 text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors?.agreeToTerms}
              </p>
            )}

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeToPrivacy"
                name="agreeToPrivacy"
                checked={formData?.agreeToPrivacy}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-ring"
              />
              <label htmlFor="agreeToPrivacy" className="text-sm text-foreground">
                I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> <span className="text-error">*</span>
              </label>
            </div>
            {errors?.agreeToPrivacy && (
              <p className="ml-7 text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors?.agreeToPrivacy}
              </p>
            )}

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="marketingOptIn"
                name="marketingOptIn"
                checked={formData?.marketingOptIn}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-ring"
              />
              <label htmlFor="marketingOptIn" className="text-sm text-foreground">
                I want to receive promotional emails and updates about new products
              </label>
            </div>
          </div>
        </div>
      )}
      {currentStep === 3 && (accountType === 'seller' || accountType === 'both') && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Terms & Agreements</h2>
            <p className="text-sm text-muted-foreground">Please review and accept our policies</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData?.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-ring"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-foreground">
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> <span className="text-error">*</span>
              </label>
            </div>
            {errors?.agreeToTerms && (
              <p className="ml-7 text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors?.agreeToTerms}
              </p>
            )}

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeToPrivacy"
                name="agreeToPrivacy"
                checked={formData?.agreeToPrivacy}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-ring"
              />
              <label htmlFor="agreeToPrivacy" className="text-sm text-foreground">
                I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> <span className="text-error">*</span>
              </label>
            </div>
            {errors?.agreeToPrivacy && (
              <p className="ml-7 text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors?.agreeToPrivacy}
              </p>
            )}

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="marketingOptIn"
                name="marketingOptIn"
                checked={formData?.marketingOptIn}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-ring"
              />
              <label htmlFor="marketingOptIn" className="text-sm text-foreground">
                I want to receive promotional emails and updates about new products
              </label>
            </div>
          </div>

          <div className="bg-muted border border-border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Seller Verification</p>
                <p className="text-sm text-muted-foreground">Your account will be reviewed within 24-48 hours. You'll receive an email once your seller account is approved.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-smooth"
          >
            <Icon name="ChevronLeftIcon" size={20} className="mr-1" />
            Back
          </button>
        ) : (
          <div></div>
        )}

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
          >
            Next
            <Icon name="ChevronRightIcon" size={20} className="ml-1" />
          </button>
        ) : (
          <button
            type="submit"
            className="inline-flex items-center px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-smooth"
          >
            <Icon name="CheckIcon" size={20} className="mr-2" />
            Create Account
          </button>
        )}
      </div>
    </form>
  );
}

RegistrationForm.propTypes = {
  onStepChange: PropTypes?.func?.isRequired
};