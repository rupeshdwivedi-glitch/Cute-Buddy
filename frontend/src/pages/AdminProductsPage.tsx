import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { PageHero, Loading } from '../components'
import apiClient, { getApiErrorMessage } from '../utils/apiClient'
import { formatPrice } from '../utils/helpers'
import { useAppSelector } from '../store/hooks'

type BackendProduct = {
  id: number
  name: string
  description: string | null
  category: string
  price: number
  stock: number
  image_url: string | null
  created_at: string
}

const emptyForm = {
  id: null as number | null,
  name: '',
  description: '',
  category: '',
  price: '',
  stock: '',
  image_url: '',
}

const AdminProductsPage = () => {
  const { token, user } = useAppSelector(state => state.auth)
  const [products, setProducts] = useState<BackendProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const isAdmin = user?.role === 'admin'

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await apiClient.get('/products', { params: { limit: 200 } })
      setProducts(data)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token && isAdmin) {
      fetchProducts()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [token, isAdmin])

  const resetForm = () => setForm(emptyForm)

  const startEdit = (product: BackendProduct) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image_url: product.image_url || '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    const payload = {
      name: form.name,
      description: form.description || undefined,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      image_url: form.image_url || undefined,
    }
    try {
      if (form.id) {
        await apiClient.put(`/products/${form.id}`, payload)
      } else {
        await apiClient.post('/products', payload)
      }
      resetForm()
      await fetchProducts()
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/products/${id}`)
      await fetchProducts()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  if (!token) {
    return (
      <main>
        <PageHero title='admin: products' />
        <Wrapper className='page-100'>
          <div className='empty'>
            <h2>please log in as an admin to manage products</h2>
            <Link to='/login' className='btn'>
              login
            </Link>
          </div>
        </Wrapper>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main>
        <PageHero title='admin: products' />
        <Wrapper className='page-100'>
          <div className='empty'>
            <h2>you don't have access to this page</h2>
            <Link to='/' className='btn'>
              back to home
            </Link>
          </div>
        </Wrapper>
      </main>
    )
  }

  return (
    <main>
      <PageHero title='admin: products' />
      <Wrapper className='page'>
        <section className='form-section'>
          <h4>{form.id ? `edit product #${form.id}` : 'add a new product'}</h4>
          {formError && <p className='error'>{formError}</p>}
          <form onSubmit={handleSubmit}>
            <div className='grid'>
              <div className='form-control'>
                <label>name</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className='form-control'>
                <label>category</label>
                <input
                  required
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div className='form-control'>
                <label>price</label>
                <input
                  required
                  type='number'
                  step='0.01'
                  min='0'
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className='form-control'>
                <label>stock</label>
                <input
                  required
                  type='number'
                  min='0'
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <div className='form-control span-2'>
                <label>image URL</label>
                <input
                  value={form.image_url}
                  onChange={e => setForm({ ...form, image_url: e.target.value })}
                  placeholder='https://...'
                />
              </div>
              <div className='form-control span-2'>
                <label>description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className='form-actions'>
              <button type='submit' className='btn' disabled={saving}>
                {saving ? 'saving...' : form.id ? 'update product' : 'create product'}
              </button>
              {form.id && (
                <button type='button' className='btn-secondary' onClick={resetForm}>
                  cancel edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className='list-section'>
          <h4>existing products</h4>
          {loading && <Loading />}
          {error && <p className='error'>{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p>no products yet &mdash; add one above.</p>
          )}
          {!loading && products.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>name</th>
                  <th>category</th>
                  <th>price</th>
                  <th>stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.stock}</td>
                    <td className='actions'>
                      <button type='button' onClick={() => startEdit(product)}>
                        edit
                      </button>
                      <button
                        type='button'
                        className='delete'
                        onClick={() => handleDelete(product.id)}
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </Wrapper>
    </main>
  )
}

const Wrapper = styled.div`
  max-width: 900px;
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
    margin-bottom: 1rem;
  }
  .form-section {
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    padding: 1.5rem;
    margin-bottom: 2.5rem;
  }
  .grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr;
  }
  .span-2 {
    grid-column: 1 / -1;
  }
  .form-control {
    label {
      display: block;
      margin-bottom: 0.25rem;
      text-transform: capitalize;
      letter-spacing: var(--spacing);
      font-size: 0.85rem;
    }
    input,
    textarea {
      width: 100%;
      padding: 0.5rem;
      background: var(--clr-white);
      border-radius: var(--radius);
      border: 1px solid var(--clr-grey-8);
    }
  }
  .form-actions {
    margin-top: 1.25rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    .btn {
      border: none;
    }
    .btn-secondary {
      background: transparent;
      border: 1px solid var(--clr-grey-6);
      border-radius: var(--radius);
      padding: 0.375rem 0.75rem;
      cursor: pointer;
    }
  }
  table {
    width: 100%;
    border-collapse: collapse;
    th,
    td {
      text-align: left;
      padding: 0.5rem;
      border-bottom: 1px solid var(--clr-grey-9);
    }
    .actions {
      display: flex;
      gap: 0.5rem;
      button {
        background: transparent;
        border: none;
        cursor: pointer;
        text-transform: capitalize;
        color: var(--clr-primary-5);
      }
      .delete {
        color: var(--clr-red-dark);
      }
    }
  }
`

export default AdminProductsPage
