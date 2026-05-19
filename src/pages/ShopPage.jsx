import { useEffect, useState } from 'react'
import { getProducts } from '../api/products'
import ProductCard from '../components/ProductCard'
import TagFilter from '../components/TagFilter'
import Pagination from '../components/Pagination'
import styles from './ShopPage.module.css'
import { SHOP_TAGLINE, SHOP_SUBTITLE } from '../config'

const PAGE_SIZE = 12
const KNOWN_TAGS = ['male', 'female']

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedTags, setSelectedTags] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const params = { visible: true, page, size: PAGE_SIZE }
    if (selectedTags.length) params.tags = selectedTags.join(',')
    getProducts(params)
      .then(data => {
        setProducts(data.content ?? data)
        setTotalPages(data.totalPages ?? 1)
      })
      .finally(() => setLoading(false))
  }, [page, selectedTags])

  function toggleTag(tag) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
    setPage(0)
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Nova coleção'</p>
        <h1 className={styles.heroTitle}>{SHOP_TAGLINE}</h1>
        <p className={styles.heroSub}>{SHOP_SUBTITLE}</p>
      </div>

      <div className={styles.catalog}>
        <div className={styles.filterBar}>
          <TagFilter tags={KNOWN_TAGS} selected={selectedTags} onToggle={toggleTag} />
        </div>

        {loading ? (
          <p className={styles.loading}>Loading…</p>
        ) : (
          <div className={styles.grid}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage(p => p - 1)}
          onNext={() => setPage(p => p + 1)}
        />
      </div>
    </div>
  )
}
