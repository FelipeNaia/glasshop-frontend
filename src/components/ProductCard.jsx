import { useNavigate } from 'react-router-dom'
import { getImageUrl } from '../api/images'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const primaryImage = product.images?.length
    ? product.images.reduce((a, b) => (a.priority <= b.priority ? a : b))
    : null

  return (
    <div className={styles.card} onClick={() => navigate(`/products/${product.id}`)}>
      <div className={styles.imageWrapper}>
        {primaryImage ? (
          <img src={getImageUrl(primaryImage.id)} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.placeholder} />
        )}
        <div className={styles.overlay}>
          <span className={styles.quickView}>Quick View</span>
        </div>
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{product.name}</span>
        <span className={styles.price}>${(product.price / 100).toFixed(2)}</span>
      </div>
    </div>
  )
}
