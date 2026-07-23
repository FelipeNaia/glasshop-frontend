import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getProduct } from '../api/products'
import { getImageUrl } from '../api/images'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import styles from './ProductPage.module.css'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [addState, setAddState] = useState('idle') // idle | adding | added | error

  useEffect(() => {
    getProduct(id).then(p => {
      const sorted = [...(p.images ?? [])].sort((a, b) => a.priority - b.priority)
      setProduct({ ...p, images: sorted })
      setActiveIdx(0)
    })
  }, [id])

  if (!product) {
    return <div className={styles.loading}>Loading…</div>
  }

  const { name, price, stockQuantity, tags, images } = product
  const activeImage = images[activeIdx] ?? null

  async function handleAddToCart() {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
    setAddState('adding')
    try {
      await addToCart(product.id, 1)
      setAddState('added')
      setTimeout(() => setAddState('idle'), 1500)
    } catch {
      setAddState('error')
      setTimeout(() => setAddState('idle'), 1500)
    }
  }

  const addToCartLabel =
    stockQuantity === 0 ? 'Sold Out'
    : addState === 'adding' ? 'Adding…'
    : addState === 'added' ? 'Added ✓'
    : addState === 'error' ? 'Try Again'
    : 'Add to Cart'

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            {activeImage ? (
              <img src={getImageUrl(activeImage.id)} alt={name} />
            ) : (
              <div className={styles.noImage} />
            )}
          </div>

          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  className={idx === activeIdx ? styles.thumbActive : styles.thumb}
                  onClick={() => setActiveIdx(idx)}
                >
                  <img src={getImageUrl(img.id)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.details}>
          {tags?.length > 0 && (
            <div className={styles.tags}>
              {tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
            </div>
          )}

          <h1 className={styles.name}>{name}</h1>
          <p className={styles.price}>${(price / 100).toFixed(2)}</p>

          <div className={styles.divider} />

          <div className={styles.stockRow}>
            <span className={stockQuantity > 0 ? styles.inStock : styles.outOfStock}>
              {stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <button
            className={styles.addToCart}
            disabled={stockQuantity === 0 || addState === 'adding'}
            onClick={handleAddToCart}
          >
            {addToCartLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
