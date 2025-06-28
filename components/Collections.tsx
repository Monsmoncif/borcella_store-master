import { getCollections } from "@/lib/actions/actions";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets/assets";
import { CollectionType } from "@/lib/types";

const Collections = async () => {
  const collections = await getCollections();

  return (
   <>
      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No collections found</p>
      ) : (
        //  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        //   {collections.map((collection: CollectionType) => (
        //     <Link href={`/collections/${collection._id}`} key={collection._id}
        //     className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        //       <Image
        //         key={collection._id}
        //         src={collection.image}
        //         alt={collection.title}
        //         width={300}
        //         height={100}
        //           className="object-cover group-hover:scale-110 transition-transform duration-500"
        //       />
        //        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
        //         <div className="absolute bottom-6 left-6 text-white/80  transition-colors duration-300">
        //           <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                  
        //         </div>

        //         <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        //           <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        //           </svg>
        //         </div>

              
        //     </Link>
        //   ))}
        // </div>

     <div className="mt-14">
  <div className="flex flex-col items-center">
    <p className="text-3xl font-medium">Collections</p>
    <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
    {collections.map((collection: CollectionType) => (
      <Link href={`/collections/${collection._id}`} key={collection._id}>
      <div key={collection._id} className="relative group aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover transition duration-300 group-hover:brightness-75"
        />

        <div className="absolute bottom-8 left-8 text-white space-y-2 transition duration-300 group-hover:-translate-y-4">
          <p className="font-medium text-xl lg:text-2xl">{collection.title}</p>

          <Link href={`/collections/${collection._id}`} key={collection._id}
           className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded">
            more
            <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
          </Link>
        </div>
      </div> 
      </Link>
    ))}
  </div>
</div>


      )}
    
    </>
  );
};

export default Collections;
