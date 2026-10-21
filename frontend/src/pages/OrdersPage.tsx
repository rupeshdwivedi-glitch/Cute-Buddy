import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { PageHero, Loading } from '../components'
import apiClient, { getApiErrorMessage } from '../utils/apiClient'
import { useAppSelector } from '../store/hooks'
import { Order } from '../types/order'
import OrdersList from '../components/Orders/OrdersList'

const OrdersPage = () => {
  const token = useAppSelector(state => state.auth.token)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    const fetchOrders = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await apiClient.get('/orders')
        setOrders(data)
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [token])

  if (!token) {
    return (
      <main>
        <PageHero title='my orders' />
        <Wrapper className='page-100'>
          <div className='empty'>
            <h2>please log in to view your orders</h2>
            <Link to='/login' className='btn'>
              login
            </Link>
          </div>
        </Wrapper>
      </main>
    )
  }

  if (loading) {
    return <Loading />
  }

  return (
    <main>
      <PageHero title='my orders' />
      <Wrapper className='page'>
        {error && <p className='error'>{error}</p>}
        {!error && <OrdersList orders={orders} />}
      </Wrapper>
    </main>
  )
}

const Wrapper = styled.div`
  .empty {
    text-align: center;
    h2 {
      margin-bottom: 1rem;
      text-transform: none;
    }
  }
  .error {
    color: var(--clr-red-dark);
    text-align: center;
  }
`

export default OrdersPage
