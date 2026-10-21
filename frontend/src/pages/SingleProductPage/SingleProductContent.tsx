import React from 'react'
import { useProductsContext } from '../../context/products_context'
import { formatPrice } from '../../utils/helpers'
import { AddToCart } from '../../components'
import WishlistButton from '../../components/Wishlist/WishlistButton'
import { productDataType } from '../../utils/productData'

export const SingleProductContent = () => {
  const { singleProduct } = useProductsContext()

  const { id, name, price, itemDescription, brand, stock,  ageDescription, heightDescription } = {
    ...singleProduct,
  }
  return (
    <section className='content'>
      <div className='title-row'>
        <h2>{name}</h2>
        {id && (
          <span className='wishlist-wrap'>
            <WishlistButton product={singleProduct as productDataType} />
          </span>
        )}
      </div>
      <h5 className='price'>{price && formatPrice(price)}</h5>
      <p className='desc'>{itemDescription}</p>
      <p className='info'>
        <span>Availability : </span>
        {stock ? 'In stock' : 'Out of stock'}
      </p>

      {brand ? (
        <p className='info'>
          <span>Brand : </span>
          {brand}
        </p>
      ) : undefined}

      {ageDescription ? (
        <p className='info'>
          <span>Suitable for age : </span>
          {ageDescription}
        </p>
      ) : undefined}

      {heightDescription ? (
        <p className='info'>
          <span>Suitable for height : </span>
          {heightDescription}
        </p>
      ) : undefined}

      {stock ? (
        <>
          <hr />
          <AddToCart singleProduct={singleProduct} />
        </>
      ) : undefined}
    </section>
  )
}
