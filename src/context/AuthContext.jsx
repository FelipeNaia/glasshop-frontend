import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'
import {
  getStoredRefreshToken,
  setAccessToken as setAxiosAccessToken,
  setRefreshHandler,
  setStoredRefreshToken,
} from '../api/authToken'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const applyAuth = useCallback(auth => {
    setAxiosAccessToken(auth.accessToken)
    setStoredRefreshToken(auth.refreshToken)
    setUser({ id: auth.userId, email: auth.email, role: auth.role })
  }, [])

  const clearAuth = useCallback(() => {
    setAxiosAccessToken(null)
    setStoredRefreshToken(null)
    setUser(null)
  }, [])

  const refreshAccessToken = useCallback(async () => {
    const storedToken = getStoredRefreshToken()
    if (!storedToken) {
      clearAuth()
      throw new Error('No refresh token available')
    }
    try {
      const auth = await authApi.refresh(storedToken)
      applyAuth(auth)
      return auth.accessToken
    } catch (err) {
      clearAuth()
      throw err
    }
  }, [applyAuth, clearAuth])

  useEffect(() => {
    setRefreshHandler(refreshAccessToken)
  }, [refreshAccessToken])

  useEffect(() => {
    if (!getStoredRefreshToken()) {
      setIsLoading(false)
      return
    }
    refreshAccessToken()
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [refreshAccessToken])

  async function login(email, password) {
    const auth = await authApi.login(email, password)
    applyAuth(auth)
  }

  async function register(email, password) {
    await authApi.register(email, password)
    await login(email, password)
  }

  async function logout() {
    const storedToken = getStoredRefreshToken()
    if (storedToken) {
      try {
        await authApi.logout(storedToken)
      } catch {
        // best-effort — clear local state regardless of server response
      }
    }
    clearAuth()
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
