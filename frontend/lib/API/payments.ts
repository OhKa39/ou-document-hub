import { PAYMENT_ENDPOINT } from '@/constants/api_endpoint';
import ServerFetch from '@/utils/ServerFetch';

export const getVaultToken = async () => {
  const data = await ServerFetch(`${PAYMENT_ENDPOINT}/vault/setup-tokens`);
  const res = await data.json();
  return res;
};

export const getSignUpPaypalUrl = async () => {
  const data = await ServerFetch(`${PAYMENT_ENDPOINT}/customer/partner-referrals`);
  const res = await data.json();
  return res;
};
