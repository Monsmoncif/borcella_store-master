import ProductCard from '@/components/ProductCard'
import { getSearchedProducts } from '@/lib/actions/actions'

const SearchPage = async ({ params }: { params: { query: string }}) => {
  const searchedProducts = await getSearchedProducts(params.query)

  const decodedQuery = decodeURIComponent(params.query)

  return (
    <div className=' py-5'>
      <p className='text-heading3-bold my-10'>Search results for {decodedQuery}</p>
      {!searchedProducts || searchedProducts.length === 0 && (
        <p className='text-body-bold my-5'>No result found</p>
      )}
      <div className='flex flex-wrap justify-center gap-10'>
        {searchedProducts?.map((product: ProductType) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic";

export default SearchPage