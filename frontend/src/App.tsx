import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Navbar, Sidebar, Footer, ScrollToTop } from './components'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { fetchCurrentUser } from './store/authSlice'
import { useWishlistActions } from './hooks/useWishlistActions'

import {
  Home,
  Error,
  Shipping,
  SingleProduct,
  Checkout,
  Products,
  Cart,
  SuccessfulPayment,
  Blog,
  Wishlist,
  Login,
  Signup,
  Orders,
  OrderDetail,
  OrderSuccess,
  AdminProducts,
} from './pages'


function App() {
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.auth.token)
  const user = useAppSelector(state => state.auth.user)
  const { syncFromBackend } = useWishlistActions()

  // on app load, if a token is already stored, rehydrate the logged-in user
  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser())
    }
    // eslint-disable-next-line
  }, [])

  // once the user is known (fresh login or rehydrated session), pull their
  // wishlist from the backend so it's consistent across devices
  useEffect(() => {
    if (user) {
      syncFromBackend()
    }
    // eslint-disable-next-line
  }, [user?.id])

  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route exact path='/shipping'>
            <Shipping />
          </Route>
          <Route exact path='/cart'>
            <Cart />
          </Route>
          <Route exact path='/products'>
            <Products />
          </Route>
          <Route exact path='/blogs'>
            <Blog/>
          </Route>
          <Route exact path='/wishlist'>
            <Wishlist />
          </Route>
          <Route exact path='/products/:slug' children={<SingleProduct />} />
          <Route exact path='/checkout'>
            <Checkout />
          </Route>
          <Route exact path='/successful_payment'>
            <SuccessfulPayment />
          </Route>
          <Route exact path='/login'>
            <Login />
          </Route>
          <Route exact path='/signup'>
            <Signup />
          </Route>
          <Route exact path='/orders'>
            <Orders />
          </Route>
          <Route exact path='/orders/:id'>
            <OrderDetail />
          </Route>
          <Route exact path='/order-success'>
            <OrderSuccess />
          </Route>
          <Route exact path='/admin/products'>
            <AdminProducts />
          </Route>
          <Route path='*'>
            <Error />
          </Route>

        </Switch>
      </Layout>
    </Router>
  )
}

export default App

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Sidebar />
      {children}
      <Footer />
    </>
  )
}
