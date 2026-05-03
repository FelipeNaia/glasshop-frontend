import { getImageUrl } from '../api/images'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const primaryImage = product.images?.length
    ? product.images.reduce((a, b) => (a.priority <= b.priority ? a : b))
    : null

  return (
    <div className={styles.card}>
      {primaryImage ? (
        <img src={getImageUrl(primaryImage.id)} alt={product.name} className={styles.image} />
      ) : (
        <div className={styles.placeholder}>No image</div>
      )}
      <div className={styles.info}>
        <span className={styles.name}>{product.name}</span>
        <span className={styles.price}>${(product.price / 100).toFixed(2)}</span>
      </div>
    </div>
  )
}
