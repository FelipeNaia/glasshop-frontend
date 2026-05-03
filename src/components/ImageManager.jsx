import { useRef, useState } from 'react'
import { uploadImage, reorderImages } from '../api/images'
import ImagePreview from './ImagePreview'
import styles from './ImageManager.module.css'

export default function ImageManager({ productId, images, onChange }) {
  const [draggingIndex, setDraggingIndex] = useState(null)
  const fileRef = useRef()

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const updated = await uploadImage(productId, file)
    onChange(updated.images)
    e.target.value = ''
  }

  function handleDragStart(index) {
    setDraggingIndex(index)
  }

  function handleDragOver(index) {
    if (draggingIndex === null || draggingIndex === index) return
    const reordered = [...images]
    const [moved] = reordered.splice(draggingIndex, 1)
    reordered.splice(index, 0, moved)
    setDraggingIndex(index)
    onChange(reordered)
  }

  async function handleDrop() {
    setDraggingIndex(null)
    await reorderImages(productId, images.map(i => i.id))
  }

  function handleDelete(imageId) {
    onChange(images.filter(i => i.id !== imageId))
  }

  return (
    <div className={styles.manager}>
      <div className={styles.list}>
        {images.map((img, idx) => (
          <ImagePreview
            key={img.id}
            image={img}
            index={idx}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <button type="button" className={styles.upload} onClick={() => fileRef.current.click()}>
        + Upload Image
      </button>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
    </div>
  )
}
