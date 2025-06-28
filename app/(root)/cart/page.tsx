// // app/cart/page.tsx
// import { Coupon } from "@/lib/types";
// import { ShippingOption } from "@/lib/types";
// import CartPageClient from "./page-client";

// async function getCoupons() {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons`, {
//       cache: 'no-store',
//     });
//     return res.ok ? await res.json() : [];
//   } catch (error) {
//     console.error('Error fetching coupons:', error);
//     return [];
//   }
// }

// async function getShippingOptions() {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipings`, {
//       cache: 'no-store',
//     });
    
//     if (!res.ok) {
//       console.error('Failed to fetch shipping options:', res.status, res.statusText);
//       return [];
//     }
    
//     const data = await res.json();
//     console.log('Shipping options data:', data); // Add this line
//     return data;
//   } catch (error) {
//     console.error('Error fetching shipping options:', error);
//     return [];
//   }
// }

// export default async function CartPage() {
//   const [coupons, shippingOptions] = await Promise.all([
//     getCoupons(),
//     getShippingOptions()
//   ]);
  
//   return (
//     <CartPageClient 
//       initialCoupons={coupons}
//       initialShippingOptions={shippingOptions}
//     />
//   );
// }


import { Coupon } from "@/lib/types";
import { ShippingOption } from "@/lib/types";
import CartPageClient from "./page-client";

async function getCoupons() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.error('Failed to fetch coupons:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    console.log('Coupons data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }
}

async function getShippingOptions() {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/shipping`;
    console.log('Fetching shipping options from:', url);
    
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      console.error('Failed to fetch shipping options:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    console.log('Shipping options data:', data);
    
    // Validate data structure
    if (!Array.isArray(data)) {
      console.error('Invalid shipping options data format - expected array');
      return [];
    }
    
    return data.map((item: any) => ({
      _id: item._id,
      wilaya: item.wilaya,
      communes: Array.isArray(item.communes) 
        ? item.communes.map((c: any) => ({
            name: c.name,
            price: Number(c.price) || 0
          }))
        : []
    }));
  } catch (error) {
    console.error('Error fetching shipping options:', error);
    return [];
  }
}

export default async function CartPage() {
  const [coupons, shippingOptions] = await Promise.all([
    getCoupons(),
    getShippingOptions()
  ]);

  return (
    <CartPageClient 
      initialCoupons={coupons}
      initialShippingOptions={shippingOptions}
    />
  );
}