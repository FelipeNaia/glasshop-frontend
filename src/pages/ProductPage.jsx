import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct } from '../api/products'
import { getImageUrl } from '../api/images'
import styles from './ProductPage.module.css'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [activeIdx, setActiveIdx] = useState(0)

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

          <button className={styles.addToCart} disabled={stockQuantity === 0}>
            {stockQuantity > 0 ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  )
}
