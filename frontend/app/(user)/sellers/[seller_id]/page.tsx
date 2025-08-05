import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Star, ThumbsUp, User, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import SellerInfoComponent from '@/components/(user)/Seller/SellerInfoComponent';

interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  satisfaction: number;
  productsSold: number;
  responseTime: string;
  badges: string[];
  about: string;
  policies: string[];
}

export default function ShopperProfile({ params }: { params: { seller_id: string } }) {
  return <SellerInfoComponent sellerId={params.seller_id} />;
}
