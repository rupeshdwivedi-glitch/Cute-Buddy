import React from 'react'
import { PageHero } from '../components'
import Wishlist from '../components/Wishlist/Wishlist'

const WishlistPage = () => {
  return (
    <main>
      <PageHero title='Wishlist' />
      <Wishlist />
    </main>
  )
}

export default WishlistPage
