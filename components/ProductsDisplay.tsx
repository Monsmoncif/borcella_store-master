// app/shop/ProductsDisplay.tsx
"use client";

import { useState } from 'react';
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { FiFilter, FiX } from "react-icons/fi";

type ProductDisplayProps = {
  products: any[];
  collections: any[];
  categories: any[];
  availableColors: string[];
  availableSizes: string[];
  searchParams: any;
};

const ProductsDisplay = ({
  products,
  collections,
  categories,
  availableColors,
  availableSizes,
  searchParams
}: ProductDisplayProps) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const router = useRouter();

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCollection = searchParams.collection
      ? product.collections.some((c: any) => c.title === searchParams.collection)
      : true;

    const matchesCategory = searchParams.category
      ? product.categories.some((c: any) => c.title === searchParams.category)
      : true;

    const matchesColor = searchParams.color
      ? product.variants.some((v: any) => v.color === searchParams.color)
      : true;

    const matchesSize = searchParams.size
      ? product.variants.some((v: any) => v.size === searchParams.size)
      : true;

    return matchesCollection && matchesCategory && matchesColor && matchesSize;
  });

  // Count active filters
  const activeFilters = Object.values(searchParams).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Mobile Filter Bar */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm"
        >
          <FiFilter size={18} />
          <span>Filters</span>
          {activeFilters > 0 && (
            <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <FilterSidebar 
                collections={collections} 
                categories={categories}
                availableColors={availableColors}
                availableSizes={availableSizes}
                searchParams={searchParams}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              {activeFilters > 0 && (
                <button 
                  onClick={() => router.push('/shop')}
                  className="text-sm text-orange-600 hover:text-orange-800"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <FilterSidebar 
              collections={collections} 
              categories={categories}
              availableColors={availableColors}
              availableSizes={availableSizes}
              searchParams={searchParams}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Active Filters */}
          {activeFilters > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {Object.entries(searchParams).map(([key, value]) => (
                value && (
                  <span 
                    key={`${key}-${value}`}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm"
                  >
                    {value}
                    <button 
                      className="ml-1.5 text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.delete(key);
                        router.push(`?${params.toString()}`);
                      }}
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                )
              ))}
            </div>
          )}

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search for something else
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const currentPrice = product.promotion 
                  ? product.price * (1 - parseFloat(product.promotion) / 100)
                  : product.price;

                return (
                  <ProductCard 
                    key={product._id}
                    product={{
                      ...product,
                      image: product.media[0],
                      price: currentPrice,
                      colors: availableColors,
                      sizes: availableSizes
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsDisplay;