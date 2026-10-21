import React from 'react'
import styled from 'styled-components'
import { useCartContext } from '../../context/cart_context'
import { formatPrice } from '../../utils/helpers'

const OrderSummary = () => {
  const { cart, totalAmount } = useCartContext()

  return (
    <Wrapper>
      <h4>order summary</h4>
      <ul className='items'>
        {cart.map(item => (
          <li key={item.id}>
            <img src={item.image} alt={item.name} />
            <div className='details'>
              <h5>{item.name}</h5>
              <p className='qty'>qty: {item.amount}</p>
            </div>
            <p className='subtotal'>{formatPrice(item.price * item.amount)}</p>
          </li>
        ))}
      </ul>
      <div className='totals'>
        <div className='row'>
          <span>subtotal</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
        <div className='row'>
          <span>shipping</span>
          <span>free</span>
        </div>
        <div className='row total'>
          <span>total</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: var(--clr-grey-10);
  border-radius: var(--radius);
  padding: 1.5rem;

  h4 {
    margin-bottom: 1rem;
  }
  .items {
    max-height: 320px;
    overflow-y: auto;
    margin-bottom: 1rem;
  }
  .items li {
    display: grid;
    grid-template-columns: 50px 1fr auto;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 1rem;
  }
  .items img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: var(--radius);
  }
  .details h5 {
    font-size: 0.85rem;
    margin-bottom: 0.15rem;
  }
  .qty {
    font-size: 0.75rem;
    color: var(--clr-grey-5);
    margin-bottom: 0;
  }
  .subtotal {
    font-size: 0.85rem;
    margin-bottom: 0;
    color: var(--clr-primary-5);
  }
  .totals {
    border-top: 1px solid var(--clr-grey-8);
    padding-top: 1rem;
  }
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  .row.total {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--clr-primary-5);
    border-top: 1px solid var(--clr-grey-8);
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }
`

export default OrderSummary
