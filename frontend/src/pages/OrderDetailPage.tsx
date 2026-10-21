import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link, useParams } from 'react-router-dom'
import { PageHero, Loading } from '../components'
import apiClient, { getApiErrorMessage } from '../utils/apiClient'
import { useAppSelector } from '../store/hooks'
import { Order } from '../types/order'
import OrderCard from '../components/Orders/OrderCard'

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const token = useAppSelector(state => state.auth.token)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    const fetchOrder = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await apiClient.get(`/orders/${id}`)
        setOrder(data)
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [token, id])

  if (!token) {
    return (
      <main>
        <PageHero title='order details' />
        <Wrapper className='page-100'>
          <div className='empty'>
            <h2>please log in to view this order</h2>
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
      <PageHero title={`order #${id}`} />
      <Wrapper className='page'>
        <Link to='/orders' className='back-link'>
          &larr; back to my orders
        </Link>
        {error && <p className='error'>{error}</p>}
        {!error && order && <OrderCard order={order} detailed />}
      </Wrapper>
    </main>
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
  .error {
    color: var(--clr-red-dark);
    text-align: center;
  }
  .back-link {
    display: inline-block;
    margin-bottom: 1.5rem;
    color: var(--clr-primary-5);
  }
`

export default OrderDetailPage
