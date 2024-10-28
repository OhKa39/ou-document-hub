'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PayPalSignUpButton from './PaypalIntegrationComponents/PaypalSignUpButton';
import { useSearchParams } from 'next/navigation';
import ServerFetch from '@/utils/ServerFetch';
import { PAYMENT_ENDPOINT } from '@/constants/api_endpoint';
import { useUserStore } from '@/components/providers/UserProvider';

export default function PayPalIntegration() {
  const { setUser, user } = useUserStore((state) => state);
  const [isVerified, setIsVerified] = useState(!!user?.sellerInformationDTO?.merchantId);

  const param = useSearchParams();
  console.log(param);
  const userId = param.get('merchantId');
  const merchantId = param.get('merchantIdInPayPal');
  const accountType = param.get('accountStatus');

  useEffect(() => {
    const fetchData = async () => {
      const res = await ServerFetch(
        `${PAYMENT_ENDPOINT}/customer/seller-onboard-status?user_id=${userId}&merchant_id=${merchantId}&account_type=${accountType}`
      );
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
        if (data.data?.merchantId) setIsVerified(true);
      }
    };
    if (merchantId && !user?.sellerInformationDTO?.merchantId) fetchData();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#003087"
              d="M20.067 8.478c.492.315.844.825.844 1.441 0 .161-.019.32-.057.473.091.031.181.065.269.102.392.156.743.393 1.028.687.285.294.506.644.653 1.033.147.389.222.81.222 1.254 0 .757-.222 1.433-.666 2.028-.444.596-.957.981-1.542 1.157-.584.175-1.557.263-2.916.263H12.31l-.436 2.748h-3.046l.047-.297.738-4.681.067-.428.378-2.397.067-.423.861-5.451h5.451c.256 0 .509.029.759.086.25.057.489.148.716.274.228.125.425.291.591.499.166.207.289.461.369.762zm-1.666 7.167c.163-.021.306-.086.431-.193.125-.107.186-.265.186-.473 0-.226-.088-.394-.263-.505-.175-.111-.453-.167-.833-.167h-1.050l-.301 1.338h1.829zm.328-3.13c.181 0 .331-.059.452-.176.121-.117.181-.281.181-.491 0-.226-.076-.386-.228-.481-.153-.095-.395-.143-.728-.143h-.957l-.301 1.291h1.581zm-3.352-5.988h-2.209l-.762 4.963h2.163c.803 0 1.357-.052 1.663-.157.306-.105.544-.27.716-.495.172-.225.257-.544.257-.957 0-.301-.059-.556-.176-.762-.118-.206-.288-.374-.51-.502-.223-.128-.469-.214-.739-.257-.271-.044-.695-.065-1.271-.065h-.762l-.153.995h1.271c.251 0 .447.015.59.046.143.031.255.078.337.143.082.065.139.146.171.243.032.097.048.205.048.324 0 .161-.03.293-.09.396-.06.102-.146.178-.257.228-.111.05-.243.083-.396.097-.153.013-.412.02-.777.02h-.301l-.352 2.308h-2.209l.436-2.832.067-.428.378-2.397.067-.423.436-2.832h5.451c.251 0 .499.029.744.086.245.057.479.147.701.269.222.122.414.284.575.487.161.203.281.452.36.747h.031c.175-.226.392-.417.651-.571.259-.154.561-.263.905-.324.344-.062.714-.093 1.11-.093h1.11l-.436 2.832h-1.11c-.352 0-.63.041-.834.124-.204.083-.352.199-.446.35-.094.15-.141.335-.141.556 0 .241.067.426.201.556.134.13.321.194.561.194h1.11l-.436 2.832h-1.11c-.402 0-.77-.031-1.104-.093-.334-.062-.63-.17-.889-.324-.259-.154-.476-.345-.651-.571h-.031c-.08.295-.2.544-.36.747-.161.203-.353.365-.575.487-.222.122-.456.212-.701.269-.245.057-.493.086-.744.086h-1.11l.436-2.832h1.11c.352 0 .63-.041.834-.124.204-.083.352-.199.446-.35.094-.15.141-.335.141-.556 0-.241-.067-.426-.201-.556-.134-.13-.321-.194-.561-.194h-1.11l.436-2.832h1.11z"
            />
          </svg>
          PayPal Liên kết
        </CardTitle>
        <CardDescription>Kết nối tài khoản PayPal của bạn để thực hiện các giao dịch an toàn</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <PayPalSignUpButton isVerified={isVerified} />
          <div className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-2">
            <span className="text-sm font-medium">Trạng thái xác minh</span>
            {isVerified ? (
              <motion.div
                className="flex items-center text-green-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="mr-1 h-5 w-5" />
                <span className="text-sm">Đã xác minh</span>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center text-yellow-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="mr-1 h-5 w-5" />
                <span className="text-sm">Chưa xác minh</span>
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
