import { NavLink, useNavigate } from 'react-router-dom'
import { SHOP_NAME } from '../config'
import { useAuth } from '../context/AuthContext'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const { user, logout } = useAuth()
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
