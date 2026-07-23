import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import RequireAdmin from './components/RequireAdmin'
import Sidebar from './components/Sidebar'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminProductListPage from './pages/AdminProductListPage'
import AdminProductEditPage from './pages/AdminProductEditPage'
import styles from './App.module.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <div className={styles.layout}>
            <Sidebar />
            <main className={styles.main}>
              <Routes>
                <Route path="/" element={<ShopPage />} />
                <Route path="/products/:id" element={<ProductPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<RequireAdmin />}>
                  <Route path="/admin" element={<AdminProductListPage />} />
                  <Route path="/admin/products/:id" element={<AdminProductEditPage />} />
                </Route>
              </Routes>
            </main>
          </div>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
