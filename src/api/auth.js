import axios from 'axios'

export function register(email, password) {
  return axios.post('/api/auth/register', { email, password }).then(r => r.data)
}

export function login(email, password) {
  return axios.post('/api/auth/login', { email, password }).then(r => r.data)
}

export function refresh(refreshToken) {
  return axios.post('/api/auth/refresh', { refreshToken }).then(r => r.data)
}

export function logout(refreshToken) {
  return axios.post('/api/auth/logout', { refreshToken }).then(r => r.data)
}
