import React from 'react'
import FilterSidebar from './FilterSidebar'
import { getProductDetails } from '@/lib/actions/actions'

const side = async ({ params }: { params: { productId: string }}) => {
     const productDetails = await getProductDetails(params.productId)
  return (
    <div>
      <FilterSidebar productInfo={productDetails} />
    </div>
  )
}

export default side
