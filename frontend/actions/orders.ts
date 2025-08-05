'use server';

import { PAYMENT_ENDPOINT } from '@/constants/api_endpoint';
import ServerFetch from '@/utils/ServerFetch';
import { cookies } from 'next/headers';

export async function createOrder() {
  try {
    const response = await ServerFetch(`${PAYMENT_ENDPOINT}/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const data = await response.json();
    if (data.status === 'success') {
      return data.data.id; // Return PayPal order ID
    } else {
      throw new Error(data.message || 'Failed to create PayPal order');
    }
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Unable to create PayPal order');
  }
}

export async function captureOrder(data: { orderID: string }) {
  try {
    const response = await ServerFetch(`${PAYMENT_ENDPOINT}/checkout/orders/${data.orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const result = await response.json();
    console.log('result', result);
    if (response.ok) {
      return result; // Return captured order data
    } else {
      throw new Error(result.message || 'Failed to capture PayPal order');
    }
  } catch (error) {
    console.error('Error capturing order:', error);
    throw new Error('Unable to capture PayPal order');
  }
}

export async function saveOrder(orderData: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  paymentMethod: string;
  paypalOrderId?: string;
  status: string;
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(orderData),
    });
    const result = await response.json();
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to save order');
    }
  } catch (error) {
    console.error('Error saving order:', error);
    throw new Error('Unable to save order');
  }
}
