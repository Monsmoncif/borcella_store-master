// app/coupons/page.tsx
import { Coupon } from "@/lib/types"; // Define your Coupon type

async function getCoupons() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch coupons');
  }
  
  return res.json();
}

export default async function CouponsPage() {
  try {
    const coupons: Coupon[] = await getCoupons();

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Available Coupons</h1>
        
        {coupons.length === 0 ? (
          <p className="text-gray-500">No coupons available</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon) => (
              <CouponCard key={coupon._id} coupon={coupon} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Coupons</h1>
        <p className="text-red-500 text-xl">
          Failed to load coupons. Please try again later.
        </p>
      </div>
    );
  }
}

// Coupon Card Component
function CouponCard({ coupon }: { coupon: Coupon }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{coupon.code}</h2>
          {coupon.description && (
            <p className="text-gray-600 mt-1">{coupon.description}</p>
          )}
          <div className="mt-3">
            <span className={`px-2 py-1 rounded text-sm ${
              coupon.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {coupon.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">
            {coupon.discountValue < 1 
              ? `${coupon.discountValue * 100}% OFF` 
              : `$${coupon.discountValue} OFF`}
          </p>
          <p className="text-sm text-gray-500">
            Min. spend: ${coupon.minimumAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {coupon.expiresAt && (
        <p className="mt-3 text-sm text-gray-500">
          Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}