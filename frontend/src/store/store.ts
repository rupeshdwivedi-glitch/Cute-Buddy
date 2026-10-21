import { configureStore } from '@reduxjs/toolkit'
import wishlistReducer, { saveWishlist } from './wishlistSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: { wishlist: wishlistReducer, auth: authReducer },
})

store.subscribe(() => saveWishlist(store.getState().wishlist.items))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
