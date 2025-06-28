import { NextResponse } from 'next/server';
import Order from '@/lib/models/Order';
import { connectToDB } from '@/lib/mongoDB';

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  try {
    await connectToDB();
    
    const { orderId } = params;

    const order = await Order.findById(orderId).lean().exec();
    
    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify the requesting user has access to this order
    const url = new URL(req.url);
    const clerkId = url.searchParams.get('clerkId');
    
    if (clerkId && order.customer.clerkId !== clerkId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const serializedOrder = {
      ...order,
      _id: order._id.toString(),
      cartItems: order.cartItems.map(item => ({
        ...item,
        itemId: item.itemId.toString(),
        productDetails: {
          ...item.productDetails,
          _id: item.productDetails._id?.toString(),
          media: item.productDetails.media || []
        }
      }))
    };

    return NextResponse.json(serializedOrder, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    console.error('[ORDER_GET_ERROR]', error);
    return NextResponse.json(
      {
        message: error.message || 'Failed to fetch order',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
  try {
    await connectToDB();
    
    const { orderId } = params;
    const body = await req.json();
    
    // Validate the update
    if (body.status && !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(body.status)) {
      throw new Error('Invalid status value');
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: body },
      { new: true }
    ).lean().exec();

    if (!updatedOrder) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    const serializedOrder = {
      ...updatedOrder,
      _id: updatedOrder._id.toString(),
      cartItems: updatedOrder.cartItems.map(item => ({
        ...item,
        itemId: item.itemId.toString(),
        productDetails: {
          ...item.productDetails,
          _id: item.productDetails._id?.toString(),
          media: item.productDetails.media || []
        }
      }))
    };

    return NextResponse.json(serializedOrder, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    console.error('[ORDER_UPDATE_ERROR]', error);
    return NextResponse.json(
      {
        message: error.message || 'Failed to update order',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 400 }
    );
  }
}