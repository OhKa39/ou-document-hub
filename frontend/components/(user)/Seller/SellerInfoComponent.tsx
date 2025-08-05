'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Package, Star, ThumbsUp, User, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import ChatComponent from '@/components/ChatComponent/ChatComponent';
import useGetUserById from '@/hooks/useGetUserById';
import { useUserStore } from '@/components/providers/UserProvider';

type Props = {
  sellerId: string;
};

export default function SellerInfoComponent({ sellerId }: Props) {
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [firstMessage, setFirstMessage] = useState('');
  const [isChatComponentOpen, setIsChatComponentOpen] = useState(false);
  const { data, isLoading, isError } = useGetUserById(sellerId);
  const { user: currentUser, isAuthenticated } = useUserStore((state) => state);

  const handleOpenChatDialog = () => {
    if (!isAuthenticated || !currentUser?.userId) {
      console.warn('User must be authenticated to start a chat');
      return;
    }
    setIsChatDialogOpen(true);
  };

  const handleSendFirstMessage = async () => {
    if (!firstMessage.trim() || !currentUser?.userId) {
      return;
    }
    try {
      // Open ChatComponent with the first message and sellerId
      setIsChatDialogOpen(false);
      setIsChatComponentOpen(true);
      setFirstMessage('');
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading seller data</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        <div className="flex flex-col items-start gap-6 md:flex-row">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg md:h-32 md:w-32">
            <Image src={data?.data?.avatarLink || '/placeholder.svg'} alt="User Avatar" fill className="object-cover" />
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <h1 className="text-2xl font-bold">{data?.data?.lastName + ' ' + data?.data?.firstName}</h1>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.8</span>
                <span className="text-muted-foreground">(123 ratings)</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-2 text-center">
                <div className="font-bold">123</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-2 text-center">
                <div className="font-bold">95%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-2 text-center">
                <div className="font-bold">789</div>
                <div className="text-sm text-muted-foreground">Products Sold</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-2 text-center">
                <div className="font-bold">1h</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 md:mt-0">
            <Button>Follow Shop</Button>
            <Button variant="outline" onClick={handleOpenChatDialog}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat with Seller
            </Button>
          </div>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:inline-flex md:w-auto">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="about">About Shop</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCard key={i} index={i} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <ReviewCard key={i} index={i} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-2 text-lg font-medium">About {data?.data?.lastName + ' ' + data?.data?.firstName}</h3>
                <p className="mb-4 text-muted-foreground">Lorem ipsum dolor sit amet...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isChatDialogOpen} onOpenChange={setIsChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Chat with {data?.data?.lastName + ' ' + data?.data?.firstName}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Type your message..."
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChatDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendFirstMessage} disabled={!firstMessage.trim()}>
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isChatComponentOpen && (
        <ChatComponent
          initialUserId={sellerId}
          initialMessage={firstMessage}
          onClose={() => setIsChatComponentOpen(false)}
        />
      )}
    </div>
  );
}

function ProductCard({ index }: { index: number }) {
  const price = 19.99 + index * 5;
  const discountedPrice = price * 0.8;
  const hasDiscount = index % 3 === 0;

  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={`/placeholder.svg?height=300&width=300&text=Product ${index + 1}`}
          alt={`Product ${index + 1}`}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {hasDiscount && <Badge className="absolute left-2 top-2 bg-red-500">20% OFF</Badge>}
      </div>
      <CardContent className="p-3">
        <h3 className="truncate text-sm font-medium">Fashion Item {index + 1}</h3>
        <div className="mt-1 flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="font-bold">${discountedPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-bold">${price.toFixed(2)}</span>
          )}
        </div>
        <div className="mt-1 flex items-center text-sm text-muted-foreground">
          <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>4.{8 + (index % 2)}</span>
          <span className="mx-1">·</span>
          <span>{50 + index * 12} sold</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewCard({ index }: { index: number }) {
  const names = ['John D.', 'Emma S.', 'Michael T.'];
  const dates = ['2 days ago', '1 week ago', '3 weeks ago'];
  const ratings = [5, 4, 5];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={`/placeholder.svg?height=40&width=40&text=${names[index][0]}`}
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{names[index]}</div>
                <div className="text-sm text-muted-foreground">{dates[index]}</div>
              </div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < ratings[index] ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            <p className="mt-2 text-sm">
              {index === 0 && 'Great quality product! The fabric is soft and the size fits perfectly.'}
              {index === 1 && 'Nice item, good value for money. Took a bit longer to arrive than expected.'}
              {index === 2 && 'Absolutely love this! The color is exactly as shown in the pictures.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
