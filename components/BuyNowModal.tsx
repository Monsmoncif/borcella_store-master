"use client";

import { useEffect } from "react";

interface BuyNowModalProps {
  product: ProductType;
  onClose: () => void;
}

const BuyNowModal = ({ product, onClose }: BuyNowModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Buy Now</h2>
        <p className="mb-2 font-medium">{product.title}</p>
        <p className="mb-4 text-sm text-gray-600">{product.description}</p>
        <p className="text-lg font-bold mb-4">${product.price}</p>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          onClick={() => {
            alert("Checkout not implemented");
            onClose();
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default BuyNowModal;
