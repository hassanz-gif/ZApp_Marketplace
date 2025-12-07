import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

export default function OrderReview({ shippingAddress, deliveryOption, paymentMethod }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Review Your Order</h2>
      <div className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center space-x-2">
              <Icon name="MapPinIcon" size={20} className="text-primary" />
              <span>Shipping Address</span>
            </h3>
          </div>
          {shippingAddress ? (
            <div className="ml-7 space-y-1">
              <p className="text-sm font-medium text-foreground">{shippingAddress?.fullName}</p>
              <p className="text-sm text-muted-foreground">{shippingAddress?.addressLine1}</p>
              {shippingAddress?.addressLine2 && (
                <p className="text-sm text-muted-foreground">{shippingAddress?.addressLine2}</p>
              )}
              <p className="text-sm text-muted-foreground">
                {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode}
              </p>
              <p className="text-sm text-muted-foreground">{shippingAddress?.phone}</p>
            </div>
          ) : (
            <p className="ml-7 text-sm text-error">No shipping address selected</p>
          )}
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center space-x-2">
              <Icon name="TruckIcon" size={20} className="text-primary" />
              <span>Delivery Method</span>
            </h3>
          </div>
          {deliveryOption ? (
            <div className="ml-7 space-y-1">
              <p className="text-sm font-medium text-foreground">{deliveryOption?.name}</p>
              <p className="text-sm text-muted-foreground">{deliveryOption?.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-muted-foreground">{deliveryOption?.estimatedDelivery}</span>
                <span className="text-sm font-semibold text-foreground">
                  {deliveryOption?.price === 0 ? 'FREE' : `$${deliveryOption?.price?.toFixed(2)}`}
                </span>
              </div>
            </div>
          ) : (
            <p className="ml-7 text-sm text-error">No delivery option selected</p>
          )}
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center space-x-2">
              <Icon name="CreditCardIcon" size={20} className="text-primary" />
              <span>Payment Method</span>
            </h3>
          </div>
          {paymentMethod ? (
            <div className="ml-7 space-y-1">
              <p className="text-sm font-medium text-foreground">
                {paymentMethod?.type} •••• {paymentMethod?.lastFour}
              </p>
              <p className="text-sm text-muted-foreground">Expires {paymentMethod?.expiry}</p>
            </div>
          ) : (
            <p className="ml-7 text-sm text-error">No payment method selected</p>
          )}
        </div>
      </div>
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={24} className="text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Order Confirmation</p>
            <p className="text-xs text-muted-foreground mt-1">
              By placing this order, you agree to our Terms of Service and Privacy Policy. You will receive an order confirmation email shortly after completing your purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

OrderReview.propTypes = {
  shippingAddress: PropTypes?.shape({
    fullName: PropTypes?.string?.isRequired,
    addressLine1: PropTypes?.string?.isRequired,
    addressLine2: PropTypes?.string,
    city: PropTypes?.string?.isRequired,
    state: PropTypes?.string?.isRequired,
    zipCode: PropTypes?.string?.isRequired,
    phone: PropTypes?.string?.isRequired,
  }),
  deliveryOption: PropTypes?.shape({
    name: PropTypes?.string?.isRequired,
    description: PropTypes?.string?.isRequired,
    estimatedDelivery: PropTypes?.string?.isRequired,
    price: PropTypes?.number?.isRequired,
  }),
  paymentMethod: PropTypes?.shape({
    type: PropTypes?.string?.isRequired,
    lastFour: PropTypes?.string?.isRequired,
    expiry: PropTypes?.string?.isRequired,
  }),
};