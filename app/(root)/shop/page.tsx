import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { getCategories, getCollections, getProducts } from "@/lib/actions/actions";
import { FiX } from "react-icons/fi";
import { URLSearchParams } from "url";

type Variant = {
  color: string;
  size: string;
  quantity: number;
};

type Category = {
  _id: string;
  title: string;
};

type Collection = {
  _id: string;
  title: string;
};

type Product = {
  _id: string;
  title: string;
  description: string;
  media: string[];
  price: number;
  expense: number;
  categories: Category[];
  collections: Collection[];
  variants: Variant[];
  promotion?: string;
};

type SearchParams = {
  collection?: string;
  category?: string;
  color?: string;
  size?: string;
};

const AllProducts = async ({ searchParams }: { searchParams: SearchParams }) => {
  const [products, collections, categories] = await Promise.all([
    getProducts() as Promise<Product[]>,
    getCollections() as Promise<Collection[]>,
    getCategories() as Promise<Category[]>,
  ]);

  // Extract unique colors and sizes from variants
  const allColors = products.flatMap(p => 
    p.variants.map(v => v.color).filter(Boolean)
  ) as string[];
  const availableColors = Array.from(new Set(allColors)).sort();

  const allSizes = products.flatMap(p => 
    p.variants.map(v => v.size).filter(Boolean)
  ) as string[];
  const availableSizes = Array.from(new Set(allSizes)).sort();

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCollection = searchParams.collection
      ? product.collections.some(c => c.title === searchParams.collection)
      : true;

    const matchesCategory = searchParams.category
      ? product.categories.some(c => c.title === searchParams.category)
      : true;

    const matchesColor = searchParams.color
      ? product.variants.some(v => v.color === searchParams.color)
      : true;

    const matchesSize = searchParams.size
      ? product.variants.some(v => v.size === searchParams.size)
      : true;

    return matchesCollection && matchesCategory && matchesColor && matchesSize;
  });

  // Count active filters
  const activeFilters = Object.values(searchParams).filter(Boolean).length;

  // Function to remove a specific filter
  const removeFilter = (key: keyof SearchParams) => {
    const newParams = { ...searchParams };
    delete newParams[key];
    return `/shop?${new URLSearchParams(newParams as Record<string, string>).toString()}`;
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    return '/shop';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 py-16 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Our Collection</h1>
        <p className="text-xl max-w-2xl mx-auto opacity-90">
          Discover quality products in every style and size
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
        {/* Mobile Filters */}
        <div className="lg:hidden mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <FilterSidebar 
            collections={collections} 
            categories={categories}
            availableColors={availableColors}
            availableSizes={availableSizes}
            
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                {activeFilters > 0 && (
                  <a
                    href={clearAllFilters()}
                    className="text-sm text-orange-600 hover:text-orange-800"
                  >
                    Clear all
                  </a>
                )}
              </div>
              
              <FilterSidebar 
                collections={collections} 
                categories={categories}
                availableColors={availableColors}
                availableSizes={availableSizes}
                
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Active Filters */}
            {activeFilters > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {(Object.keys(searchParams) as Array<keyof SearchParams>).map((key) => {
                  const value = searchParams[key];
                  return value ? (
                    <a
                      key={`${key}-${value}`}
                      href={removeFilter(key)}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
                    >
                      {value}
                      <FiX size={14} className="ml-1.5 text-gray-500 hover:text-gray-700" />
                    </a>
                  ) : null;
                })}
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
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8 px-1">
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
    </div>
  );
};

export default AllProducts;


// import FilterSidebar from "@/components/FilterSidebar";
// import ProductCard from "@/components/ProductCard";
// import { getCategories, getCollections, getProducts } from "@/lib/actions/actions";

// type VariantType = {
//   color: string;
//   size: string;
//   quantity: number;
// };

// type ProductType = {
//   _id: string;
//   title: string;
//   description: string;
//   media: string[];
//   price: number;
//   expense: number;
//   categories: { _id: string; title: string }[];
//   collections: { _id: string; title: string }[];
//   variants: VariantType[];
//   promotion?: string | null;
// };

// type Props = {
//   searchParams: {
//     collection?: string;
//     category?: string;
//     color?: string;
//     size?: string;
//   };
// };

// const AllProducts = async ({ searchParams }: Props) => {
//   const [products, collections, categories] = await Promise.all([
//     getProducts(),
//     getCollections(),
//     getCategories(),
//   ]);

//   // Extract unique colors and sizes from variants
//   const availableColors = [...new Set(
//     products.flatMap(p => p.variants.map(v => v.color))
//   )].filter(Boolean).sort();

//   const availableSizes = [...new Set(
//     products.flatMap(p => p.variants.map(v => v.size))
//   )].filter(Boolean).sort();

//   // Filter products
//   const filteredProducts = products.filter((product) => {
//     const matchesCollection = searchParams.collection
//       ? product.collections.some(c => c.title === searchParams.collection)
//       : true;

//     const matchesCategory = searchParams.category
//       ? product.categories.some(c => c.title === searchParams.category)
//       : true;

//     const matchesColor = searchParams.color
//       ? product.variants.some(v => v.color === searchParams.color)
//       : true;

//     const matchesSize = searchParams.size
//       ? product.variants.some(v => v.size === searchParams.size)
//       : true;

//     return matchesCollection && matchesCategory && matchesColor && matchesSize;
//   });

//   // Count active filters
//   const activeFilters = Object.values(searchParams).filter(Boolean).length;

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Hero Header */}
//       <div className="bg-gradient-to-r from-orange-500 to-amber-600 py-16 text-center text-white">
//         <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Our Collection</h1>
//         <p className="text-xl max-w-2xl mx-auto opacity-90">
//           Discover quality products in every style and size
//         </p>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
//         {/* Mobile Filters - Always visible */}
//         <div className="lg:hidden mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <FilterSidebar 
//             collections={collections} 
//             categories={categories}
//             availableColors={availableColors}
//             availableSizes={availableSizes}
//             searchParams={searchParams}
//           />
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Desktop Filters */}
//           <div className="hidden lg:block flex-shrink-0">
//             <div className="sticky top-4 space-y-6">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-medium text-gray-900">Filters</h3>
//                 {activeFilters > 0 && (
//                   <button className="text-sm text-orange-600 hover:text-orange-800">
//                     Clear all
//                   </button>
//                 )}
//               </div>
              
//               <FilterSidebar 
//                 collections={collections} 
//                 categories={categories}
//                 availableColors={availableColors}
//                 availableSizes={availableSizes}
//                 searchParams={searchParams}
//               />
//             </div>
//           </div>

//           {/* Product Grid */}
//           <div className="flex-1">
//             {/* Active Filters */}
//             {activeFilters > 0 && (
//               <div className="mb-6 flex flex-wrap gap-2">
//                 {Object.entries(searchParams).map(([key, value]) => (
//                   value && (
//                     <span 
//                       key={`${key}-${value}`}
//                       className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm"
//                     >
//                       {value}
//                       <button className="ml-1.5 text-gray-500 hover:text-gray-700">
//                         <FiX size={14} />
//                       </button>
//                     </span>
//                   )
//                 ))}
//               </div>
//             )}

//             {/* Product Count - Moved here for better mobile layout */}
//             <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//               {filteredProducts.length} Products
//             </h2>

//             {/* Products */}
//             {filteredProducts.length === 0 ? (
//               <div className="text-center py-16">
//                 <h3 className="text-xl font-medium text-gray-900 mb-2">
//                   No products found
//                 </h3>
//                 <p className="text-gray-500">
//                   Try adjusting your filters or search for something else
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4 md:gap-16 lg:gap-12 px-1">
//                 {filteredProducts.map((product) => {
//                   const currentPrice = product.promotion 
//                     ? product.price * (1 - parseFloat(product.promotion) / 100)
//                     : product.price;

//                   return (
//                     <ProductCard 
//                       key={product._id}
//                       product={{
//                         ...product,
//                         image: product.media[0],
//                         price: currentPrice,
//                         colors: availableColors,
//                         sizes: availableSizes
//                       }}
//                     />
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllProducts;