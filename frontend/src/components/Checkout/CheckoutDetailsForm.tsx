import React, { useState } from 'react'
import styled from 'styled-components'

export type CheckoutDetails = {
  full_name: string
  email: string
  phone: string
  address: string
}

type FormErrors = Partial<Record<keyof CheckoutDetails, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/

const validate = (values: CheckoutDetails): FormErrors => {
  const errors: FormErrors = {}
  if (!values.full_name.trim()) errors.full_name = 'full name is required'
  if (!values.email.trim()) {
    errors.email = 'email is required'
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'enter a valid email address'
  }
  if (!values.phone.trim()) {
    errors.phone = 'phone number is required'
  } else if (!PHONE_PATTERN.test(values.phone)) {
    errors.phone = 'enter a valid phone number'
  }
  if (!values.address.trim()) errors.address = 'delivery address is required'
  return errors
}

const CheckoutDetailsForm: React.FC<{
  onSubmit: (values: CheckoutDetails) => void
  submitting: boolean
  submitError: string
}> = ({ onSubmit, submitting, submitError }) => {
  const [values, setValues] = useState<CheckoutDetails>({
    full_name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (field: keyof CheckoutDetails) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({ ...values, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: undefined })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values)
    }
  }

  return (
    <Wrapper onSubmit={handleSubmit} noValidate>
      <h4>delivery details</h4>
      <p className='demo-note'>
        Demo checkout &mdash; no real payment gateway is connected. Placing an
        order will mark it as paid automatically.
      </p>
      {submitError && <p className='error submit-error'>{submitError}</p>}

      <div className='form-control'>
        <label htmlFor='full_name'>full name</label>
        <input
          id='full_name'
          type='text'
          value={values.full_name}
          onChange={handleChange('full_name')}
        />
        {errors.full_name && <span className='error'>{errors.full_name}</span>}
      </div>

      <div className='form-control'>
        <label htmlFor='email'>email address</label>
        <input
          id='email'
          type='email'
          value={values.email}
          onChange={handleChange('email')}
        />
        {errors.email && <span className='error'>{errors.email}</span>}
      </div>

      <div className='form-control'>
        <label htmlFor='phone'>phone number</label>
        <input
          id='phone'
          type='tel'
          value={values.phone}
          onChange={handleChange('phone')}
        />
        {errors.phone && <span className='error'>{errors.phone}</span>}
      </div>

      <div className='form-control'>
        <label htmlFor='address'>delivery address</label>
        <textarea
          id='address'
          rows={3}
          value={values.address}
          onChange={handleChange('address')}
        />
        {errors.address && <span className='error'>{errors.address}</span>}
      </div>

      <button type='submit' className='btn' disabled={submitting}>
        {submitting ? 'placing order...' : 'place order'}
      </button>
    </Wrapper>
  )
}

const Wrapper = styled.form`
  h4 {
    margin-bottom: 0.5rem;
  }
  .demo-note {
    background: var(--clr-primary-10);
    color: var(--clr-primary-1);
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius);
    font-size: 0.8rem;
    margin-bottom: 1.25rem;
  }
  .form-control {
    margin-bottom: 1.1rem;
    label {
      display: block;
      margin-bottom: 0.35rem;
      text-transform: capitalize;
      letter-spacing: var(--spacing);
      font-size: 0.85rem;
    }
    input,
    textarea {
      width: 100%;
      padding: 0.5rem;
      background: var(--clr-grey-10);
      border-radius: var(--radius);
      border: 1px solid transparent;
    }
  }
  .error {
    color: var(--clr-red-dark);
    font-size: 0.75rem;
    display: block;
    margin-top: 0.25rem;
  }
  .submit-error {
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
  .btn {
    width: 100%;
    border: none;
    margin-top: 0.5rem;
  }
`

export default CheckoutDetailsForm
