import { NavLink, useNavigate } from 'react-router-dom'
import { SHOP_NAME } from '../config'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import CartBadge from './CartBadge'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <div className={styles.logo}>{SHOP_NAME.toUpperCase()}</div>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : styles.link}>
            Shop
          </NavLink>
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? styles.active : styles.link}>
              Admin
            </NavLink>
          )}
          {user && (
            <NavLink
              to="/cart"
              className={({ isActive }) => isActive ? styles.cartLinkActive : styles.cartLink}
              aria-label="Cart"
            >
              <svg className={styles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M4 6h2l1.6 9.6a2 2 0 0 0 2 1.7h7.1a2 2 0 0 0 2-1.6L20 8H7" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="20" r="1.2" fill="currentColor" stroke="none" />
                <circle cx="17" cy="20" r="1.2" fill="currentColor" stroke="none" />
              </svg>
              <CartBadge count={itemCount} />
            </NavLink>
          )}
          {user ? (
            <>
              <span className={styles.link}>{user.email}</span>
              <button className={styles.link} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => isActive ? styles.active : styles.link}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
