import axios from 'axios'

const REFRESH_TOKEN_KEY = 'refreshToken'

let accessToken = null
let refreshHandler = null
let refreshInFlight = null

export function setAccessToken(token) {
  accessToken = token
}

export function getStoredRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setStoredRefreshToken(token) {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

// Set once by AuthProvider: a function that performs the refresh, updates
// stored state, and returns the new access token (or throws).
export function setRefreshHandler(fn) {
  refreshHandler = fn
}

axios.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

axios.interceptors.response.use(
  response => response,
  async error => {
    const { config, response } = error
    const isAuthRoute = config?.url?.startsWith('/api/auth/')

    if (response?.status === 401 && !config._retried && !isAuthRoute && refreshHandler) {
      config._retried = true
      try {
        refreshInFlight = refreshInFlight ?? refreshHandler().finally(() => {
          refreshInFlight = null
        })
        const newAccessToken = await refreshInFlight
        config.headers.Authorization = `Bearer ${newAccessToken}`
        return axios(config)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
