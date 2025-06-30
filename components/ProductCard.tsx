// "use client";

// import Image from "next/image";
// import { assets } from '@/assets/assets'
// import Link from "next/link";
// import HeartFavorite from "./HeartFavorite";



// interface ProductCardProps {
//   product: ProductType;
//   updateSignedInUser?: (updatedUser: UserType) => void;
// }

 

// const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
//   return (
//     // <div className="w-[220px]">
//     //   <Link
//     //     href={`/products/${product._id}`}
//     //     className="group block bg-white/80 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
//     //   >
//     //     <div className="relative w-full h-[250px]">
//     //       <Image
//     //         src={product.media[0]}
//     //         alt={product.title}
//     //         fill
//     //         className="object-cover transition-transform duration-300 group-hover:scale-105"
//     //       />
//     //     </div>

//     //     <div className="p-3 flex flex-col gap-1">
//     //       <h3 className="text-base font-semibold text-gray-800 truncate">
//     //         {product.title}
//     //       </h3>
//     //       <p className="text-sm text-gray-500">{product.category}</p>

//     //       <div className="mt-2 flex items-center justify-between">
//     //         <span className="text-lg font-bold text-gray-900">${product.price}</span>
//     //         <HeartFavorite product={product} updateSignedInUser={updateSignedInUser} />
            
//     //       </div>
//     //     </div>
//     //   </Link>
//     // </div>

//     <Link
//             href={`/products/${product._id}`}
//             className="flex flex-col items-start gap-1 w-[200px]  cursor-pointer bg-slate-50/80 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 p-3  "
//         >
//             <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
//                 <Image
//                     src={product.media[0]}
//                     alt={product.title}
//                     className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
//                     width={800}
//                     height={800}
//                 />
//                 <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
//                     <Image
//                         className="h-3 w-3"
//                         src={assets.heart_icon}
//                         alt="heart_icon"
//                     />
//                 </button>
//             </div>

//             <p className="md:text-base font-medium pt-2 w-full truncate">{product.title}</p>
//             <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{product.description}</p>
//             <div className="flex items-center gap-2">
//                 <p className="text-xs">{4.5}</p>
//                 <div className="flex items-center gap-0.5">
//                     {Array.from({ length: 5 }).map((_, index) => (
//                         <Image
//                             key={index}
//                             className="h-3 w-3"
//                             src={
//                                 index < Math.floor(4)
//                                     ? assets.star_icon
//                                     : assets.star_dull_icon
//                             }
//                             alt="star_icon"
//                         />
//                     ))}
//                 </div>
//             </div>

//             <div className="flex items-end justify-between w-full mt-1">
//                 <p className="text-base font-medium">{product.price}</p>
//                 <Link 
//                 href={`/products/${product._id}`}
//                 className=" max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition">
//                     Buy now
//                 </Link>
//             </div>
//         </Link>
//   );
// };

// export default ProductCard;

"use client";

import { useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Link from "next/link";
import BuyNowModal from "./BuyNowModal";
import { ProductType } from "@/lib/types";

interface ProductCardProps {
  product: ProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex flex-col items-start gap-1 w-[190px]  lg:w-[230px] cursor-pointer bg-slate-50/80 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 p-3">
        <Link href={`/products/${product._id}`} className="w-full">
          <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
            <Image
              src={product.media[0]}
              alt={product.title}
              className="group-hover:scale-105 transition object-cover w-5/5 h-5/5 md:w-full md:h-full"
              width={800}
              height={800}
            />
          </div>
        

        <p className="md:text-base font-bold pt-2 w-full truncate">{product.title}</p>
        <p className="w-full text-xs text-gray-500/70  truncate">{product.description}</p>
</Link>
        <div className="flex items-center gap-2">
          <p className="text-xs">{4.5}</p>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Image
                key={index}
                className="h-3 w-3"
                src={index < 4 ? assets.star_icon : assets.star_dull_icon}
                alt="star_icon"
              />
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between w-full mt-1">
          <p className="text-base font-medium">{parseFloat(product.price).toFixed(2)}  Da</p>
          <Link
            href={`/products/${product._id}`}
            className=" text-center px-3 py-1 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-100 transition"
          >
            Details
          </Link>
        </div>
      </div>

      {showModal && (
        <BuyNowModal product={product} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default ProductCard;
