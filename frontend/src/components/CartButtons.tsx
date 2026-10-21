
import { FaHeart, FaShoppingCart, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useProductsContext } from '../context/products_context'
import { useCartContext } from '../context/cart_context'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/authSlice'

const CartButtons = () => {
  const { closeSidebar } = useProductsContext()
  const { totalItems } = useCartContext()
  const wishlistCount = useAppSelector(state => state.wishlist.items.length)
  const { user } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  return (
    <Wrapper className='cart-btn-wrapper'>
      <Link to='/cart' className='cart-btn' onClick={closeSidebar}>

        <span className='cart-container'>
          <FaShoppingCart />
          <span className='cart-value'>{totalItems}</span>
        </span>
      </Link>
      <Link to='/wishlist' className='cart-btn' onClick={closeSidebar}>

        <span className='cart-container'>
          <FaHeart />
          <span className='cart-value'>{wishlistCount}</span>
        </span>
      </Link>
      {user ? (
        <div className='account-menu'>
          <button type='button' className='auth-btn'>
            <FaUser />
            <span className='account-name'>hi, {user.full_name || user.email}</span>
          </button>
          <div className='account-dropdown'>
            <Link to='/orders' onClick={closeSidebar}>
              my orders
            </Link>
            {user.role === 'admin' && (
              <Link to='/admin/products' onClick={closeSidebar}>
                manage products
              </Link>
            )}
            <button
              type='button'
              onClick={() => {
                dispatch(logout())
                closeSidebar()
              }}
            >
              logout
            </button>
          </div>
        </div>
      ) : (
        <Link to='/login' className='auth-btn' onClick={closeSidebar}>
          <FaUser />
          <span className='account-name'>login</span>
        </Link>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  column-gap: 1.5rem;
  align-items: center;
  width: auto;

  .account-menu {
    position: relative;
    &:hover .account-dropdown {
      display: flex;
    }
  }
  .account-dropdown {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--clr-white);
    box-shadow: var(--light-shadow);
    border-radius: var(--radius);
    padding: 0.5rem 0;
    min-width: 160px;
    z-index: 2;
    a,
    button {
      padding: 0.5rem 1rem;
      text-align: left;
      background: transparent;
      border: none;
      color: var(--clr-grey-1);
      text-transform: capitalize;
      cursor: pointer;
      font-size: 0.9rem;
      &:hover {
        background: var(--clr-grey-10);
      }
    }
  }
  .account-name {
    font-size: 0.85rem;
    margin-left: 0.4rem;
    white-space: nowrap;
  }

  .cart-btn {
    color: var(--clr-grey-1);
    font-size: 1.5rem;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-1);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .cart-container {
    display: flex;
    align-items: center;
    position: relative;
    svg {
      height: 1.6rem;
      margin-left: 5px;
    }
  }
  .cart-value {
    position: absolute;
    top: -10px;
    right: -16px;
    background: var(--clr-primary-5);
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;
    color: var(--clr-white);
    padding: 12px;
  }
  .auth-btn {
    display: flex;
    align-items: center;
    background: transparent;
    border-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--clr-grey-1);
    letter-spacing: var(--spacing);
    svg {
      margin-left: 5px;
    }
  }
`
export default CartButtons
