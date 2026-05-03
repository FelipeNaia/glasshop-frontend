import axios from 'axios'

export function getProducts(params) {
  return axios.get('/api/products', { params }).then(r => r.data)
}

export function getProduct(id) {
  return axios.get(`/api/products/${id}`).then(r => r.data)
}

export function createProduct(data) {
  return axios.post('/api/products', data).then(r => r.data)
}

export function updateProduct(id, data) {
  return axios.put(`/api/products/${id}`, data).then(r => r.data)
}

export function toggleVisibility(id) {
  return axios.patch(`/api/products/${id}/visibility`).then(r => r.data)
}
