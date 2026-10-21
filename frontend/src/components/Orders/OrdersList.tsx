import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import OrderCard from './OrderCard'
import { Order } from '../../types/order'

const OrdersList: React.FC<{ orders: Order[] }> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <Wrapper>
        <div className='empty'>
          <h2>you have no orders yet</h2>
          <Link to='/products' className='btn'>
            browse products
          </Link>
        </div>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
  .empty {
    text-align: center;
    h2 {
      margin-bottom: 1rem;
      text-transform: none;
    }
  }
`

export default OrdersList
