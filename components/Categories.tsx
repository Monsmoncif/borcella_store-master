import { getCategories } from "@/lib/actions/actions";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets/assets";
import { categoryType } from "@/lib/types";

const Categories = async () => {
  const categories = await getCategories();

  return (
   <>
      {!categories || categories.length === 0 ? (
        <p className="text-body-bold">No categories found</p>
      ) : (


           <div className="mt-14">
  <div className="flex flex-col items-center">
    <p className="text-3xl font-medium">Categories</p>
    <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-12  mb-12 md:px-14 px-4">
  {categories.map((category: categoryType) => (
    <div className="flex flex-col items-center" key={category._id}>
    
    <Link href={`/categories/${category._id}`} key={category._id}>
      <div className="relative group w-20 h-20 md:w-24 md:h-24 sm:w-40 sm:h-40 lg:w-30 lg:h-30 overflow-hidden rounded-full mx-auto">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover transition duration-300 group-hover:brightness-75 rounded-full"
        />
      
      </div>
    </Link>
    <p className="font-medium text-sm sm:text-base text-center">{category.title}</p>
    </div>
  ))}
</div>
</div>


      )}
    
    </>
  );
};

export default Categories;
