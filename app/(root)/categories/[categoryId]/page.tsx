import ProductCard from "@/components/ProductCard";
import { getCategoriesDetails } from "@/lib/actions/actions";
import Image from "next/image";
import { notFound } from 'next/navigation';

interface ProductType {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  // Add other product properties as needed
}

interface CategoryDetailsType {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: ProductType[];
}

const CategoryDetailsPage = async ({ params }: { params: { categoryId: string } }) => {
  console.log("Fetching details for category ID:", params.categoryId);
  
  let categoryDetails: CategoryDetailsType | null = null;
  let error = null;

  try {
    categoryDetails = await getCategoriesDetails(params.categoryId);
  } catch (err) {
    console.error("Error fetching category details:", err);
    error = err;
  }

  if (error || !categoryDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-heading2-bold text-grey-2 mb-4">Category Not Found</h1>
        <p className="text-body-normal text-grey-2">
          The category you're looking for doesn't exist or may have been removed.
        </p>
      </div>
    );
    // Alternatively, you can use:
    // notFound();
  }

  return (
    <div className=" sm:px-10 py-5 flex flex-col items-center gap-8">
      {/* Category Image */}
      <div className="relative w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden px-4 ">
        <Image
          src={categoryDetails.image}
          alt={categoryDetails.title}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Category Title and Description */}
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-heading2-bold sm:text-heading1-bold text-grey-2 mb-4">
          {categoryDetails.title}
        </h1>
        <p className="text-body-normal text-grey-2 px-4">
          {categoryDetails.description}
        </p>
      </div>

      {/* Products Grid */}
      <div className="w-full">
        <h2 className="text-heading3-bold text-grey-2 mb-6">Products</h2>
        
        {!categoryDetails.products || categoryDetails.products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-body-bold text-grey-2">No products found in this category</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 lg:gap-6">
           {categoryDetails.products.map((product: ProductType) => (
  // @ts-ignore
  <ProductCard key={product._id} product={product} />
))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailsPage;

export const dynamic = "force-dynamic";