'use client';

import React from 'react';
import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalNameField,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalCardFields,
  usePayPalScriptReducer,
  ReactPayPalScriptOptions,
  PayPalCardFieldsForm,
} from '@paypal/react-paypal-js';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getVaultToken } from '@/lib/API/payments';

// Create a stable script options object
const PAYPAL_SCRIPT_OPTIONS: ReactPayPalScriptOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENTID!,
  merchantId: process.env.NEXT_PUBLIC_PAYPAL_MERCHANT_ID,
  components: 'card-fields',
  // intent: 'capture',
  vault: true,
  // debug: true,
};

// Separate CardFields component to handle PayPal fields
const CardFields = () => {
  return (
    <div className="space-y-4">
      <div className="field-container">
        <label className="mb-1 block text-sm font-medium text-gray-700">Name on Card</label>
        <div className="rounded border p-3">
          <PayPalNameField className="w-full" />
        </div>
      </div>

      <div className="field-container">
        <label className="mb-1 block text-sm font-medium text-gray-700">Card Number</label>
        <div className="rounded border p-3">
          <PayPalNumberField className="w-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="field-container">
          <label className="mb-1 block text-sm font-medium text-gray-700">Expiry Date</label>
          <div className="rounded border p-3">
            <PayPalExpiryField className="w-full" />
          </div>
        </div>

        <div className="field-container">
          <label className="mb-1 block text-sm font-medium text-gray-700">CVV</label>
          <div className="rounded border p-3">
            <PayPalCVVField className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

// CardFields.displayName = 'CardFields';

const SubmitPayment: React.FC<{
  setIsPaying: React.Dispatch<React.SetStateAction<boolean>>;
  isPaying: boolean;
}> = ({ isPaying, setIsPaying }) => {
  const { cardFieldsForm, fields } = usePayPalCardFields();

  const handleClick = async () => {
    if (!cardFieldsForm) {
      const childErrorMessage = 'Unable to find any child components in the <PayPalCardFieldsProvider />';

      throw new Error(childErrorMessage);
    }
    const formState = await cardFieldsForm.getState();

    if (!formState.isFormValid) {
      return alert('The payment form is invalid');
    }
    setIsPaying(true);

    cardFieldsForm.submit().catch((err) => {
      setIsPaying(false);
    });
  };

  return (
    <Button
      className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
      onClick={handleClick}
    >
      Pay
    </Button>
  );
};

// Separate PaymentForm component to handle form logic
const PaymentForm = () => {
  const [{ isResolved, isPending }] = usePayPalScriptReducer();
  const [isPaying, setIsPaying] = React.useState(false);

  if (isPending) {
    return <div className="py-4 text-center">Loading PayPal SDK...</div>;
  }

  if (!isResolved) {
    return <div className="py-4 text-center">Error loading PayPal SDK</div>;
  }

  return (
    <PayPalCardFieldsProvider
      onApprove={async ({ vaultSetupToken }) => {
        return fetch('example.com/create/payment/token', { body: JSON.stringify({ vaultSetupToken }) });
      }}
      onError={(err) => {
        console.error('Payment error:', err);
      }}
      createVaultSetupToken={async () => {
        // The merchant calls their server API to generate a vaultSetupToken
        // and return it here as a string
        const res = await getVaultToken();
        return res.data.id;
      }}
    >
      <CardFields />
      <SubmitPayment isPaying={isPaying} setIsPaying={setIsPaying} />
    </PayPalCardFieldsProvider>
  );
};

// PaymentForm.displayName = 'PaymentForm';

// Main page component
const AddPaymentPage: React.FC = () => {
  // Use state to track script loading
  const [isScriptLoaded, setIsScriptLoaded] = React.useState(false);

  React.useEffect(() => {
    setIsScriptLoaded(true);
  }, []);

  if (!isScriptLoaded) {
    return <div className="py-4 text-center">Initializing payment form...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4">
      <Link href="/my-account/payment-cards" className="mb-8 inline-flex items-center text-blue-600">
        <span className="mr-2">←</span>
        Back
      </Link>

      <div className="w-full rounded-lg bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-semibold">Add Payment Method</h2>

        <PayPalScriptProvider options={PAYPAL_SCRIPT_OPTIONS} deferLoading={false}>
          <PaymentForm />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default AddPaymentPage;
