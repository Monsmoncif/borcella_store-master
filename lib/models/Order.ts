import mongoose from 'mongoose';

const ProductDetailsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  media: {
    type: [String],
    required: [true, 'At least one media item is required'],
    validate: {
      validator: (media: string[]) => media.length > 0,
      message: 'At least one media item is required'
    }
  }
}, { _id: false });

const OrderItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  color: String,
  size: String,
  priceAtPurchase: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  productDetails: {
    type: ProductDetailsSchema,
    required: true
  }
});

const OrderSchema = new mongoose.Schema({
  customer: {
    clerkId: {
      type: String,
      required: true,
      index: true // Add index for better query performance
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email']
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    }
  },
  shipping: {
    wilaya: {
      type: String,
      required: true
    },
    commune: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Shipping price cannot be negative']
    }
  },
  address: {
    type: String,
    required: true,
    minlength: [10, 'Address must be at least 10 characters']
  },
  phone: {
    type: String,
    required: true,
    match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number']
  },
  cartItems: {
    type: [OrderItemSchema],
    required: true,
    validate: {
      validator: (items: any[]) => items.length > 0,
      message: 'At least one cart item is required'
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  couponCode: String,
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  status: {
    type: String,
    default: 'pending',
    enum: {
      values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      message: 'Invalid order status'
    }
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);