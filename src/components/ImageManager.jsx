import { useRef, useState } from 'react'
import { uploadImage, reorderImages, deleteImage } from '../api/images'
import ImagePreview from './ImagePreview'
import styles from './ImageManager.module.css'

export default function ImageManager({ productId, images, onChange }) {
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [dropActive, setDropActive] = useState(false)
  const fileRef = useRef()

  async function uploadFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const updated = await uploadImage(productId, file)
    onChange(updated.images)
  }

  async function handleUpload(e) {
    await uploadFile(e.target.files[0])
    e.target.value = ''
  }

  function handleDragEnter(e) {
    if (!e.dataTransfer.types.includes('Files')) return
    e.preventDefault()
    setDropActive(true)
  }

  function handleDragOver(e) {
    if (!e.dataTransfer.types.includes('Files')) return
    e.preventDefault()
  }

  function handleDragLeave(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return
    setDropActive(false)
  }

  async function handleDrop(e) {
    e.preventDefault()
    setDropActive(false)
    const file = e.dataTransfer.files[0]
    await uploadFile(file)
  }

  function handleDragStart(index) {
    setDraggingIndex(index)
  }

  function handleTilesDragOver(index) {
    if (draggingIndex === null || draggingIndex === index) return
    const reordered = [...images]
    const [moved] = reordered.splice(draggingIndex, 1)
    reordered.splice(index, 0, moved)
    setDraggingIndex(index)
    onChange(reordered)
  }

  async function handleTilesDrop() {
    setDraggingIndex(null)
    await reorderImages(productId, images.map(i => i.id))
  }

  async function handleDelete(imageId) {
    await deleteImage(productId, imageId)
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
            onDragOver={handleTilesDragOver}
            onDrop={handleTilesDrop}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <div
        className={`${styles.dropZone} ${dropActive ? styles.dropActive : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
      >
        {dropActive ? 'Drop to upload' : '+ Upload Image'}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
    </div>
  )
}
