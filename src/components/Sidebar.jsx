import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>Glasshop</div>
      <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : undefined}>
        Shop
      </NavLink>
      <NavLink to="/admin" className={({ isActive }) => isActive ? styles.active : undefined}>
        Admin
      </NavLink>
    </nav>
  )
}
