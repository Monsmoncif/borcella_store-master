'use client';

import { useState } from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';
import useCart from '@/lib/hooks/useCart';
import Image from 'next/image';

type VariantType = {
  color: string;
  size: string;
  quantity: number;
};

type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: string[];
  price: number;
  expense: number;
  categories: { _id: string; title: string }[];
  collections: { _id: string; title: string }[];
  variants: VariantType[];
  promotion?: string | null;
  promotionStart?: Date | null;
  promotionEnd?: Date | null;
};

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {
  // Get all unique colors and sizes from variants
  const colors = [...new Set(productInfo.variants.map(v => v.color))];
  const sizes = [...new Set(productInfo.variants.map(v => v.size))];
  
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Get available quantity for selected color/size
  const selectedVariant = productInfo.variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  );
  const availableQuantity = selectedVariant?.quantity || 0;

  const cart = useCart();

  // Calculate price considering promotion
const currentPrice = productInfo.promotion 
  ? productInfo.price * (1 - parseFloat(productInfo.promotion) / 100)
  : productInfo.price;

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800/90 mb-4">
        {productInfo.title}
      </h1>

      <p className="text-gray-600 mt-2">
        {productInfo.description}
      </p>

      <div className="mt-6">
        {productInfo.promotion ? (
          <div className="flex items-center gap-2">
            <p className="text-3xl font-medium text-orange-600">
              ${parseFloat(currentPrice).toFixed(2)}Da
            </p>
            <p className="text-lg line-through text-gray-500">
              {productInfo.price}Da
            </p>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
              Sale
            </span>
          </div>
        ) : (
          <p className="text-3xl font-medium text-orange-600">
            {currentPrice}Da
          </p>
        )}
      </div>

      <hr className="bg-gray-600 my-6" />

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse w-full max-w-72">
          <tbody>
            <tr>
              <td className="text-gray-600 font-medium">Collection</td>
              <td className="text-gray-800/50">
                {productInfo.collections.map(col => col.title).join(', ')}
              </td>
            </tr>
            <tr>
              <td className="text-gray-600 font-medium">Available Colors</td>
              <td className="text-gray-800/50">
                {colors.join(', ')}
              </td>
            </tr>
            <tr>
              <td className="text-gray-600 font-medium">Available Sizes</td>
              <td className="text-gray-800/50">
                {sizes.join(', ')}
              </td>
            </tr>
            <tr>
              <td className="text-gray-600 font-medium">Category</td>
              <td className="text-gray-800/50">
                {productInfo.categories.map(cat => cat.title).join(', ')}
              </td>
            </tr>
            <tr>
              <td className="text-gray-600 font-medium">Available Stock</td>
              <td className="text-gray-800/50">
                {availableQuantity} items
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Color and Size Selectors */}
      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-2 font-medium">Color:</p>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <button
                key={color}
                className={`px-3 py-1 rounded-full border ${
                  selectedColor === color 
                    ? 'border-orange-500 bg-orange-100' 
                    : 'border-gray-300'
                }`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2 font-medium">Size:</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button
                key={size}
                className={`px-3 py-1 rounded border ${
                  selectedSize === size 
                    ? 'border-orange-500 bg-orange-100' 
                    : 'border-gray-300'
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-1 font-medium">Quantity:</p>
        <div className="flex items-center gap-4">
          <MinusCircle
            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-red-500 transition"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          />
          <span className="text-lg font-semibold">{quantity}</span>
          <PlusCircle
            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-green-500 transition"
            onClick={() => quantity < availableQuantity && setQuantity(quantity + 1)}
          />
        </div>
        {availableQuantity < 5 && (
          <p className="text-sm text-orange-600 mt-1">
            Only {availableQuantity} left in stock!
          </p>
        )}
      </div>

      <div className="flex items-center mt-10 gap-4">
        <button
          className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
          onClick={() => {
            if (availableQuantity > 0) {
              cart.addItem({
                item: productInfo,
                quantity,
                color: selectedColor,
                size: selectedSize,
              });
            }
          }}
          disabled={availableQuantity === 0}
        >
          {availableQuantity > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
        </button>
        <button 
          className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
          disabled={availableQuantity === 0}
        >
          Buy now
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;