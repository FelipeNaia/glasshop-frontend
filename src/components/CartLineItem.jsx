import { getImageUrl } from '../api/images'
import styles from './CartLineItem.module.css'

export default function CartLineItem({ item, onQuantityChange, onRemove }) {
  const { productId, name, price, imageId, quantity, lineTotal } = item
  const total = lineTotal ?? price * quantity

  return (
    <div className={styles.row}>
      <div className={styles.imageWrapper}>
        {imageId ? (
          <img src={getImageUrl(imageId)} alt={name} className={styles.image} />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>

      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        <span className={styles.unitPrice}>${(price / 100).toFixed(2)}</span>
      </div>

      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.stepBtn}
          onClick={() => onQuantityChange(productId, quantity - 1)}
          aria-label={`Decrease quantity of ${name}`}
        >
          −
        </button>
        <span className={styles.qty}>{quantity}</span>
        <button
          type="button"
          className={styles.stepBtn}
          onClick={() => onQuantityChange(productId, quantity + 1)}
          aria-label={`Increase quantity of ${name}`}
        >
          +
        </button>
      </div>

      <span className={styles.lineTotal}>${(total / 100).toFixed(2)}</span>

      <button
        type="button"
        className={styles.remove}
        onClick={() => onRemove(productId)}
        aria-label={`Remove ${name} from cart`}
      >
        ×
      </button>
    </div>
  )
}
