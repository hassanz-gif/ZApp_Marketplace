'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import CheckoutProgress from './CheckoutProgress';
import ShippingAddressForm from './ShippingAddressForm';
import DeliveryOptions from './DeliveryOptions';
import PaymentMethodForm from './PaymentMethodForm';
import OrderReview from './OrderReview';
import OrderSummary from './OrderSummary';

export default function CheckoutInteractive({ initialData }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(initialData?.savedAddresses?.[0] || null);
  const [deliveryOption, setDeliveryOption] = useState(initialData?.deliveryOptions?.[0] || null);
  const [paymentMethod, setPaymentMethod] = useState(initialData?.savedPaymentMethods?.[0] || null);
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ];

  const handleNext = () => {
    if (currentStep === 0 && !shippingAddress) {
      alert('Please select or add a shipping address');
      return;
    }
    if (currentStep === 1 && !deliveryOption) {
      alert('Please select a delivery option');
      return;
    }
    if (currentStep === 2 && !paymentMethod) {
      alert('Please select or add a payment method');
      return;
    }
    if (currentStep < steps?.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = () => {
    if (!shippingAddress || !deliveryOption || !paymentMethod) {
      alert('Please complete all required steps');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      router?.push('/order-management');
    }, 2000);
  };

  const handleAddressSelect = (address) => {
    setShippingAddress(address);
  };

  const handleNewAddress = (address) => {
    const newAddress = {
      ...address,
      id: `addr_${Date.now()}`,
      isDefault: false,
    };
    setShippingAddress(newAddress);
  };

  const handleDeliverySelect = (option) => {
    setDeliveryOption(option);
  };

  const handlePaymentSelect = (payment) => {
    setPaymentMethod(payment);
  };

  const handleNewPayment = (payment) => {
    const newPayment = {
      id: `pm_${Date.now()}`,
      type: payment?.type === 'card' ? 'Card' : payment?.type,
      lastFour: payment?.cardNumber ? payment?.cardNumber?.slice(-4) : '0000',
      expiry: payment?.expiryDate || 'N/A',
    };
    setPaymentMethod(newPayment);
  };

  const handleApplyPromo = (discountAmount) => {
    setDiscount(discountAmount);
  };

  const subtotal = initialData?.cartItems?.reduce((sum, item) => sum + item?.price * item?.quantity, 0);
  const shipping = deliveryOption?.price || 0;
  const tax = subtotal * 0.08;

  return (
    <div className="min-h-screen bg-background">
      <CheckoutProgress currentStep={currentStep} steps={steps} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface border border-border rounded-lg p-6">
              {currentStep === 0 && (
                <ShippingAddressForm
                  savedAddresses={initialData?.savedAddresses}
                  onAddressSelect={handleAddressSelect}
                  onNewAddress={handleNewAddress}
                />
              )}

              {currentStep === 1 && (
                <DeliveryOptions
                  options={initialData?.deliveryOptions}
                  onOptionSelect={handleDeliverySelect}
                />
              )}

              {currentStep === 2 && (
                <PaymentMethodForm
                  savedPaymentMethods={initialData?.savedPaymentMethods}
                  onPaymentSelect={handlePaymentSelect}
                  onNewPayment={handleNewPayment}
                />
              )}

              {currentStep === 3 && (
                <OrderReview
                  shippingAddress={shippingAddress}
                  deliveryOption={deliveryOption}
                  paymentMethod={paymentMethod}
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="ArrowLeftIcon" size={20} />
                <span>Back</span>
              </button>

              {currentStep < steps?.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-smooth"
                >
                  <span>Continue</span>
                  <Icon name="ArrowRightIcon" size={20} />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-6 py-3 bg-success text-success-foreground font-medium rounded-lg hover:bg-success/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="CheckCircleIcon" size={20} />
                      <span>Place Order</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              items={initialData?.cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              discount={discount}
              onApplyPromo={handleApplyPromo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

CheckoutInteractive.propTypes = {
  initialData: PropTypes?.shape({
    cartItems: PropTypes?.arrayOf(
      PropTypes?.shape({
        id: PropTypes?.string?.isRequired,
        name: PropTypes?.string?.isRequired,
        price: PropTypes?.number?.isRequired,
        quantity: PropTypes?.number?.isRequired,
        image: PropTypes?.string?.isRequired,
        alt: PropTypes?.string?.isRequired,
      })
    )?.isRequired,
    savedAddresses: PropTypes?.arrayOf(
      PropTypes?.shape({
        id: PropTypes?.string?.isRequired,
        fullName: PropTypes?.string?.isRequired,
        addressLine1: PropTypes?.string?.isRequired,
        addressLine2: PropTypes?.string,
        city: PropTypes?.string?.isRequired,
        state: PropTypes?.string?.isRequired,
        zipCode: PropTypes?.string?.isRequired,
        country: PropTypes?.string?.isRequired,
        phone: PropTypes?.string?.isRequired,
        isDefault: PropTypes?.bool,
      })
    )?.isRequired,
    deliveryOptions: PropTypes?.arrayOf(
      PropTypes?.shape({
        id: PropTypes?.string?.isRequired,
        name: PropTypes?.string?.isRequired,
        description: PropTypes?.string?.isRequired,
        estimatedDelivery: PropTypes?.string?.isRequired,
        price: PropTypes?.number?.isRequired,
        icon: PropTypes?.string?.isRequired,
      })
    )?.isRequired,
    savedPaymentMethods: PropTypes?.arrayOf(
      PropTypes?.shape({
        id: PropTypes?.string?.isRequired,
        type: PropTypes?.string?.isRequired,
        lastFour: PropTypes?.string?.isRequired,
        expiry: PropTypes?.string?.isRequired,
      })
    )?.isRequired,
  })?.isRequired,
};