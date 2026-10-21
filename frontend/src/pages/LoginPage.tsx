import React, { useState } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { PageHero } from '../components'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { login, clearAuthError } from '../store/authSlice'
import { useWishlistActions } from '../hooks/useWishlistActions'

const LoginPage = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const { status, error, token } = useAppSelector(state => state.auth)
  const { syncFromBackend } = useWishlistActions()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (token) {
    history.push('/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(login({ email, password }))
    if (login.fulfilled.match(result)) {
      await syncFromBackend()
      history.push('/')
    }
  }

  return (
    <main>
      <PageHero title='login' />
      <Wrapper className='page-100'>
        <form onSubmit={handleSubmit}>
          <h3>login to your account</h3>
          {error && <p className='error'>{error}</p>}
          <div className='form-control'>
            <label htmlFor='email'>email</label>
            <input
              id='email'
              type='email'
              required
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                dispatch(clearAuthError())
              }}
            />
          </div>
          <div className='form-control'>
            <label htmlFor='password'>password</label>
            <input
              id='password'
              type='password'
              required
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                dispatch(clearAuthError())
              }}
            />
          </div>
          <button type='submit' className='btn' disabled={status === 'loading'}>
            {status === 'loading' ? 'logging in...' : 'login'}
          </button>
          <p className='switch'>
            don't have an account? <Link to='/signup'>sign up</Link>
          </p>
        </form>
      </Wrapper>
    </main>
  )
}

const Wrapper = styled.div`
  display: grid;
  place-items: center;
  form {
    width: 100%;
    max-width: 400px;
  }
  h3 {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  .form-control {
    margin-bottom: 1.25rem;
    label {
      display: block;
      margin-bottom: 0.5rem;
      text-transform: capitalize;
      letter-spacing: var(--spacing);
    }
    input {
      width: 100%;
      padding: 0.5rem;
      background: var(--clr-grey-10);
      border-radius: var(--radius);
      border-color: transparent;
    }
  }
  .btn {
    width: 100%;
    border: none;
  }
  .error {
    color: var(--clr-red-dark);
    margin-bottom: 1rem;
  }
  .switch {
    margin-top: 1rem;
    text-align: center;
    a {
      color: var(--clr-primary-5);
    }
  }
`

export default LoginPage
