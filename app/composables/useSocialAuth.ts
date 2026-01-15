
import useApi from "~/composables/useApi";
import useUser from "./useUser"; 
import { genRand } from "~/utils/";
export default function() {
  const api = useApi();
  const userStore = useUser(); 
  const loading = ref(false)
  const error = ref<string | null>(null)

const initiateSocialLogin = async (provider: string) => {
    loading.value = true;
    try {
      const state = genRand(32); // Generate secure random string
      const redirectUri = `${window.location.origin}/auth/callback`;

      // Save these for the callback step
      localStorage.setItem('social_state', state);
      localStorage.setItem('social_redirect_uri', redirectUri);
      localStorage.setItem('social_provider', provider);

      const response = await api.post('api/auth/social/authorize', { 
        provider,
        redirectUri,
        state
      });
      console.log(response)

      if (response.data?.authorizationUrl) {
        window.location.href = response.data.authorizationUrl;
      }
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to initiate social login';
    } finally {
      loading.value = false;
    }
  };

  const handleSocialCallback = async (provider: string, code: string, state: string) => {
    loading.value = true;
    try {
      const savedRedirectUri = localStorage.getItem('social_redirect_uri');
      const savedState = localStorage.getItem('social_state');

      // Security Check: Verify state matches what we sent
      if (state !== savedState) {
        throw new Error("Invalid state parameter. Possible CSRF attack.");
      }

      const response = await api.post('api/auth/social/callback', {
        provider,
        code,
        redirectUri: savedRedirectUri,
        state
      });

      if (response.data?.access_token) {
        // Sync with your Pinia store
        userStore.setLoginData({
          access_token: response.data.access_token,
          id_token: response.data.id_token,
          role: response.data.roles?.[0] || 'end_user',
          expires: new Date(Date.now() + response.data.expires_in * 1000)
        });
        
        // Save the ID if your store needs it
        if (response.data.id) userStore.setId(response.data.id);
        
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Authentication failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

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