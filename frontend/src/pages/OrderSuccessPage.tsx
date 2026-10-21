import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { formatPrice } from '../utils/helpers'
import { Order } from '../types/order'

const OrderSuccessPage = () => {
  const location = useLocation<{ order?: Order }>()
  const order = location.state?.order

  if (!order) {
    // page was opened directly (e.g. refresh) without an order in state
    return (
      <Wrapper className='page-100'>
        <section>
          <h2>no order to show</h2>
          <p>Head over to your orders list to see your past purchases.</p>
          <Link to='/orders' className='btn'>
            view my orders
          </Link>
        </section>
      </Wrapper>
    )
  }

  return (
    <Wrapper className='page-100'>
      <section>
        <div className='checkmark'>&#10003;</div>
        <h1>order placed!</h1>
        <p className='demo-note'>
          Demo checkout &mdash; this order was marked paid automatically; no
          real payment gateway was used.
        </p>

        <div className='summary'>
          <div className='row'>
            <span>order id</span>
            <span>#{order.id}</span>
          </div>
          <div className='row'>
            <span>customer</span>
            <span>{order.full_name}</span>
          </div>
          <div className='row'>
            <span>payment status</span>
            <span className='capitalize'>{order.payment_status}</span>
          </div>
          <div className='row'>
            <span>order status</span>
            <span className='capitalize'>{order.status}</span>
          </div>
          <ul className='items'>
            {order.items.map(item => (
              <li key={item.id}>
                <span>
                  {item.product_name} &times; {item.quantity}
                </span>
                <span>{formatPrice(item.unit_price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className='row total'>
            <span>total</span>
            <span>{formatPrice(order.total_amount)}</span>
          </div>
        </div>

        <div className='actions'>
          <Link to='/orders' className='btn'>
            view my orders
          </Link>
          <Link to='/products' className='btn-secondary'>
            continue shopping
          </Link>
        </div>
      </section>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  background: var(--clr-primary-10);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;

  section {
    max-width: 480px;
  }
  .checkmark {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1rem;
    display: grid;
    place-items: center;
    background: var(--clr-green-light);
    color: var(--clr-white);
    border-radius: 50%;
    font-size: 1.75rem;
  }
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  h2 {
    margin-bottom: 1rem;
  }
  .demo-note {
    font-size: 0.85rem;
    color: var(--clr-grey-4);
    margin-bottom: 2rem;
  }
  .summary {
    background: var(--clr-white);
    border-radius: var(--radius);
    padding: 1.5rem;
    text-align: left;
    margin-bottom: 2rem;
  }
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.6rem;
    font-size: 0.9rem;
  }
  .capitalize {
    text-transform: capitalize;
  }
  .items {
    border-top: 1px solid var(--clr-grey-9);
    border-bottom: 1px solid var(--clr-grey-9);
    padding: 0.75rem 0;
    margin: 0.75rem 0;
  }
  .items li {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    margin-bottom: 0.4rem;
  }
  .row.total {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--clr-primary-5);
  }
  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  .btn-secondary {
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--clr-grey-6);
    border-radius: var(--radius);
    text-transform: uppercase;
    letter-spacing: var(--spacing);
    font-size: 0.875rem;
    color: var(--clr-grey-2);
  }
`

export default OrderSuccessPage
