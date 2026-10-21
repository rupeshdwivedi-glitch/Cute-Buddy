import React, { useState } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { PageHero } from '../components'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { signup, clearAuthError } from '../store/authSlice'
import { useWishlistActions } from '../hooks/useWishlistActions'

const SignupPage = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const { status, error, token } = useAppSelector(state => state.auth)
  const { syncFromBackend } = useWishlistActions()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (token) {
    history.push('/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(
      signup({ email, password, full_name: fullName || undefined })
    )
    if (signup.fulfilled.match(result)) {
      await syncFromBackend()
      history.push('/')
    }
  }

  return (
    <main>
      <PageHero title='sign up' />
      <Wrapper className='page-100'>
        <form onSubmit={handleSubmit}>
          <h3>create an account</h3>
          {error && <p className='error'>{error}</p>}
          <div className='form-control'>
            <label htmlFor='fullName'>full name</label>
            <input
              id='fullName'
              type='text'
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          </div>
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
              minLength={6}
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                dispatch(clearAuthError())
              }}
            />
          </div>
          <button type='submit' className='btn' disabled={status === 'loading'}>
            {status === 'loading' ? 'creating account...' : 'sign up'}
          </button>
          <p className='switch'>
            already have an account? <Link to='/login'>login</Link>
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

export default SignupPage
