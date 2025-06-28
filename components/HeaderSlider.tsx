"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Link from "next/link";

type SliderType = {
  _id: string;
  image: string;
  title: string;
  link: string;
  offer?: string;
  description: string;
  buttonText1?: string;
  buttonText2?: string;
};

const HeaderSlider = ({ sliders }: { sliders: SliderType[] }) => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (sliders.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliders.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [sliders.length, isHovered]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  if (!sliders || sliders.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
        <p className="text-gray-500">No sliders available</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full px-2 sm:px-4 mt-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="overflow-hidden rounded-2xl shadow-xl">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {sliders.map((slide) => (
            <div
              key={slide._id}
              className="flex flex-col-reverse md:flex-row items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 py-10 md:py-16 px-4 md:px-16 min-w-full relative"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute -top-20 -left-20 w-32 h-32 md:w-40 md:h-40 rounded-full bg-purple-100 opacity-30"></div>
                <div className="absolute -bottom-20 -right-20 w-48 h-48 md:w-60 md:h-60 rounded-full bg-indigo-100 opacity-30"></div>
              </div>

              {/* Text Content */}
              <div className=" relative z-10 text-center md:text-left">
                {slide.offer && (
                  <span className="inline-block bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1.5 rounded-full text-[300px] mb-4 shadow-md">
                    {slide.offer}
                  </span>
                )}

                <h1 className=" text-[40px] font-bold text-gray-800 leading-tight max-w-52 mx-auto md:mx-0">
                  {slide.title || "Special Offer"}
                </h1>

                <p className=" mt-8 text-[18px] font-bold text-orange-400 leading-tight max-w-xs break-words mx-auto md:mx-0">
                  {slide.description}
                </p>


                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-6">
                  <Link
                    href={slide.link}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-full text-white text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {slide.buttonText1 || "Buy Now"}
                  </Link>
<Link
  href="/shop"
  className="group inline-flex items-center gap-1 font-semibold text-gray-700 hover:text-orange-600 transition-all duration-300 text-[18px] sm:text-base relative"
>
  {slide.buttonText2 || "More"}
  {/* Animated underline */}
  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-orange-600 group-hover:w-full transition-all duration-300 ease-out"></span>
</Link>
                </div>
              </div>


              {/* Image */}
              <div className="flex-1 flex justify-center md:justify-end relative z-10">
                <div className="relative w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[500px] md:h-[400px] transform hover:scale-105 transition-transform duration-500">
                  <Image
                    src={slide.image}
                    alt={slide.title || "Slider Image"}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      {sliders.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${current === index
                ? "bg-gradient-to-r from-orange-500 to-pink-500 w-6 sm:w-8 shadow-md"
                : "bg-gray-300 hover:bg-orange-300 w-3 sm:w-4"
                }`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
       
        </>
      )}
    </div>
  );
};

export default HeaderSlider;
