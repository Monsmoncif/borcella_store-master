// "use client";
// import React from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { SlReload } from "react-icons/sl";

// type Props = {
//   collections: { _id: string; title: string }[];
//   categories: { _id: string; title: string }[];
//   availableColors: string[];
//   availableSizes: string[];
// };

// const FilterSidebar = ({ 
//   collections, 
//   categories, 
//   availableColors, 
//   availableSizes 
// }: Props) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const updateFilter = (name: string, value: string) => {
//     const params = new URLSearchParams(searchParams.toString());
//     if (value) {
//       params.set(name, value);
//     } else {
//       params.delete(name);
//     }
//     params.delete("page"); // Reset to first page when filters change
//     router.push(`?${params.toString()}`);
//   };

//   const resetFilters = () => {
//     router.push("/shop");
//   };

//   // Get current filters from URL
//   const currentFilters = {
//     collection: searchParams.get("collection") || "",
//     category: searchParams.get("category") || "",
//     color: searchParams.get("color") || "",
//     size: searchParams.get("size") || "",
//   };

//   return (
//     <aside className=" w-[200px] bg-gray-50 p-6 rounded-xl shadow-md space-y-6 ">
//       <h2 className="text-xl font-semibold text-gray-700">Filter Products</h2>

//       {/* Collection Filter */}
//       <div>
//         <label className="block text-gray-600 font-medium mb-2">Collection</label>
//         <select
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
//           value={currentFilters.collection}
//           onChange={(e) => updateFilter("collection", e.target.value)}
//         >
//           <option value="">All Collections</option>
//           {collections.map((collection) => (
//             <option key={collection._id} value={collection.title}>
//               {collection.title}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Category Filter */}
//       <div>
//         <label className="block text-gray-600 font-medium mb-2">Category</label>
//         <select
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
//           value={currentFilters.category}
//           onChange={(e) => updateFilter("category", e.target.value)}
//         >
//           <option value="">All Categories</option>
//           {categories.map((category) => (
//             <option key={category._id} value={category.title}>
//               {category.title}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Color Filter */}
//       <div>
//         <label className="block text-gray-600 font-medium mb-2">Color</label>
//         <select
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
//           value={currentFilters.color}
//           onChange={(e) => updateFilter("color", e.target.value)}
//         >
//           <option value="">All Colors</option>
//           {availableColors.map((color) => (
//             <option key={color} value={color}>
//               {color}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Size Filter */}
//       <div>
//         <label className="block text-gray-600 font-medium mb-2">Size</label>
//         <select
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
//           value={currentFilters.size}
//           onChange={(e) => updateFilter("size", e.target.value)}
//         >
//           <option value="">All Sizes</option>
//           {availableSizes.map((size) => (
//             <option key={size} value={size}>
//               {size}
//             </option>
//           ))}
//         </select>
//       </div>

//       <button
//         onClick={resetFilters}
//         className="flex items-center gap-2 mt-4 px-4 py-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg transition-colors"
//       >
//         <SlReload className="text-lg" />
//         Reset All Filters
//       </button>
//     </aside>
//   );
// };

// export default FilterSidebar;
"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlReload } from "react-icons/sl";

type Props = {
  collections: { _id: string; title: string }[];
  categories: { _id: string; title: string }[];
  availableColors: string[];
  availableSizes: string[];
};

const FilterSidebar = ({ 
  collections, 
  categories, 
  availableColors, 
  availableSizes 
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.delete("page"); // Reset to first page when filters change
    router.push(`?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push("/shop");
  };

  // Get current filters from URL
  const currentFilters = {
    collection: searchParams.get("collection") || "",
    category: searchParams.get("category") || "",
    color: searchParams.get("color") || "",
    size: searchParams.get("size") || "",
  };

  return (
    <div className="w-full mb-6">
      {/* Mobile Filters - Always visible on small screens */}
      <div className="lg:hidden bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Filter Products</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Collection Filter */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Collection</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              value={currentFilters.collection}
              onChange={(e) => updateFilter("collection", e.target.value)}
            >
              <option value="">All</option>
              {collections.map((collection) => (
                <option key={collection._id} value={collection.title}>
                  {collection.title}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              value={currentFilters.category}
              onChange={(e) => updateFilter("category", e.target.value)}
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category._id} value={category.title}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Color</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              value={currentFilters.color}
              onChange={(e) => updateFilter("color", e.target.value)}
            >
              <option value="">All</option>
              {availableColors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Size</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              value={currentFilters.size}
              onChange={(e) => updateFilter("size", e.target.value)}
            >
              <option value="">All</option>
              {availableSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="mt-4 flex items-center gap-1 text-sm px-3 py-1.5 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg transition-colors"
        >
          <SlReload className="text-sm" />
          Reset Filters
        </button>
      </div>

      {/* Desktop Filters */}
      <aside className="hidden lg:block w-[200px] bg-gray-50 p-6 rounded-xl shadow-md space-y-6">
        <h2 className="text-xl font-semibold text-gray-700">Filter Products</h2>

        {/* Collection Filter */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">Collection</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            value={currentFilters.collection}
            onChange={(e) => updateFilter("collection", e.target.value)}
          >
            <option value="">All Collections</option>
            {collections.map((collection) => (
              <option key={collection._id} value={collection.title}>
                {collection.title}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">Category</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            value={currentFilters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        {/* Color Filter */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">Color</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            value={currentFilters.color}
            onChange={(e) => updateFilter("color", e.target.value)}
          >
            <option value="">All Colors</option>
            {availableColors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Size Filter */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">Size</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            value={currentFilters.size}
            onChange={(e) => updateFilter("size", e.target.value)}
          >
            <option value="">All Sizes</option>
            {availableSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="flex items-center gap-2 mt-4 px-4 py-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg transition-colors"
        >
          <SlReload className="text-lg" />
          Reset All Filters
        </button>
      </aside>
    </div>
  );
};

export default FilterSidebar;