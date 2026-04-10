// composables/useApiInterceptors.ts
import axios, { type AxiosInstance } from 'axios'
import useBusinessUser from './business/useBusinessUser'
import useUser from './useUser'
import useSupportUser from './support/useSupportUser'

let refreshPromise: Promise<string> | null = null

export function applyAuthInterceptors(api: AxiosInstance) {
  const mainApiUrl = useRuntimeConfig().public.apiUrl
  const userStore = useUser()
  const businessStore = useBusinessUser()
  const supportStore = useSupportUser()

  api.interceptors.request.use(async (config) => {
    type ActiveStore =
      | ReturnType<typeof useBusinessUser>
      | ReturnType<typeof useUser>
      | ReturnType<typeof useSupportUser>

    let activeStore: ActiveStore | null = null
    let updateStore: (token: string, expiry: Date) => void = () => {}

    if (businessStore.isAuthenticated && businessStore.accessToken) {
      activeStore = businessStore
      updateStore = (token, expiry) =>
        businessStore.$patch({ accessToken: token, expires_in: expiry })
    } else if (userStore.isAuthenticated && userStore.accessToken) {
      activeStore = userStore
      updateStore = (token, expiry) =>
        userStore.$patch({ accessToken: token, expires_in: expiry })
    } else if (supportStore.isAuthenticated && supportStore.accessToken) {
      activeStore = supportStore
      updateStore = (token, expiry) =>
        supportStore.$patch({ accessToken: token, expires_in: expiry })
    }

    // No authenticated store — public route, skip auth header
    if (!activeStore) return config

    const now = new Date()
    const expires = new Date(activeStore.expires_in)
    const isExpired = expires <= now

    if (isExpired) {
      // Shared promise — concurrent requests all wait on the same refresh call
      if (!refreshPromise) {
        const currentToken = activeStore.accessToken!
        refreshPromise = axios
          .post(
            `${mainApiUrl}/api/auth/refresh`,
            null,
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${currentToken}` },
            }
          )
          .then((res) => {
            const newToken: string = res.data.access_token
            updateStore(newToken, new Date(now.getTime() + 23 * 60 * 60 * 1000))
            return newToken
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      try {
        await refreshPromise
      } catch (err) {
        console.error('Token refresh failed', err)
        // Proceed with old token — response interceptor handles 401
      }
    }

    // Always read from store to guarantee latest token value
    config.headers.set('Authorization', `Bearer ${activeStore.accessToken}`)

    return config
  },
  (error) => Promise.reject(error))

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && !error.config._retry) {
        error.config._retry = true
        businessStore.clearUser()
        userStore.clearUser()
        supportStore.clearUser()
        await navigateTo('/', { replace: true })
      }
      return Promise.reject(error)
    }
  )
}