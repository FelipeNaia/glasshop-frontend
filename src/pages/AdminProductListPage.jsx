import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, createProduct } from '../api/products'
import VisibilityToggle from '../components/VisibilityToggle'
import Pagination from '../components/Pagination'
import styles from './AdminProductListPage.module.css'

const PAGE_SIZE = 20

export default function AdminProductListPage() {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', stockQuantity: '', tags: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getProducts({ page, size: PAGE_SIZE }).then(data => {
      setProducts(data.content ?? data)
      setTotalPages(data.totalPages ?? 1)
    })
  }, [page])

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    try {
      await createProduct({
        name: form.name,
        price: parseInt(form.price, 10),
        stockQuantity: parseInt(form.stockQuantity, 10),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      })
      setShowModal(false)
      setForm({ name: '', price: '', stockQuantity: '', tags: '' })
      getProducts({ page, size: PAGE_SIZE }).then(data => {
        setProducts(data.content ?? data)
        setTotalPages(data.totalPages ?? 1)
      })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to create product')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Products</h1>
        <button className={styles.newBtn} onClick={() => setShowModal(true)}>+ New Product</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Tags</th>
            <th>Visible</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>${(p.price / 100).toFixed(2)}</td>
              <td>{p.tags?.join(', ')}</td>
              <td><VisibilityToggle productId={p.id} initial={p.visible} /></td>
              <td>
                <button className={styles.editBtn} onClick={() => navigate(`/admin/products/${p.id}`)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} />

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>New Product</h2>
            <form onSubmit={handleCreate} className={styles.form}>
              <label>Name<input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></label>
              <label>Price (cents)<input required type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></label>
              <label>Stock<input required type="number" min="0" value={form.stockQuantity} onChange={e => setForm(f => ({ ...f, stockQuantity: e.target.value }))} /></label>
              <label>Tags (comma-separated)<input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} /></label>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.actions}>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
