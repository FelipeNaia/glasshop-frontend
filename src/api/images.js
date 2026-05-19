import axios from 'axios'

export function uploadImage(productId, file) {
  const form = new FormData()
  form.append('file', file)
  return axios.post(`/api/images/products/${productId}`, form).then(r => r.data)
}

export function reorderImages(productId, imageIds) {
  return axios.put(`/api/images/products/${productId}/reorder`, { imageIds }).then(r => r.data)
}

export function deleteImage(productId, imageId) {
  return axios.delete(`/api/images/products/${productId}/${imageId}`).then(r => r.data)
}

export function getImageUrl(imageId) {
  return `/api/images/${imageId}`
}
