import { useState } from 'react'
import { toggleVisibility } from '../api/products'
import styles from './VisibilityToggle.module.css'

export default function VisibilityToggle({ productId, initial }) {
  const [visible, setVisible] = useState(initial)
  const [busy, setBusy] = useState(false)

  async function handleChange() {
    setBusy(true)
    setVisible(v => !v)
    try {
      await toggleVisibility(productId)
    } catch {
      setVisible(v => !v)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      className={`${styles.toggle} ${visible ? styles.on : styles.off}`}
      onClick={handleChange}
      disabled={busy}
      title={visible ? 'Visible' : 'Hidden'}
    >
      {visible ? 'On' : 'Off'}
    </button>
  )
}
