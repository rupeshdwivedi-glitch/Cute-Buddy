import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { productDataType } from '../utils/productData'

const STORAGE_KEY = 'wishlist'

export const loadWishlist = (): productDataType[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const saveWishlist = (items: productDataType[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // storage unavailable, wishlist stays in memory only
  }
}

type WishlistState = { items: productDataType[] }

const initialState: WishlistState = { items: loadWishlist() }

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<productDataType>) {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index >= 0) {
        state.items.splice(index, 1)
      } else {
        state.items.push(action.payload)
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    clearWishlist(state) {
      state.items = []
    },
    // replaces local state wholesale with the backend's wishlist (called after
    // login, since the backend is the source of truth once authenticated)
    setWishlist(state, action: PayloadAction<productDataType[]>) {
      state.items = action.payload
    },
  },
})

export const { toggleWishlist, removeFromWishlist, clearWishlist, setWishlist } =
  wishlistSlice.actions
export default wishlistSlice.reducer
