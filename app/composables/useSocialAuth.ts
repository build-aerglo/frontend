
import useApi from "~/composables/useApi";
import useUser from "./useUser"; 

export default function() {
  const api = useApi();
  const userStore = useUser(); 
  const loading = ref(false)
  const error = ref<string | null>(null)

const initiateSocialLogin = async (provider: string) => {
  loading.value = true
  try {
    const redirectUri = `${window.location.origin}/auth/callback`

    const response = await api.post('api/auth/social/authorize', { 
      provider,
      redirectUri
    })

    console.log('Full Response Body:', response.data)

    // Match the key from your JSON response
    if (response.data && response.data.authorizationUrl) {
      window.location.href = response.data.authorizationUrl
    } else {
      console.error('Key "authorizationUrl" not found in response:', response.data)
    }
    
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to initiate social login'
    console.error('Social Auth Error:', err)
  } finally {
    loading.value = false
  }
}

  const handleSocialCallback = async (provider: string, code: string, state?: string) => {
    loading.value = true
    try {
      const response = await api.post('api/auth/social/callback', {
        provider,
        code,
        state
      })

      if (response.data && response.data.access_token) {
        // Matching your store's setLoginData payload
        userStore.setLoginData({
          access_token: response.data.access_token,
          id_token: response.data.id_token,
          role: response.data.role || 'user',
          expires: response.data.expires_in ? new Date(Date.now() + response.data.expires_in * 1000) : new Date()
        })
        
        // If your backend returns user data in the callback, set it here
        if (response.data.user) {
          userStore.setUserData(response.data.user)
        }
        
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.data?.message || 'Authentication failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const linkSocialAccount = async (provider: string, code: string) => {
    try {
      // Fixed: changed $api to api
      await api.post('api/auth/social/link', { provider, code })
      return true
    } catch (err) {
      return false
    }
  }

  return {
    initiateSocialLogin,
    handleSocialCallback,
    linkSocialAccount,
    loading,
    error
  }
}