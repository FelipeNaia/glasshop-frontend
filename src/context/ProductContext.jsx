import { createContext, useContext, useState } from 'react'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  return (
    <ProductContext.Provider value={{ products, setProducts, page, setPage, totalPages, setTotalPages }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProductContext() {
  return useContext(ProductContext)
}
