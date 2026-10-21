import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { formatPrice } from '../../utils/helpers'
import { Order } from '../../types/order'

const OrderCard: React.FC<{ order: Order; detailed?: boolean }> = ({
  order,
  detailed,
}) => {
  return (
    <Wrapper className='order'>
      <header>
        <div>
          <h5>
            {detailed ? (
              `order #${order.id}`
            ) : (
              <Link to={`/orders/${order.id}`}>order #{order.id}</Link>
            )}
          </h5>
          <p className='date'>{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <span className={`status status-${order.status}`}>{order.status}</span>
      </header>

      <ul>
        {order.items.map(item => (
          <li key={item.id}>
            <span>
              {item.product_name} &times; {item.quantity}
            </span>
            <span>{formatPrice(item.unit_price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      {detailed && (
        <div className='shipping'>
          <h6>delivery details</h6>
          <p>{order.full_name}</p>
          <p>{order.email}</p>
          <p>{order.phone}</p>
          <p>{order.address}</p>
          <p className='payment'>
            payment: {order.payment_method} &middot; {order.payment_status}
            <span className='demo-tag'>demo</span>
          </p>
        </div>
      )}

      <footer>
        <span>total</span>
        <span className='total'>{formatPrice(order.total_amount)}</span>
      </footer>

      {!detailed && (
        <Link to={`/orders/${order.id}`} className='view-link'>
          view details
        </Link>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.article`
  border: 1px solid var(--clr-grey-9);
  border-radius: var(--radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    h5 {
      margin-bottom: 0.25rem;
      a {
        color: var(--clr-grey-1);
      }
    }
    .date {
      color: var(--clr-grey-5);
      margin-bottom: 0;
      font-size: 0.8rem;
    }
  }
  .status {
    text-transform: capitalize;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius);
    font-size: 0.75rem;
    background: var(--clr-grey-9);
    color: var(--clr-grey-2);
  }
  .status-paid,
  .status-processing,
  .status-shipped,
  .status-delivered {
    background: var(--clr-green-light);
    color: var(--clr-white);
  }
  .status-cancelled {
    background: var(--clr-red-light);
    color: var(--clr-white);
  }
  ul {
    border-top: 1px solid var(--clr-grey-9);
    padding-top: 0.75rem;
  }
  li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  .shipping {
    border-top: 1px solid var(--clr-grey-9);
    padding-top: 0.75rem;
    margin-top: 0.5rem;
    h6 {
      text-transform: uppercase;
      font-size: 0.75rem;
      color: var(--clr-grey-5);
      margin-bottom: 0.5rem;
    }
    p {
      font-size: 0.85rem;
      margin-bottom: 0.25rem;
    }
    .payment {
      text-transform: capitalize;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .demo-tag {
      background: var(--clr-primary-9);
      color: var(--clr-primary-1);
      font-size: 0.65rem;
      text-transform: uppercase;
      padding: 0.1rem 0.4rem;
      border-radius: var(--radius);
    }
  }
  footer {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid var(--clr-grey-9);
    padding-top: 0.75rem;
    margin-top: 0.5rem;
    font-weight: 700;
    .total {
      color: var(--clr-primary-5);
    }
  }
  .view-link {
    display: inline-block;
    margin-top: 0.75rem;
    font-size: 0.85rem;
    color: var(--clr-primary-5);
  }
`

export default OrderCard
