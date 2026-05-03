import { getImageUrl } from '../api/images'
import styles from './ImagePreview.module.css'

export default function ImagePreview({ image, index, onDragStart, onDragOver, onDrop, onDelete }) {
  return (
    <div
      className={styles.tile}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={e => { e.preventDefault(); onDragOver(index) }}
      onDrop={() => onDrop(index)}
    >
      <div className={styles.handle} title="Drag to reorder">⠿</div>
      <img src={getImageUrl(image.id)} alt="" className={styles.img} />
      <button className={styles.delete} onClick={() => onDelete(image.id)} title="Remove">×</button>
    </div>
  )
}
