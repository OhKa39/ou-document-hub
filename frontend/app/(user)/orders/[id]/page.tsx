'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarIcon, CheckCircle, PackageIcon, TruckIcon } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

interface OrderDTO {
  orderId: string;
  orderCode: string;
  date: string;
  total: number; // Changed to number to match backend BigDecimal
  paymentMethod: string;
  status: string;
  items: OrderItemDTO[];
}

interface OrderItemDTO {
  imageUrl: string;
  name: string;
  quantity: number;
  price: number; // Changed to number to match backend
  total: number; // Changed to number to match backend
  id: number;
  refundEligible: boolean;
}

interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [orderDetails, setOrderDetails] = useState<OrderDTO | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
  const [refundReasons, setRefundReasons] = useState<Record<number, string>>({});
  const [refundNotes, setRefundNotes] = useState<Record<number, string>>({});
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [refundSuccess, setRefundSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = 'USER_ID_HERE'; // Replace with actual user ID from auth context

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/orders/${params.id}/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrderDetails({
          ...data,
          total: Number(data.total), // Convert to number
          items: data.items.map((item: any, index: number) => ({
            ...item,
            id: index + 1,
            price: Number(item.price || 0), // Convert to number
            total: Number(item.total || 0), // Convert to number
            refundEligible: item.refundEligible !== false,
          })),
        });
      } catch (err) {
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [params.id, userId]);

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleReasonChange = (itemId: number, reason: string) => {
    setRefundReasons((prev) => ({
      ...prev,
      [itemId]: reason,
    }));
  };

  const handleNotesChange = (itemId: number, notes: string) => {
    setRefundNotes((prev) => ({
      ...prev,
      [itemId]: notes,
    }));
  };

  const handleRefundRequest = () => {
    console.log(
      'Requesting refund for items:',
      Object.entries(selectedItems)
        .filter(([_, isSelected]) => isSelected)
        .map(([itemId]) => ({
          itemId,
          reason: refundReasons[Number.parseInt(itemId)],
          notes: refundNotes[Number.parseInt(itemId)],
        }))
    );

    setRefundSuccess(true);

    setTimeout(() => {
      setRefundSuccess(false);
      setIsRefundDialogOpen(false);
      setSelectedItems({});
      setRefundReasons({});
      setRefundNotes({});
    }, 3000);
  };

  const hasSelectedItems = Object.values(selectedItems).some(Boolean);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 md:px-6">Loading...</div>;
  }

  if (error || !orderDetails) {
    return <div className="container mx-auto px-4 py-8 text-red-500 md:px-6">{error || 'Order not found'}</div>;
  }

  const mockShippingAddress: Address = {
    name: 'John Doe',
    street: '123 Main St, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-2" asChild>
          <Link href="/account/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Order {orderDetails.orderCode}</h1>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-1 h-3.5 w-3.5" />
            Placed on{' '}
            {new Date(orderDetails.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <Badge
            variant="outline"
            className={
              {
                Processing: 'bg-amber-100 text-amber-800',
                Shipped: 'bg-blue-100 text-blue-800',
                Delivered: 'bg-green-100 text-green-800',
                Cancelled: 'bg-red-100 text-red-800',
              }[
                (orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1).toLowerCase()) as
                  | 'Processing'
                  | 'Shipped'
                  | 'Delivered'
                  | 'Cancelled'
              ]
            }
          >
            {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Items</CardTitle>
              {orderDetails.status.toLowerCase() === 'delivered' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRefundDialogOpen(true)}
                  disabled={!hasSelectedItems}
                >
                  Request Refund for Selected
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {orderDetails.status.toLowerCase() === 'delivered' && (
                      <TableHead className="w-[50px]">Select</TableHead>
                    )}
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetails.items.map((item) => (
                    <TableRow key={item.id}>
                      {orderDetails.status.toLowerCase() === 'delivered' && (
                        <TableCell>
                          <Checkbox
                            checked={!!selectedItems[item.id]}
                            onCheckedChange={() => toggleItemSelection(item.id)}
                            disabled={!item.refundEligible}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                          <img
                            src={item.imageUrl || '/placeholder.svg'}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.name}
                        {selectedItems[item.id] && (
                          <div className="mt-2 space-y-2">
                            <Select
                              value={refundReasons[item.id] || ''}
                              onValueChange={(value) => handleReasonChange(item.id, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select refund reason" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="defective">Defective item</SelectItem>
                                <SelectItem value="damaged">Damaged during shipping</SelectItem>
                                <SelectItem value="wrong-item">Wrong item received</SelectItem>
                                <SelectItem value="not-as-described">Not as described</SelectItem>
                                <SelectItem value="changed-mind">Changed my mind</SelectItem>
                                <SelectItem value="other">Other reason</SelectItem>
                              </SelectContent>
                            </Select>
                            <Textarea
                              placeholder="Additional notes (optional)"
                              value={refundNotes[item.id] || ''}
                              onChange={(e) => handleNotesChange(item.id, e.target.value)}
                              className="h-20"
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Shipping Address</h3>
                  <address className="not-italic text-muted-foreground">
                    {mockShippingAddress.name}
                    <br />
                    {mockShippingAddress.street}
                    <br />
                    {mockShippingAddress.city}, {mockShippingAddress.state} {mockShippingAddress.zip}
                    <br />
                    {mockShippingAddress.country}
                  </address>
                </div>
                <div>
                  <h3 className="mb-2 font-medium">Billing Address</h3>
                  <address className="not-italic text-muted-foreground">
                    {mockShippingAddress.name}
                    <br />
                    {mockShippingAddress.street}
                    <br />
                    {mockShippingAddress.city}, {mockShippingAddress.state} {mockShippingAddress.zip}
                    <br />
                    {mockShippingAddress.country}
                  </address>
                </div>
              </div>

              {orderDetails.status.toLowerCase() !== 'cancelled' && (
                <div className="mt-6">
                  <h3 className="mb-2 font-medium">Tracking Information</h3>
                  <div className="mb-2 flex items-center gap-2">
                    <TruckIcon className="h-4 w-4 text-muted-foreground" />
                    <span>UPS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PackageIcon className="h-4 w-4 text-muted-foreground" />
                    <span>1Z999AA10123456784</span>
                  </div>
                  <Button className="mt-4" variant="outline">
                    Track Package
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(orderDetails.total - 10).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>$10.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">{orderDetails.paymentMethod}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Return or Exchange
              </Button>
              <Button variant="outline" className="w-full">
                Report an Issue
              </Button>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>

          {orderDetails.status.toLowerCase() === 'processing' && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Cancel Order</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  You can still cancel this order as it hasn't been shipped yet. Once cancelled, your payment will be
                  refunded within 3-5 business days.
                </p>
                <Button variant="destructive" className="w-full">
                  Cancel Order
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{refundSuccess ? 'Refund Request Submitted' : 'Request Refund'}</DialogTitle>
            <DialogDescription>
              {refundSuccess
                ? "Your refund request has been submitted successfully. We'll process it within 1-2 business days."
                : 'Please confirm that you want to request a refund for the selected items.'}
            </DialogDescription>
          </DialogHeader>

          {refundSuccess ? (
            <div className="flex flex-col items-center justify-center py-4">
              <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
              <p className="text-center">
                Your refund request has been submitted. You'll receive a confirmation email shortly.
              </p>
            </div>
          ) : (
            <>
              <div className="py-4">
                <h4 className="mb-2 font-medium">Selected Items:</h4>
                <ul className="space-y-2">
                  {orderDetails.items.map((item) => {
                    if (!selectedItems[item.id]) return null;
                    return (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>${item.total.toFixed(2)}</span>
                      </li>
                    );
                  })}
                </ul>

                <Separator className="my-4" />

                <div className="flex justify-between font-medium">
                  <span>Total Refund Amount:</span>
                  <span>
                    {orderDetails.items
                      .filter((item) => selectedItems[item.id])
                      .reduce((sum, item) => sum + item.total, 0)
                      .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRefundRequest}>Submit Refund Request</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
