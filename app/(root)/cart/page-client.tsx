// 'use client';

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import { MinusCircle, PlusCircle, Trash } from "lucide-react";
// import Image from "next/image";
// import useCart from "@/lib/hooks/useCart";
// import { Coupon } from "@/lib/types";
// import { ShippingOption, Commune } from "@/lib/types";

// export default function CartPageClient({ 
//   initialCoupons = [],
//   initialShippingOptions = [] 
// }: { 
//   initialCoupons?: Coupon[];
//   initialShippingOptions?: ShippingOption[];
// }) {
//   const router = useRouter();
//   const { user } = useUser();
//   const cart = useCart();
//   const [isClient, setIsClient] = useState(false);

//   // State declarations
//   const [showModal, setShowModal] = useState(false);
//   const [address, setAddress] = useState("");
//   const [name, setName] = useState("");
//   const [firstname, setFirstname] = useState("");
//   const [phone, setPhone] = useState("");
//   const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
//   const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
//   const [couponCode, setCouponCode] = useState("");
//   const [couponError, setCouponError] = useState("");
//   const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
//   const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>(initialShippingOptions);
//   const [selectedWilaya, setSelectedWilaya] = useState("");
//   const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);
//   const [communes, setCommunes] = useState<Commune[]>([]);
//   const [shippingPrice, setShippingPrice] = useState(0);

//   useEffect(() => {
//     setIsClient(true);
//     console.log('Shipping options in client:', initialShippingOptions);
//   }, [initialShippingOptions]);

//   // Calculate cart total
//   const total = cart.cartItems.reduce(
//     (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
//     0
//   );
//   const totalRounded = parseFloat(total.toFixed(2));

//   const handleWilayaChange = (wilaya: string) => {
//     setSelectedWilaya(wilaya);
//     const selectedWilayaData = shippingOptions.find(w => w.wilaya === wilaya);
//     const newCommunes = selectedWilayaData?.communes || [];
//     setCommunes(newCommunes);
//     setSelectedCommune(null);
//     setShippingPrice(0);
//   };

//   const handleCommuneChange = (communeName: string) => {
//     const commune = communes.find(c => c.name === communeName);
//     setSelectedCommune(commune || null);
//     setShippingPrice(commune?.price || 0);
//   };

//   const calculateDiscount = () => {
//     if (!appliedCoupon) return 0;

//     if (appliedCoupon.discountValue >= 1) {
//       return Math.min(appliedCoupon.discountValue, totalRounded);
//     } else {
//       return totalRounded * appliedCoupon.discountValue;
//     }
//   };

//   const discount = calculateDiscount();
//   const finalTotal = Math.max(0, totalRounded - discount + shippingPrice);

//   const handleApplyCoupon = async () => {
//     setCouponError("");
//     setIsApplyingCoupon(true);
//     const code = couponCode.trim();
    
//     if (!code) {
//       setCouponError("Please enter a coupon code");
//       setIsApplyingCoupon(false);
//       return;
//     }

//     try {
//       let coupon = coupons.find(c => 
//         c.code.toLowerCase() === code.toLowerCase() && c.isActive
//       );

//       if (!coupon) {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons/${code}`);
//         if (res.ok) {
//           coupon = await res.json();
//           setCoupons(prev => [...prev, coupon!]);
//         }
//       }

//       if (!coupon) {
//         setCouponError("Invalid or inactive coupon code");
//         return;
//       }

//       if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
//         setCouponError("This coupon has expired");
//         return;
//       }

//       if (totalRounded < coupon.minimumAmount) {
//         setCouponError(`Minimum purchase of $${coupon.minimumAmount} required`);
//         return;
//       }

//       setAppliedCoupon(coupon);
//       setCouponError("");
//     } catch (error) {
//       console.error("Error applying coupon:", error);
//       setCouponError("Failed to apply coupon. Please try again.");
//     } finally {
//       setIsApplyingCoupon(false);
//     }
//   };

//   const handleRemoveCoupon = () => {
//     setAppliedCoupon(null);
//     setCouponCode("");
//     setCouponError("");
//   };

//   const openModal = () => {
//     if (!user) {
//       router.push("/sign-in");
//     } else if (cart.cartItems.length > 0 && selectedWilaya && selectedCommune) {
//       setShowModal(true);
//     }
//   };

//   const handleCheckout = async () => {
//     try {
//       if (!selectedCommune) {
//         setCouponError("Please select a commune");
//         return;
//       }

//       const res = await fetch("/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           customer: {
//             clerkId: user?.id,
//             email: user?.emailAddresses[0].emailAddress,
//             name: `${firstname} ${name}`,
//           },
//           shipping: {
//             wilaya: selectedWilaya,
//             commune: selectedCommune.name,
//             price: selectedCommune.price,
//           },
//           address,
//           phone,
//           cartItems: cart.cartItems.map(item => ({
//             itemId: item.item._id,
//             quantity: item.quantity,
//             color: item.color,
//             size: item.size
//           })),
//           totalAmount: finalTotal,
//           couponCode: appliedCoupon?.code || null,
//           discountAmount: discount,
//         }),
//       });

//       if (res.ok) {
//         cart.clearCart();
//         router.push("/orders");
//       } else {
//         const errorData = await res.json();
//         setCouponError(errorData.message || "Order creation failed");
//       }
//     } catch (err) {
//       console.error("[order_POST]", err);
//       setCouponError("An error occurred during checkout");
//     }
//   };

//   return (
//     <div className="container mx-auto py-8">
//       <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
//         {/* Cart Items Section */}
//         <div className="w-2/3 max-lg:w-full">
//           <p className="text-heading3-bold">Shopping Cart</p>
//           <hr className="my-6" />

//           {cart.cartItems.length === 0 ? (
//             <p className="text-body-bold">No items in cart</p>
//           ) : (
//             <div>
//               {cart.cartItems.map((cartItem) => {
//                 const variant = cartItem.item.variants.find(
//                   v => v.color === cartItem.color && v.size === cartItem.size
//                 );
//                 const availableQuantity = variant?.quantity || 0;

//                 return (
//                   <div
//                     key={`${cartItem.item._id}-${cartItem.color}-${cartItem.size}`}
//                     className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between"
//                   >
//                     <div className="flex items-center">
//                       <Image
//                         src={cartItem.item.media[0]}
//                         width={100}
//                         height={100}
//                         className="rounded-lg w-32 h-32 object-cover"
//                         alt="product"
//                       />
//                       <div className="flex flex-col gap-3 ml-4">
//                         <p className="text-body-bold">{cartItem.item.title}</p>
//                         {cartItem.color && (
//                           <p className="text-small-medium">Color: {cartItem.color}</p>
//                         )}
//                         {cartItem.size && (
//                           <p className="text-small-medium">Size: {cartItem.size}</p>
//                         )}
//                         <p className="text-small-medium">
//                           ${cartItem.item.price.toFixed(2)}
//                         </p>
//                         <p className="text-xs text-orange-600">
//                           {availableQuantity > 0 
//                             ? `${availableQuantity} available in stock`
//                             : "Out of stock"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex gap-4 items-center">
//                       <MinusCircle
//                         className={`hover:text-red-1 cursor-pointer ${
//                           cartItem.quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
//                         }`}
//                         onClick={() => cart.decreaseQuantity(cartItem.item._id)}
//                       />
//                       <p className="text-body-bold">{cartItem.quantity}</p>
//                       <PlusCircle
//                         className={`hover:text-red-1 cursor-pointer ${
//                           cartItem.quantity >= availableQuantity ? "opacity-50 cursor-not-allowed" : ""
//                         }`}
//                         onClick={() => {
//                           if (cartItem.quantity < availableQuantity) {
//                             cart.increaseQuantity(cartItem.item._id);
//                           }
//                         }}
//                       />
//                     </div>

//                     <div className="flex items-center gap-4">
//                       <p className="text-body-bold">
//                         ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
//                       </p>
//                       <Trash
//                         className="hover:text-red-1 cursor-pointer"
//                         onClick={() => cart.removeItem(cartItem.item._id, cartItem.color, cartItem.size)}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Order Summary Section */}
//         <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
//           <p className="text-heading4-bold pb-4">
//             Summary{" "}
//             <span>{`(${cart.cartItems.length} ${
//               cart.cartItems.length > 1 ? "items" : "item"
//             })`}</span>
//           </p>
          
//           {/* Coupon Section */}
//           <div className="flex flex-col gap-2">
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Enter coupon code"
//                 className="border p-2 rounded flex-1"
//                 value={couponCode}
//                 onChange={(e) => setCouponCode(e.target.value)}
//                 disabled={!!appliedCoupon}
//               />
//               {appliedCoupon ? (
//                 <button
//                   className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                   onClick={handleRemoveCoupon}
//                 >
//                   Remove
//                 </button>
//               ) : (
//                 <button
//                   className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
//                   onClick={handleApplyCoupon}
//                   disabled={isApplyingCoupon}
//                 >
//                   {isApplyingCoupon ? "Applying..." : "Apply"}
//                 </button>
//               )}
//             </div>
//             {couponError && <p className="text-red-500 text-sm">{couponError}</p>}
//             {appliedCoupon && (
//               <div className="text-green-600 text-sm">
//                 <p>Coupon applied: {appliedCoupon.code}</p>
//                 {appliedCoupon.description && (
//                   <p className="text-xs">{appliedCoupon.description}</p>
//                 )}
//                 <p className="text-xs">
//                   {appliedCoupon.discountValue < 1 
//                     ? `${appliedCoupon.discountValue * 100}% discount`
//                     : `$${appliedCoupon.discountValue} off`}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Shipping Section */}
//           <div className="flex flex-col gap-4">
//             <h3 className="text-body-bold">Shipping Information</h3>
            
//             {isClient && (
//               <>
//                 <div className="flex flex-col gap-2">
//                   <label htmlFor="wilaya" className="text-small-medium">Wilaya</label>
//                   <select
//                     id="wilaya"
//                     className="border p-2 rounded"
//                     value={selectedWilaya}
//                     onChange={(e) => handleWilayaChange(e.target.value)}
//                     required
//                   >
//                     <option value="">Select Wilaya</option>
//                     {shippingOptions.map((option) => (
//                       <option key={option._id} value={option.wilaya}>
//                         {option.wilaya}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {selectedWilaya && (
//                   <div className="flex flex-col gap-2">
//                     <label htmlFor="commune" className="text-small-medium">Commune</label>
//                     <select
//                       id="commune"
//                       className="border p-2 rounded"
//                       value={selectedCommune?.name || ""}
//                       onChange={(e) => handleCommuneChange(e.target.value)}
//                       required
//                     >
//                       <option value="">Select Commune</option>
//                       {communes.map((commune) => (
//                         <option key={commune.name} value={commune.name}>
//                           {commune.name} (${commune.price.toFixed(2)})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Order Totals */}
//           <div className="flex justify-between text-body-semibold">
//             <span>Subtotal</span>
//             <span>$ {totalRounded.toFixed(2)}</span>
//           </div>
          
//           {appliedCoupon && (
//             <div className="flex justify-between text-body-semibold">
//               <span>Discount</span>
//               <span className="text-green-600">
//                 - $ {discount.toFixed(2)}
//               </span>
//             </div>
//           )}

//           <div className="flex justify-between text-body-semibold">
//             <span>Shipping</span>
//             <span>$ {shippingPrice.toFixed(2)}</span>
//           </div>

//           <hr className="my-2" />

//           <div className="flex justify-between text-heading4-bold pt-2">
//             <span>Total</span>
//             <span>$ {finalTotal.toFixed(2)}</span>
//           </div>

//           <button
//             className={`border rounded-lg text-body-bold py-3 w-full ${
//               cart.cartItems.length > 0 && selectedWilaya && selectedCommune
//                 ? "bg-black text-white hover:bg-gray-800"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//             onClick={openModal}
//             disabled={cart.cartItems.length === 0 || !selectedWilaya || !selectedCommune}
//           >
//             Proceed to Checkout
//           </button>
//         </div>
//       </div>

//       {/* Checkout Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md">
//             <h2 className="text-heading4-bold mb-4">Enter your information</h2>
//             <div className="flex flex-col gap-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <input
//                     type="text"
//                     placeholder="First Name"
//                     className="border p-2 rounded w-full"
//                     value={firstname}
//                     onChange={(e) => setFirstname(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <input
//                     type="text"
//                     placeholder="Last Name"
//                     className="border p-2 rounded w-full"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>

//               <input
//                 type="tel"
//                 placeholder="Phone Number"
//                 className="border p-2 rounded"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 required
//               />

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="col-span-2">
//                   <label className="block text-sm font-medium mb-1">Wilaya</label>
//                   <div className="border p-2 rounded bg-gray-50">
//                     {selectedWilaya}
//                   </div>
//                 </div>

//                 <div className="col-span-2">
//                   <label className="block text-sm font-medium mb-1">Commune</label>
//                   <div className="border p-2 rounded bg-gray-50">
//                     {selectedCommune?.name} (${selectedCommune?.price.toFixed(2)})
//                   </div>
//                 </div>
//               </div>

//               <textarea
//                 placeholder="Detailed Address (Street, Building, etc.)"
//                 className="border p-2 rounded w-full"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 rows={3}
//                 required
//               />

//               {appliedCoupon && (
//                 <div className="bg-green-50 p-3 rounded">
//                   <p className="text-green-700 text-sm">
//                     Coupon <strong>{appliedCoupon.code}</strong> applied (-${discount.toFixed(2)})
//                   </p>
//                 </div>
//               )}

//               <div className="flex justify-between text-body-bold">
//                 <span>Total:</span>
//                 <span>${finalTotal.toFixed(2)}</span>
//               </div>

//               <div className="flex justify-end gap-4 mt-4">
//                 <button
//                   className="text-gray-500 hover:underline px-4 py-2"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`px-4 py-2 rounded ${
//                     !phone || !address || !firstname || !name
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                       : "bg-black text-white hover:bg-gray-800"
//                   }`}
//                   onClick={() => {
//                     setShowModal(false);
//                     handleCheckout();
//                   }}
//                   disabled={!phone || !address || !firstname || !name}
//                 >
//                   Confirm Order
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import useCart from "@/lib/hooks/useCart";
import { Coupon, ShippingOption, Commune } from "@/lib/types";

export default function CartPageClient({ 
  initialCoupons = [],
  initialShippingOptions = [] 
}: { 
  initialCoupons?: Coupon[];
  initialShippingOptions?: ShippingOption[];
}) {
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState("");

  // State declarations
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [phone, setPhone] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>(initialShippingOptions);
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate cart total
  const total = cart.cartItems.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );
  const totalRounded = parseFloat(total.toFixed(2));

  const handleWilayaChange = (wilaya: string) => {
    setSelectedWilaya(wilaya);
    const selectedWilayaData = shippingOptions.find(w => w.wilaya === wilaya);
    const newCommunes = selectedWilayaData?.communes || [];
    setCommunes(newCommunes);
    setSelectedCommune(null);
    setShippingPrice(0);
  };

  const handleCommuneChange = (communeName: string) => {
    const commune = communes.find(c => c.name === communeName);
    setSelectedCommune(commune || null);
    setShippingPrice(commune?.price || 0);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.discountValue >= 1) {
      return Math.min(appliedCoupon.discountValue, totalRounded);
    } else {
      return totalRounded * appliedCoupon.discountValue;
    }
  };

  const discount = calculateDiscount();
  const finalTotal = Math.max(0, totalRounded - discount + shippingPrice);

  const handleApplyCoupon = async () => {
    setCouponError("");
    setIsApplyingCoupon(true);
    const code = couponCode.trim();
    
    if (!code) {
      setCouponError("Please enter a coupon code");
      setIsApplyingCoupon(false);
      return;
    }

    try {
      let coupon = coupons.find(c => 
        c.code.toLowerCase() === code.toLowerCase() && c.isActive
      );

      if (!coupon) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons/${code}`);
        if (res.ok) {
          coupon = await res.json();
          setCoupons(prev => [...prev, coupon!]);
        }
      }

      if (!coupon) {
        setCouponError("Invalid or inactive coupon code");
        return;
      }

      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        setCouponError("This coupon has expired");
        return;
      }

      if (totalRounded < coupon.minimumAmount) {
        setCouponError(`Minimum purchase of $${coupon.minimumAmount} required`);
        return;
      }

      setAppliedCoupon(coupon);
      setCouponError("");
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Failed to apply coupon. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const openModal = () => {
    if (!user) {
      router.push("/sign-in");
    } else if (cart.cartItems.length === 0) {
      setError("Your cart is empty");
    } else if (!selectedWilaya || !selectedCommune) {
      setError("Please select shipping location");
    } else {
      setShowModal(true);
    }
  };

const handleCheckout = async () => {
  setIsProcessing(true);
  setError("");
  
  try {
    // Validate all required fields
    if (!firstname || !name) throw new Error("Please enter your full name");
    if (!phone || !/^[0-9]{10,15}$/.test(phone)) throw new Error("Please enter a valid phone number");
    if (!address || address.length < 10) throw new Error("Address must be at least 10 characters");
    if (!selectedWilaya || !selectedCommune) throw new Error("Please select shipping location");

    // Prepare cart items with product details
    const cartItems = cart.cartItems.map(item => ({
      itemId: item.item._id,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      priceAtPurchase: item.item.price,
      productDetails: {
        title: item.item.title,
        price: item.item.price,
        media: item.item.media || []
      }
    }));

    // Create the order
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: {
          clerkId: user?.id,
          email: user?.emailAddresses[0].emailAddress,
          name: `${firstname} ${name}`
        },
        shipping: {
          wilaya: selectedWilaya,
          commune: selectedCommune.name,
          price: shippingPrice
        },
        address,
        phone,
        cartItems,
        totalAmount: finalTotal,
        couponCode: appliedCoupon?.code || null,
        discountAmount: discount,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Order creation failed');
    }

    const result = await response.json();
    
    // Clear cart and redirect to order confirmation
    cart.clearCart();
    router.push(`/orders`);
    
  } catch (err: any) {
    console.error("Checkout error:", err);
    setError(err.message || "An error occurred during checkout");
  } finally {
    setIsProcessing(false);
  }
};


  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
        {/* Cart Items Section */}
        <div className="w-2/3 max-lg:w-full">
          <p className="text-heading3-bold">Shopping Cart</p>
          <hr className="my-6" />

          {cart.cartItems.length === 0 ? (
            <p className="text-body-bold">No items in cart</p>
          ) : (
            <div>
              {cart.cartItems.map((cartItem) => {
                const variant = cartItem.item.variants?.find(
                  (v: any) => v.color === cartItem.color && v.size === cartItem.size
                );
                const availableQuantity = variant?.quantity || 0;

                return (
                  <div
                    key={`${cartItem.item._id}-${cartItem.color}-${cartItem.size}`}
                    className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between"
                  >
                    <div className="flex items-center">
                      <Image
                        src={cartItem.item.media[0]}
                        width={100}
                        height={100}
                        className="rounded-lg w-32 h-32 object-cover"
                        alt={cartItem.item.title}
                        priority
                      />
                      <div className="flex flex-col gap-3 ml-4">
                        <p className="text-body-bold">{cartItem.item.title}</p>
                        {cartItem.color && (
                          <p className="text-small-medium">Color: {cartItem.color}</p>
                        )}
                        {cartItem.size && (
                          <p className="text-small-medium">Size: {cartItem.size}</p>
                        )}
                        <p className="text-small-medium">
                          ${cartItem.item.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-orange-600">
                          {availableQuantity > 0 
                            ? `${availableQuantity} available in stock`
                            : "Out of stock"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-center">
                      <MinusCircle
                        className={`hover:text-red-1 cursor-pointer ${
                          cartItem.quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => cart.decreaseQuantity(cartItem.item._id)}
                      />
                      <p className="text-body-bold">{cartItem.quantity}</p>
                      <PlusCircle
                        className={`hover:text-red-1 cursor-pointer ${
                          cartItem.quantity >= availableQuantity ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => {
                          if (cartItem.quantity < availableQuantity) {
                            cart.increaseQuantity(cartItem.item._id);
                          }
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-body-bold">
                        ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                      </p>
                      <Trash
                        className="hover:text-red-1 cursor-pointer"
                        onClick={() => cart.removeItem(cartItem.item._id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
          <p className="text-heading4-bold pb-4">
            Summary{" "}
            <span>{`(${cart.cartItems.length} ${
              cart.cartItems.length > 1 ? "items" : "item"
            })`}</span>
          </p>
          
          {/* Coupon Section */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="border p-2 rounded flex-1"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={!!appliedCoupon}
              />
              {appliedCoupon ? (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleRemoveCoupon}
                >
                  Remove
                </button>
              ) : (
                <button
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </button>
              )}
            </div>
            {couponError && <p className="text-red-500 text-sm">{couponError}</p>}
            {appliedCoupon && (
              <div className="text-green-600 text-sm">
                <p>Coupon applied: {appliedCoupon.code}</p>
                {appliedCoupon.description && (
                  <p className="text-xs">{appliedCoupon.description}</p>
                )}
                <p className="text-xs">
                  {appliedCoupon.discountValue < 1 
                    ? `${appliedCoupon.discountValue * 100}% discount`
                    : `$${appliedCoupon.discountValue} off`}
                </p>
              </div>
            )}
          </div>

          {/* Shipping Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-body-bold">Shipping Information</h3>
            
            {isClient && (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="wilaya" className="text-small-medium">Wilaya</label>
                  <select
                    id="wilaya"
                    className="border p-2 rounded"
                    value={selectedWilaya}
                    onChange={(e) => handleWilayaChange(e.target.value)}
                    required
                  >
                    <option value="">Select Wilaya</option>
                    {shippingOptions.map((option) => (
                      <option key={option._id} value={option.wilaya}>
                        {option.wilaya}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedWilaya && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="commune" className="text-small-medium">Commune</label>
                    <select
                      id="commune"
                      className="border p-2 rounded"
                      value={selectedCommune?.name || ""}
                      onChange={(e) => handleCommuneChange(e.target.value)}
                      required
                    >
                      <option value="">Select Commune</option>
                      {communes.map((commune) => (
                        <option key={commune.name} value={commune.name}>
                          {commune.name} (${commune.price.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Order Totals */}
          <div className="flex justify-between text-body-semibold">
            <span>Subtotal</span>
            <span>$ {totalRounded.toFixed(2)}</span>
          </div>
          
          {appliedCoupon && (
            <div className="flex justify-between text-body-semibold">
              <span>Discount</span>
              <span className="text-green-600">
                - $ {discount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-body-semibold">
            <span>Shipping</span>
            <span>$ {shippingPrice.toFixed(2)}</span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between text-heading4-bold pt-2">
            <span>Total</span>
            <span>$ {finalTotal.toFixed(2)}</span>
          </div>

          <button
            className={`border rounded-lg text-body-bold py-3 w-full ${
              cart.cartItems.length > 0 && selectedWilaya && selectedCommune
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={openModal}
            disabled={cart.cartItems.length === 0 || !selectedWilaya || !selectedCommune}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md">
            <h2 className="text-heading4-bold mb-4">Enter your information</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="border p-2 rounded w-full"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="border p-2 rounded w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <input
                type="tel"
                placeholder="Phone Number (e.g., 0550123456)"
                className="border p-2 rounded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="[0-9]{10,15}"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Wilaya</label>
                  <div className="border p-2 rounded bg-gray-50">
                    {selectedWilaya}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Commune</label>
                  <div className="border p-2 rounded bg-gray-50">
                    {selectedCommune?.name} (${selectedCommune?.price.toFixed(2)})
                  </div>
                </div>
              </div>

              <textarea
                placeholder="Detailed Address (Street, Building, etc.) - at least 10 characters"
                className="border p-2 rounded w-full"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                required
                minLength={10}
              />

              {appliedCoupon && (
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-green-700 text-sm">
                    Coupon <strong>{appliedCoupon.code}</strong> applied (-${discount.toFixed(2)})
                  </p>
                </div>
              )}

              <div className="flex justify-between text-body-bold">
                <span>Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  className="text-gray-500 hover:underline px-4 py-2"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                  }}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    !phone || !address || !firstname || !name || isProcessing
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                  onClick={handleCheckout}
                  disabled={!phone || !address || !firstname || !name || isProcessing}
                >
                  {isProcessing ? "Processing..." : "Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}