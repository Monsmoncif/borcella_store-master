import { getProducts } from "@/lib/actions/actions";
import ProductCard from "./ProductCard";
import Link from "next/link";

const ProductList = async () => {
  const products = await getProducts();

  return (
    <section className=" bg-white">
      <div className=" mx-auto  ">
        {/* Title */}
        <div className="flex flex-col items-center mb-12">
          <p className="text-3xl font-medium text-gray-800">Products</p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
        </div>

       {/* Product Flex List */}
{!products || products.length === 0 ? (
  <p className="text-center text-lg text-gray-600">No products found.</p>
) : (
  <div className="flex flex-wrap justify-center gap-3 lg:gap-6 ">
    {products.map((product: ProductType) => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>
)}


        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
