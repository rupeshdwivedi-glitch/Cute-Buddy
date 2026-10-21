import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useAppSelector } from '../../store/hooks'
import { useWishlistActions } from '../../hooks/useWishlistActions'
import { formatPrice } from '../../utils/helpers'

const Wishlist = () => {
  const { remove, clear } = useWishlistActions()
  const items = useAppSelector(state => state.wishlist.items)

  if (items.length < 1) {
    return (
      <Wrapper className='page-100'>
        <div className='empty'>
          <h2>Your wishlist is empty</h2>
          <Link to='/products' className='btn'>
            browse products
          </Link>
        </div>
      </Wrapper>
    )
  }

  return (
    <Wrapper className='page'>
      <div className='wishlist-grid'>
        {items.map(({ id, name, price, slug, images }) => (
          <article key={id} className='wishlist-item'>
            <Link to={`/products/${slug}`}>
              <img src={images[0]} alt={name} />
            </Link>
            <h5>{name}</h5>
            <p>{formatPrice(price)}</p>
            <button
              type='button'
              className='remove-btn'
              onClick={() => remove(id)}
            >
              remove
            </button>
          </article>
        ))}
      </div>
      <button
        type='button'
        className='btn clear-btn'
        onClick={() => clear()}
      >
        clear wishlist
      </button>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .empty {
    text-align: center;
    h2 {
      margin-bottom: 1rem;
      text-transform: none;
    }
  }
  .wishlist-grid {
    display: grid;
    gap: 2rem 1.5rem;
    grid-template-columns: 1fr;
  }
  .wishlist-item {
    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
      border-radius: var(--radius);
      margin-bottom: 1rem;
    }
    h5,
    p {
      margin-bottom: 0.25rem;
      font-weight: 400;
    }
    p {
      color: var(--clr-primary-5);
      letter-spacing: var(--spacing);
    }
  }
  .remove-btn {
    margin-top: 0.5rem;
    background: transparent;
    border: none;
    color: var(--clr-red-dark);
    cursor: pointer;
    text-transform: capitalize;
    padding: 0;
  }
  .clear-btn {
    margin-top: 2rem;
  }
  @media (min-width: 576px) {
    .wishlist-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 992px) {
    .wishlist-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`

export default Wishlist
