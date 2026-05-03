import styles from './TagFilter.module.css'

export default function TagFilter({ tags, selected, onToggle }) {
  return (
    <div className={styles.tagFilter}>
      {tags.map(tag => (
        <button
          key={tag}
          className={selected.includes(tag) ? styles.active : styles.tag}
          onClick={() => onToggle(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
