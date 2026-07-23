import axios from 'axios'

export function getCart() {
  return axios.get('/api/cart').then(r => r.data)
}

export function addItem(productId, quantity) {
  return axios.post('/api/cart/items', { productId, quantity }).then(r => r.data)
}

export function updateItemQuantity(productId, quantity) {
  return axios.patch(`/api/cart/items/${productId}`, { quantity }).then(r => r.data)
}

export function removeItem(productId) {
  return axios.delete(`/api/cart/items/${productId}`).then(r => r.data)
}

export function clearCart() {
  return axios.delete('/api/cart').then(r => r.data)
}
