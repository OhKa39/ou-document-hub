'use client';

import React from 'react';
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import { captureOrder, createOrder } from '@/actions/orders';
import { useRouter } from 'next/navigation';

const OrderPaypal = ({ onOrderCaptured }: { onOrderCaptured: (orderData: any) => void }) => {
  const router = useRouter();
  const PAYPAL_SCRIPT_OPTIONS: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENTID!,
    components: 'buttons',
    currency: 'USD',
    intent: 'capture',
    debug: process.env.NODE_ENV === 'development',
  };

  const createOrders = async () => {
    try {
      const orderId = await createOrder();
      return orderId;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw error;
    }
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const result = await captureOrder({ orderID: data.orderID });

      // Handle PayPal-specific error cases
      const errorDetail = result?.details?.[0];

      if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
        console.log('Instrument declined, restarting...');
        return actions.restart();
      } else if (errorDetail) {
        console.error('Non-recoverable error:', errorDetail);
        // Create a proper error object that PayPal can handle
        const paypalError = {
          name: 'PAYPAL_ERROR',
          message: errorDetail.description || 'Payment processing failed',
          details: errorDetail,
        };
        throw paypalError; // Throw object, not Error instance
      } else if (result.status !== 'success' || !result.data) {
        console.error('Invalid response structure:', result);
        throw {
          name: 'INVALID_RESPONSE',
          message: 'Invalid order capture response',
        };
      }

      const orderData = result.data;
      console.log('Captured PayPal order:', orderData);

      // Validate orderData
      if (!orderData || typeof orderData !== 'object' || !orderData.orderId || typeof orderData.orderId !== 'string') {
        console.error('Invalid order data:', orderData);
        throw {
          name: 'INVALID_ORDER_DATA',
          message: 'Invalid order data received',
        };
      }

      // Display success message with transaction details
      if (orderData.transactionId && orderData.transactionStatus) {
        resultMessage(
          `Transaction ${orderData.transactionStatus}: ${orderData.transactionId}<br>Order ${orderData.orderCode} completed successfully!`
        );
      } else {
        resultMessage(`Order ${orderData.orderCode} completed successfully!`);
      }

      // Redirect to next step
      router.push(`/cart/process-step-3?orderDetails=${encodeURIComponent(JSON.stringify(orderData))}`);
    } catch (error: any) {
      console.error('onApprove error:', error);

      // If it's already a structured error, re-throw it
      if (error && typeof error === 'object' && error.name) {
        resultMessage(`Sorry, your transaction could not be processed: ${error.message}`);
        throw error;
      }

      // For unexpected errors, create a structured error
      const structuredError = {
        name: 'UNEXPECTED_ERROR',
        message: error.message || 'An unexpected error occurred',
      };

      resultMessage(`Sorry, your transaction could not be processed: ${structuredError.message}`);
      throw structuredError;
    }
  };
  const resultMessage = (message: string) => {
    console.log('Result Message:', message); // Replace with actual UI update logic
  };

  return (
    <div>
      <PayPalScriptProvider options={PAYPAL_SCRIPT_OPTIONS}>
        <PayPalButtons style={{ layout: 'vertical' }} createOrder={createOrders} onApprove={onApprove} />
      </PayPalScriptProvider>
    </div>
  );
};
export default OrderPaypal;
