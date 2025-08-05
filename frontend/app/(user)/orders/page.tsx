'use client';
import { useEffect, useState } from 'react';
import { CalendarIcon, ChevronDownIcon, FilterIcon, SearchIcon, SortAscIcon } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/components/providers/UserProvider';
import ServerFetch from '@/utils/ServerFetch';

interface OrderDTO {
  orderId: string;
  orderCode: string;
  date: string;
  total: number;
  paymentMethod: string;
  status: string;
  items: OrderItemDTO[];
}

interface OrderItemDTO {
  imageUrl: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  refundEligible: boolean;
}

interface OrderItemProps {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: string;
  items: {
    name: string;
    quantity: number;
    image: string;
  }[];
  address: string;
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('most-recent');
  const { isAuthenticated } = useUserStore((state) => state);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await ServerFetch(`/api/v1/orders`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        setError('Failed to load order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply filter
    if (filter !== 'all') {
      result = result.filter((order) => order.status.toLowerCase() === filter);
    }

    // Apply sort
    result.sort((a, b) => {
      if (sort === 'most-recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sort === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sort === 'highest-amount') {
        return b.total - a.total;
      } else {
        return a.total - b.total;
      }
    });

    setFilteredOrders(result);
  }, [searchTerm, filter, sort, orders]);

  // if (!isAuthenticated) {
  //   return (
  //     <div className="container mx-auto px-4 py-8 md:px-6">
  //       <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
  //       <p className="mt-4 text-red-500">Please log in to view your order history.</p>
  //       <Button asChild className="mt-4">
  //         <Link href="/login">Log In</Link>
  //       </Button>
  //     </div>
  //   );
  // }

  if (loading) {
    return <div className="container mx-auto px-4 py-8 md:px-6">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500 md:px-6">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
          <p className="mt-1 text-muted-foreground">View and manage your previous orders</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="w-full pl-8 md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter('all')}>All Orders</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('processing')}>Processing</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('shipped')}>Shipped</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('delivered')}>Delivered</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('cancelled')}>Cancelled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SortAscIcon className="h-4 w-4" />
                <span className="sr-only">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSort('most-recent')}>Most recent</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('oldest')}>Oldest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('highest-amount')}>Highest amount</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('lowest-amount')}>Lowest amount</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <OrderItem
            key={order.orderId}
            id={order.orderCode}
            date={new Date(order.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
            status={
              (order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()) as
                | 'Processing'
                | 'Shipped'
                | 'Delivered'
                | 'Cancelled'
            }
            total={`$${order.total.toFixed(2)}`}
            items={order.items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              image: item.imageUrl || '/placeholder.svg?height=80&width=80',
            }))}
            address="123 Main St, Apt 4B, New York, NY 10001" // Replace with actual address from API if available
          />
        ))}
        {filteredOrders.length === 0 && <p className="text-center text-muted-foreground">No orders found.</p>}
      </div>
    </div>
  );
}

function OrderItem({ id, date, status, total, items, address }: OrderItemProps) {
  const statusColor = {
    Processing: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    Shipped: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    Delivered: 'bg-green-100 text-green-800 hover:bg-green-200',
    Cancelled: 'bg-red-100 text-red-800 hover:bg-red-200',
  }[status];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <div>
            <CardTitle className="text-lg">{id}</CardTitle>
            <CardDescription className="mt-1 flex items-center">
              <CalendarIcon className="mr-1 h-3.5 w-3.5" />
              {date}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={statusColor}>
              {status}
            </Badge>
            <span className="font-medium">{total}</span>
          </div>
        </div>
      </CardHeader>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <CardFooter className="flex cursor-pointer justify-between pb-3 pt-3 transition-colors hover:bg-muted/50">
            <span className="text-sm font-medium">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
            <div className="flex items-center text-sm text-muted-foreground">
              View details
              <ChevronDownIcon className="ml-1 h-4 w-4" />
            </div>
          </CardFooter>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">Items</h4>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{item.name}</h5>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Shipping Address</h4>
                <p className="text-sm text-muted-foreground">{address}</p>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/account/orders/${id}`}>Order Details</Link>
                </Button>
                <Button variant="outline" size="sm">
                  Track Package
                </Button>
                {status === 'Processing' && (
                  <Button variant="destructive" size="sm" className="ml-auto md:ml-0">
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
