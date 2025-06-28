type CollectionType = {
  _id: string;
  title: string;
  products: number;
  image: string;
};

type categoryType = {
  _id: string;
  title: string;
  products: number;
  image: string;
};


type sliderType = {
  _id: string;
  image: string;
};

type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: [string];
  category: string;
  collections: [string];
  tags: [string];
  price: number;
  cost: number;
  sizes: [string];
  colors: [string];
  createdAt: string;
  updatedAt: string;
};

type UserType = {
  clerkId: string;
  wishlist: [string];
  createdAt: string;
  updatedAt: string;
};

type OrderType = {
  shippingAddress: Object;
  _id: string;
  customerClerkId: string;
  products: [OrderItemType]
  shippingRate: string;
  totalAmount: number
}

type OrderItemType = {
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
  _id: string;
}


// types/coupon.ts
export type Coupon = {
  _id: string;
  code: string;
  discountValue: number;
  minimumAmount: number;
  isActive: boolean;
  appliesTo: string[];
  oneTimePerUser: boolean;
  expiresAt?: string;
  description?: string;
};


// types/shipping.ts
export type Commune = {
  name: string;
  price: number;
};

export type ShippingOption = {
  _id: string;
  wilaya: string;
  communes: Commune[];
};