import React from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import styled from 'styled-components'
import { useAppSelector } from '../../store/hooks'
import { useWishlistActions } from '../../hooks/useWishlistActions'
import { productDataType } from '../../utils/productData'

const WishlistButton: React.FC<{ product: productDataType }> = ({
  product,
}) => {
  const { toggle } = useWishlistActions()
  const isWishlisted = useAppSelector(state =>
    state.wishlist.items.some(item => item.id === product.id)
  )
  return (
    <Button
      type='button'
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={() => toggle(product)}
    >
      {isWishlisted ? <FaHeart /> : <FaRegHeart />}
    </Button>
  )
}

const Button = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 50%;
  background: var(--clr-white);
  color: var(--clr-primary-5);
  cursor: pointer;
  transition: var(--transition);
  svg {
    font-size: 1.1rem;
  }
  &:hover {
    transform: scale(1.1);
  }
`

export default WishlistButton
