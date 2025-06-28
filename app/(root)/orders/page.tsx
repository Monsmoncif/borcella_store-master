'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";


interface ProductDetails {
  title: string;
  price: number;
  media: string[];
}

interface OrderItem {
  itemId: string;
  quantity: number;
  color?: string;
  size?: string;
  priceAtPurchase: number;
  productDetails: ProductDetails;
}

interface Order {
  id: string;
  customer: {
    clerkId: string;
    email: string;
    name: string;
  };
  shipping: {
    wilaya: string;
    commune: string;
    price: number;
  };
  address: string;
  phone: string;
  cartItems: OrderItem[];
  totalAmount: number;
  couponCode?: string;
  discountAmount?: number;
  status: string;
  createdAt: string;
}

const OrdersPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async (clerkId: string) => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(`/api/orders?clerkId=${clerkId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate and process orders
      const processedOrders = data.map((order: any) => ({
        id: order._id || order.id,
        customer: order.customer,
        shipping: order.shipping,
        address: order.address,
        phone: order.phone,
        cartItems: order.cartItems.map((item: any) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          priceAtPurchase: item.priceAtPurchase,
          productDetails: {
            title: item.productDetails?.title || 'Unknown Product',
            price: item.productDetails?.price || 0,
            media: item.productDetails?.media || []
          }
        })),
        totalAmount: order.totalAmount,
        couponCode: order.couponCode,
        discountAmount: order.discountAmount,
        status: order.status || 'pending',
        createdAt: order.createdAt || new Date().toISOString()
      }));

      setOrders(processedOrders);
    } catch (err) {
      console.error("Order fetch failed:", err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push("/sign-in");
      return;
    }

    fetchOrders(user.id);
  }, [user, isLoaded, router]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-heading3-bold mb-4">Error Loading Orders</h2>
        <p className="text-body-medium text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => user && fetchOrders(user.id)}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-heading3-bold mb-4">No Orders Found</h2>
        <p className="text-body-medium mb-6 max-w-md">
          You haven't placed any orders yet. Start shopping to see your orders here.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-heading2-bold mb-8">Your Orders</h1>

      <div className="space-y-6">
      
{orders.map((order) => (
  <div
    key={order.id}
    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
  >
    {/* Order Header - Add the Details button here */}
    <div className="bg-gray-50 px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h2 className="text-body-bold">
          Order #<span className="font-mono">{order.id.slice(-6).toUpperCase()}</span>
        </h2>
        <p className="text-small-medium text-gray-600">
          Placed on {formatDate(order.createdAt)}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-small-bold hidden sm:inline">Status:</span>
        <span className={`text-small-medium capitalize px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
        <Link        href={`/orders/${order.id}`}
          className="text-small-medium bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors"
        >
          Details
        </Link>
      </div>
    </div>

    {/* ... rest of your existing order item code remains the same ... */}
  </div>
))}
      </div>
    </div>
  );
};

export default OrdersPage;