import { useState } from 'react'
import styles from './TagInput.module.css'

export default function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('')

  function handleKeyDown(e) {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault()
      const tag = input.trim().toLowerCase()
      if (!tags.includes(tag)) {
        onChange([...tags, tag])
      }
      setInput('')
    }
  }

  function removeTag(tag) {
    onChange(tags.filter(t => t !== tag))
  }

  return (
    <div className={styles.container}>
      <div className={styles.tags}>
        {tags.map(tag => (
          <span key={tag} className={styles.tag}>
            {tag}
            <button onClick={() => removeTag(tag)}>×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tag, press Enter"
          className={styles.input}
        />
      </div>
    </div>
  )
}
