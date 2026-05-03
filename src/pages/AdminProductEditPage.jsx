import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct, updateProduct } from '../api/products'
import TagInput from '../components/TagInput'
import ImageManager from '../components/ImageManager'
import styles from './AdminProductEditPage.module.css'

export default function AdminProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', price: '', stockQuantity: '' })
  const [tags, setTags] = useState([])
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getProduct(id).then(p => {
      setForm({ name: p.name, price: p.price, stockQuantity: p.stockQuantity })
      setTags(p.tags ?? [])
      setImages(p.images ?? [])
      setLoading(false)
    })
  }, [id])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateProduct(id, {
        name: form.name,
        price: parseInt(form.price, 10),
        stockQuantity: parseInt(form.stockQuantity, 10),
        tags,
      })
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className={styles.loading}>Loading…</p>

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/admin')}>← Back</button>
      <h1 className={styles.title}>Edit Product</h1>
      <form onSubmit={handleSave} className={styles.form}>
        <label>
          Name
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </label>
        <label>
          Price (cents)
          <input required type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
        </label>
        <label>
          Stock quantity
          <input required type="number" min="0" value={form.stockQuantity} onChange={e => setForm(f => ({ ...f, stockQuantity: e.target.value }))} />
        </label>
        <label>Tags</label>
        <TagInput tags={tags} onChange={setTags} />

        <label className={styles.sectionLabel}>Images</label>
        <ImageManager productId={id} images={images} onChange={setImages} />

        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  )
}
