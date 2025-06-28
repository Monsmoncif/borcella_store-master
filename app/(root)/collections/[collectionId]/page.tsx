import ProductCard from "@/components/ProductCard";
import { getCollectionDetails } from "@/lib/actions/actions";
import Image from "next/image";
import React from "react";

const CollectionDetails = async ({
  params,
}: {
  params: { collectionId: string };
}) => {
  const collectionDetails = await getCollectionDetails(params.collectionId);

  return (
    <div className=" py-5 flex flex-col items-center gap-8 ">
  <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
  <Image
    src={collectionDetails.image}
    alt="collection"
    fill
    sizes="100vw"
    className="object-cover object-center px-10"
  />
</div>


      <p className="text-heading3-bold text-grey-2 px-10">{collectionDetails.title}</p>
      <p className="text-body-normal text-grey-2 text-center max-w-[900px] px-10">{collectionDetails.description}</p>
      <div className="flex  gap-3 justify-center ">
        {!collectionDetails?.products || collectionDetails.products.length === 0 ? (
  <p className="text-body-bold">No products found</p>
) : (
  collectionDetails.products.map((product: ProductType) => (
    <ProductCard key={product._id} product={product} />
  ))
)}

      </div>
    </div>
  );
};

export default CollectionDetails;

export const dynamic = "force-dynamic";

