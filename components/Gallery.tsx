"use client"

import Image from "next/image";
import React, { useState } from "react";

const Gallery = ({ productMedia }: { productMedia: string[] }) => {
  const [mainImage, setMainImage] = useState(productMedia[0]);

  return (

    // <div className="rounded-lg h-[600px] w-[600px] bg-slate-50 mb-4 ">
    //   <Image
    //     src={mainImage}
    //     width={500}
    //     height={500}
    //     alt="product"
    //     className="object-cover"
    //   />
    //   <div className="flex gap-2 overflow-auto tailwind-scrollbar-hide bg-white p-2">
    //     {productMedia.map((image, index) => (
    //       <Image
    //         key={index}
    //         src={image}
    //         height={200}
    //         width={200}
    //         alt="product"
    //         className={`w-20 h-20 rounded-lg object-cover cursor-pointer ${mainImage === image ? "border-2 border-black" : ""}`}
    //         onClick={() => setMainImage(image)}
    //       />
    //     ))}
    //   </div>
    // </div>

<div className="px-4 sm:px-5 md:px-8 lg:px-16 xl:px-20 w-full max-w-[500px] mx-auto">
  {/* Main Image Container */}
  <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4 aspect-[4/3] w-full">
    <Image
      src={mainImage}
      alt="Product main image"
      className="w-full h-full object-cover mix-blend-multiply"
      width={800}
      height={600}
      priority
    />
  </div>

  {/* Thumbnail Grid */}
  <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
    {productMedia.map((image, index) => (
      <button
        key={index}
        onClick={() => setMainImage(image)}
        className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 aspect-square focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label={`View image ${index + 1}`}
      >
        <Image
          src={image}
          alt={`Product thumbnail ${index + 1}`}
          className="w-full h-full object-cover mix-blend-multiply hover:opacity-90 transition-opacity"
          width={200}
          height={200}
        />
      </button>
    ))}
  </div>
</div>

  );
};

export default Gallery;
