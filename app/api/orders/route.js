// app/api/orders/route.js
import { NextResponse } from 'next/server';
import Order from '@/lib/models/Order';
import { connectToDB } from '@/lib/mongoDB';

export async function GET(req) {
  try {
    await connectToDB();
    
    const url = new URL(req.url);
    const clerkId = url.searchParams.get('clerkId');

    const query = clerkId ? { 'customer.clerkId': clerkId } : {};
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    
    if (!Array.isArray(orders)) {
      throw new Error('Invalid data format from database');
    }

    const serializedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      cartItems: order.cartItems.map(item => ({
        ...item,
        itemId: item.itemId.toString(),
        productDetails: {
          ...item.productDetails,
          media: item.productDetails.media || []
        }
      }))
    }));

    return NextResponse.json(serializedOrders, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    console.error('[ORDERS_GET_ERROR]', error);
    return NextResponse.json(
      {
        message: error.message || 'Failed to fetch orders',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    
    const body = await req.json();
    
    if (!body.customer?.clerkId || !body.cartItems || body.cartItems.length === 0) {
      throw new Error('Missing required fields');
    }

    const newOrder = new Order(body);
    const savedOrder = await newOrder.save();

    return NextResponse.json(
      { 
        success: true,
        order: {
          id: savedOrder._id.toString(),
          ...savedOrder.toObject()
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('[ORDER_POST_ERROR]', error);
    return NextResponse.json(
      {
        message: error.message || 'Failed to create order',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 400 }
    );
  }
}