import React from 'react';
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import { captureOrder, createOrder } from '@/actions/orders';
export const OrderPaypal = () => {
  // Create a stable script options object
  const PAYPAL_SCRIPT_OPTIONS: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENTID!,
    // merchantId: process.env.NEXT_PUBLIC_PAYPAL_MERCHANT_ID,
    components: 'buttons',
    // intent: 'capture',
    // vault: true,
    currency: 'USD',
    intent: 'capture',
    // 'enable-funding': 'venmo',
    // 'data-page-type': 'product-details',
    // 'data-sdk-integration-source': 'developer-studio',
    debug: true,
  };

  const createOrders = async () => {
    const orderId = await createOrder();
    return orderId;
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const orderData = await captureOrder(data);

      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
        // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
        return actions.restart();
      } else if (errorDetail) {
        // (2) Other non-recoverable errors -> Show a failure message
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else if (!orderData.purchase_units) {
        throw new Error(JSON.stringify(orderData));
      } else {
      }
    } catch (error) {
      console.error(error);
    }
    // console.log(orderData.data.orderId)
  };
  return (
    <div>
      <PayPalScriptProvider options={PAYPAL_SCRIPT_OPTIONS}>
        <PayPalButtons style={{ layout: 'vertical' }} createOrder={createOrders} onApprove={onApprove} />
      </PayPalScriptProvider>
    </div>
  );
};
