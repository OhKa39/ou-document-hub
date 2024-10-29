import React from 'react';
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
export const OrderPaypal = () => {
  // Create a stable script options object
  const PAYPAL_SCRIPT_OPTIONS: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENTID!,
    merchantId: process.env.NEXT_PUBLIC_PAYPAL_MERCHANT_ID,
    components: 'card-fields,buttons',
    // intent: 'capture',
    vault: true,
    currency: 'USD',
    intent: 'capture',
    'enable-funding': 'venmo',
    'data-page-type': 'product-details',
    'data-sdk-integration-source': 'developer-studio',
    // debug: true,
  };

  const createOrder = async () => {
    console.log('test create order');
    return 'test';
  };

  const onApprove = async (data: any) => {
    console.log('test o approve');
  };
  return (
    <div>
      <PayPalScriptProvider options={PAYPAL_SCRIPT_OPTIONS}>
        <PayPalButtons style={{ layout: 'vertical' }} createOrder={createOrder} onApprove={onApprove} />
      </PayPalScriptProvider>
    </div>
  );
};
