import { NavLink } from 'react-router-dom'
import { SHOP_NAME } from '../config'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <div className={styles.logo}>{SHOP_NAME.toUpperCase()}</div>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : styles.link}>
            Shop
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? styles.active : styles.link}>
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
