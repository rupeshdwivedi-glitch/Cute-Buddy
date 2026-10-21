import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  toggleWishlist as toggleWishlistLocal,
  removeFromWishlist as removeFromWishlistLocal,
  clearWishlist as clearWishlistLocal,
  setWishlist,
} from '../store/wishlistSlice'
import apiClient from '../utils/apiClient'
import { productDataType } from '../utils/productData'
import { PLACEHOLDER_IMAGE } from '../utils/constants'

const mapBackendWishlistItem = (item: any): productDataType => ({
  id: String(item.product.id),
  name: item.product.name,
  slug: String(item.product.id),
  categories: item.product.category,
  price: item.product.price,
  stock: item.product.stock,
  itemDescription: item.product.description || '',
  images: item.product.image_url ? [item.product.image_url] : [PLACEHOLDER_IMAGE],
})

// Guests get a local-only wishlist (Redux + localStorage, unchanged).
// Logged-in users get the same local state, kept in sync with the backend
// /wishlist API so it's available across devices/sessions.
export const useWishlistActions = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.auth.token)
  const items = useAppSelector(state => state.wishlist.items)

  const syncFromBackend = async () => {
    if (!token) return
    try {
      const { data } = await apiClient.get('/wishlist')
      dispatch(setWishlist(data.map(mapBackendWishlistItem)))
    } catch (error) {
      console.log(error)
    }
  }

  const toggle = async (product: productDataType) => {
    const alreadyWishlisted = items.some(item => item.id === product.id)
    dispatch(toggleWishlistLocal(product))
    if (!token) return
    try {
      if (alreadyWishlisted) {
        await apiClient.delete(`/wishlist/items/${product.id}`)
      } else {
        await apiClient.post('/wishlist/items', { product_id: Number(product.id) })
      }
    } catch (error) {
      console.log(error)
      dispatch(toggleWishlistLocal(product)) // revert the optimistic update
    }
  }

  const remove = async (id: string) => {
    dispatch(removeFromWishlistLocal(id))
    if (!token) return
    try {
      await apiClient.delete(`/wishlist/items/${id}`)
    } catch (error) {
      console.log(error)
    }
  }

  const clear = async () => {
    dispatch(clearWishlistLocal())
    if (!token) return
    try {
      await apiClient.delete('/wishlist')
    } catch (error) {
      console.log(error)
    }
  }

  return { toggle, remove, clear, syncFromBackend }
}
