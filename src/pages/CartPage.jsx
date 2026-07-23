import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartLineItem from '../components/CartLineItem'
import styles from './CartPage.module.css'

export default function CartPage() {
  const { cart, setQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()

  const items = cart?.items ?? []
  const total = cart?.total ?? items.reduce((sum, item) => sum + (item.lineTotal ?? item.price * item.quantity), 0)

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Your Cart</h1>
        <div className={styles.empty}>
          <p className={styles.emptyText}>Your cart is empty.</p>
          <button className={styles.continueBtn} onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Your Cart</h1>

      <div className={styles.list}>
        {items.map(item => (
          <CartLineItem
            key={item.productId}
            item={item}
            onQuantityChange={setQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      <div className={styles.summary}>
        <span className={styles.summaryLabel}>Total</span>
        <span className={styles.summaryTotal}>${(total / 100).toFixed(2)}</span>
      </div>

      <button className={styles.checkoutBtn} disabled title="Checkout is coming soon">
        Checkout
      </button>
    </div>
  )
}
