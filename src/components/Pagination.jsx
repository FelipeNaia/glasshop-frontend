import styles from './Pagination.module.css'

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className={styles.pagination}>
      <button onClick={onPrev} disabled={page === 0}>Previous</button>
      <span>{page + 1} / {totalPages || 1}</span>
      <button onClick={onNext} disabled={page >= totalPages - 1}>Next</button>
    </div>
  )
}
