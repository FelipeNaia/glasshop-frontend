import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext'
import Sidebar from './components/Sidebar'
import ShopPage from './pages/ShopPage'
import AdminProductListPage from './pages/AdminProductListPage'
import AdminProductEditPage from './pages/AdminProductEditPage'
import styles from './App.module.css'

export default function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <div className={styles.layout}>
          <Sidebar />
          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<ShopPage />} />
              <Route path="/admin" element={<AdminProductListPage />} />
              <Route path="/admin/products/:id" element={<AdminProductEditPage />} />
            </Routes>
          </main>
        </div>
      </ProductProvider>
    </BrowserRouter>
  )
}
