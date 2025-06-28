'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface ProductDetails {
  title: string;
  price: number;
  media: string[];
  _id?: string;
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
    method?: string;
    trackingNumber?: string;
  };
  address: string;
  phone: string;
  cartItems: OrderItem[];
  totalAmount: number;
  couponCode?: string;
  discountAmount?: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  paymentMethod?: string;
  paymentStatus?: string;
}

const OrderDetailsPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchOrder = async (orderId: string) => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate and process order
      const processedOrder: Order = {
        id: data._id || data.id,
        customer: data.customer,
        shipping: data.shipping,
        address: data.address,
        phone: data.phone,
        cartItems: data.cartItems.map((item: any) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          priceAtPurchase: item.priceAtPurchase,
          productDetails: {
            title: item.productDetails?.title || 'Unknown Product',
            price: item.productDetails?.price || 0,
            media: item.productDetails?.media || [],
            _id: item.productDetails?._id
          }
        })),
        totalAmount: data.totalAmount,
        couponCode: data.couponCode,
        discountAmount: data.discountAmount,
        status: data.status || 'pending',
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus
      };

      setOrder(processedOrder);
    } catch (err) {
      console.error("Order fetch failed:", err);
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || order.status !== 'pending') return;
    
    try {
      setIsCancelling(true);
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'cancelled'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      const updatedOrder = await response.json();
      setOrder(prev => prev ? {...prev, status: updatedOrder.status} : null);
    } catch (err) {
      console.error("Order cancellation failed:", err);
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push("/sign-in");
      return;
    }

    fetchOrder(orderId);
  }, [user, isLoaded, router, orderId]);

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
        <h2 className="text-heading3-bold mb-4">Error Loading Order</h2>
        <p className="text-body-medium text-red-500 mb-4">{error}</p>
        <div className="flex gap-4">
          <button 
            onClick={() => fetchOrder(orderId)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Try Again
          </button>
          <button 
            onClick={() => router.push("/orders")}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-heading3-bold mb-4">Order Not Found</h2>
        <p className="text-body-medium mb-6 max-w-md">
          We couldn't find the order you're looking for. It may have been cancelled or doesn't exist.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/orders")}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            View All Orders
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-200 text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/orders" className="text-body-medium text-gray-600 hover:text-black flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-heading2-bold">
          Order #<span className="font-mono">{order.id.slice(-8).toUpperCase()}</span>
        </h1>
        
        <div className="flex items-center gap-4">
          <span className={`text-body-medium capitalize px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          
          {order.status === 'pending' && (
            <button
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="bg-red-100 text-red-800 px-4 py-2 rounded-full hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b">
              <h2 className="text-body-bold">Order Items</h2>
            </div>
            <div className="divide-y">
              {order.cartItems.map((cartItem, index) => (
                <div
                  key={`${cartItem.itemId}-${index}`}
                  className="p-6 flex gap-6 hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    {cartItem.productDetails.media[0] ? (
                      <Link href={`/products/${cartItem.productDetails._id}`}>
                        <Image
                          src={cartItem.productDetails.media[0]}
                          width={120}
                          height={120}
                          className="rounded-md object-cover w-30 h-30"
                          alt={cartItem.productDetails.title}
                          priority={index < 3}
                        />
                      </Link>
                    ) : (
                      <div className="w-30 h-30 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <Link href={`/products/${cartItem.productDetails._id}`}>
                      <h3 className="text-body-bold line-clamp-2 hover:text-blue-600">
                        {cartItem.productDetails.title}
                      </h3>
                    </Link>
                    
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-small-medium text-gray-500">Price</p>
                        <p className="text-body-medium">${cartItem.priceAtPurchase.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-small-medium text-gray-500">Quantity</p>
                        <p className="text-body-medium">{cartItem.quantity}</p>
                      </div>
                      <div>
                        <p className="text-small-medium text-gray-500">Subtotal</p>
                        <p className="text-body-medium">
                          ${(cartItem.priceAtPurchase * cartItem.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-3">
                      {cartItem.color && (
                        <div className="flex items-center gap-2">
                          <span className="text-small text-gray-500">Color:</span>
                          <span className="text-small-bold capitalize flex items-center gap-1">
                            <span 
                              className="inline-block w-4 h-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: cartItem.color.toLowerCase() }}
                            ></span>
                            {cartItem.color}
                          </span>
                        </div>
                      )}
                      
                      {cartItem.size && (
                        <div className="flex items-center gap-2">
                          <span className="text-small text-gray-500">Size:</span>
                          <span className="text-small-bold uppercase">{cartItem.size}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping and Tracking */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b">
              <h2 className="text-body-bold">Shipping & Tracking</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-body-medium mb-3">Shipping Address</h3>
                  <div className="space-y-2">
                    <p className="text-body-medium">{order.customer.name}</p>
                    <p className="text-body-medium">{order.address}</p>
                    <p className="text-body-medium capitalize">
                      {order.shipping.commune}, {order.shipping.wilaya}
                    </p>
                    <p className="text-body-medium">{order.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-body-medium mb-3">Shipping Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-small-medium text-gray-500">Method:</span>
                      <span className="text-body-medium capitalize">
                        {order.shipping.method || 'Standard Shipping'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-small-medium text-gray-500">Cost:</span>
                      <span className="text-body-medium">
                        ${order.shipping.price.toFixed(2)}
                      </span>
                    </div>
                    {order.shipping.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-small-medium text-gray-500">Tracking:</span>
                        <span className="text-body-medium font-mono">
                          {order.shipping.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-8">
            <div className="px-6 py-4 border-b">
              <h2 className="text-body-bold">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-body-medium">Order Date</span>
                  <span className="text-body-medium">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                
                {order.updatedAt && order.updatedAt !== order.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-body-medium">Last Updated</span>
                    <span className="text-body-medium">
                      {formatDate(order.updatedAt)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-body-medium">Payment Method</span>
                  <span className="text-body-medium capitalize">
                    {order.paymentMethod || 'Not specified'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-body-medium">Payment Status</span>
                  <span className={`text-body-medium capitalize ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 
                    order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus || 'pending'}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-body-medium">Subtotal</span>
                    <span className="text-body-medium">
                      ${(order.totalAmount - order.shipping.price + (order.discountAmount || 0)).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <span className="text-body-medium">Shipping</span>
                    <span className="text-body-medium">
                      ${order.shipping.price.toFixed(2)}
                    </span>
                  </div>
                  
                  {order.discountAmount && order.discountAmount > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span className="text-body-medium">Discount ({order.couponCode})</span>
                      <span className="text-body-medium">
                        -${order.discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-4 mt-2 border-t border-gray-200">
                    <span className="text-body-bold">Total</span>
                    <span className="text-heading4-bold">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              {order.status === 'shipped' && order.shipping.trackingNumber && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-body-medium mb-3">Track Your Order</h3>
                  <button
                    onClick={() => {
                      // This would open the tracking in a new window with the carrier's site
                      window.open(`https://tracking.example.com/?tracking=${order.shipping.trackingNumber}`, '_blank');
                    }}
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Track Package
                  </button>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-body-medium mb-3">Need Help?</h3>
                <p className="text-small-medium text-gray-600 mb-4">
                  If you have any questions about your order, please contact our customer service.
                </p>
                <button
                  onClick={() => router.push("/contact")}
                  className="w-full bg-gray-100 text-black py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;