import styles from './CartBadge.module.css'

export default function CartBadge({ count }) {
  if (!count) return null
  return <span className={styles.badge}>{count}</span>
}
