import React, { useState } from 'react'
import styled from 'styled-components'
import { PageHero } from '../components'
import { useCartContext } from '../context/cart_context'
import { Link, useHistory } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import apiClient, { getApiErrorMessage } from '../utils/apiClient'
import CheckoutDetailsForm, {
  CheckoutDetails,
} from '../components/Checkout/CheckoutDetailsForm'
import OrderSummary from '../components/Checkout/OrderSummary'

const CheckoutPage = () => {
  const { cart, clearCart } = useCartContext()
  const token = useAppSelector(state => state.auth.token)
  const history = useHistory()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (details: CheckoutDetails) => {
    setSubmitting(true)
    setSubmitError('')
    try {
      // the backend cart is the source of truth for checkout, so make sure
      // it matches what's shown locally before placing the order
      await Promise.all(
        cart.map(item =>
          apiClient.post('/cart/items', {
            product_id: Number(item.id),
            quantity: item.amount,
          })
        )
      )
      const { data: order } = await apiClient.post('/orders/checkout', details)
      clearCart()
      history.push('/order-success', { order })
    } catch (error) {
      setSubmitError(getApiErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <PageWrapper>
        <div className='empty'>
          <h2>please log in to checkout</h2>
          <Link to='/login' className='btn'>
            login
          </Link>
        </div>
      </PageWrapper>
    )
  }

  if (cart.length < 1) {
    return (
      <PageWrapper>
        <div className='empty'>
          <h2>your cart is empty</h2>
          <Link to='/products' className='btn'>
            fill your cart
          </Link>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className='checkout-grid'>
        <CheckoutDetailsForm
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={submitError}
        />
        <OrderSummary />
      </div>
    </PageWrapper>
  )
}

const PageWrapper: React.FC = ({ children }) => {
  return (
    <main>
      <PageHero title='checkout' />
      <Wrapper className='page'>{children}</Wrapper>
    </main>
  )
}

const Wrapper = styled.div`
  .empty {
    text-align: center;
    display: grid;
    place-items: center;
    min-height: 40vh;
  }
  .checkout-grid {
    display: grid;
    gap: 2.5rem;
    max-width: 900px;
    margin: 0 auto;
  }
  @media (min-width: 800px) {
    .checkout-grid {
      grid-template-columns: 1.2fr 1fr;
      align-items: start;
    }
  }
`
export default CheckoutPage
