import React, {useEffect} from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useCartContext } from '../context/cart_context'

// NOTE: this page belongs to the old Stripe-based checkout flow
// (components/StripeCheckout.tsx, CheckoutForm.tsx), which is currently
// unused — the live checkout flow is the demo/no-gateway flow at
// CheckoutPage -> OrderSuccessPage. Left in place in case Stripe is wired
// back in later (see Order.payment_method on the backend).
const SuccessfulPayment = () => {

  const { clearCart } = useCartContext()

  // clear the cart when the page mounts
  // assume only successful payment will route to this page
  useEffect(()=>{
    clearCart()
    //eslint-disable-next-line
  }, [])

  return (
    <Wrapper className='page-100'>
      <section>
        <h1>Thank you</h1>
        <h3>Payment is completed</h3>
        <Link to='/' className='btn'>
          back to home page
        </Link>
      </section>
    </Wrapper>
  )
}

export default SuccessfulPayment

const Wrapper = styled.main`
  background: var(--clr-primary-10);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  h1 {
    font-size: 8rem;
    margin-bottom: 1rem;
  }
  h3 {
    text-transform: none;
    margin-bottom: 2rem;
  }
`
