import useApi from "~/composables/useApi";
import useUser from "./useUser"; 
import { genRand } from "~/utils/";

export default function() {
  const api = useApi();
  const userStore = useUser(); 
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ✅ Opens Google/social login in a popup instead of redirecting
  const initiateSocialLogin = async (provider: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const state = genRand(32);
      const redirectUri = `${window.location.origin}/auth/callback`;

      localStorage.setItem('social_state', state);
      localStorage.setItem('social_redirect_uri', redirectUri);
      localStorage.setItem('social_provider', provider);

      const response = await api.post('api/auth/social/authorize', { 
        provider,
        redirectUri,
        state
      });

      if (!response.data?.authorizationUrl) {
        throw new Error('No authorization URL returned');
      }

      // ✅ Open in popup instead of redirecting
      return await openSocialLoginPopup(response.data.authorizationUrl);

    } catch (err: any) {
      error.value = err.data?.message || 'Failed to initiate social login';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Opens a popup and waits for the callback message
  const openSocialLoginPopup = (authorizationUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Popup dimensions and position
      const width = 500;
      const height = 500;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authorizationUrl,
        'SocialLogin',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        error.value = 'Popup was blocked. Please allow popups for this site.';
        resolve(false);
        return;
      }

      // ✅ Listen for message from callback page
      const handleMessage = async (event: MessageEvent) => {
        // Security: Only accept messages from your own origin
        if (event.origin !== window.location.origin) return;

        if (event.data?.type === 'SOCIAL_AUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage);
          popup.close();

          // ✅ Store the auth data sent from the popup
          const { access_token, id_token, roles, expires_in, id } = event.data;

          userStore.setLoginData({
            access_token,
            id_token,
            role: roles?.[0] || 'end_user',
            expires: new Date(Date.now() + expires_in * 1000)
          });

          if (id) userStore.setId(id);

          resolve(true);
        }

        if (event.data?.type === 'SOCIAL_AUTH_ERROR') {
          window.removeEventListener('message', handleMessage);
          popup.close();
          error.value = event.data.message || 'Authentication failed';
          resolve(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // ✅ Detect if user closes popup manually
      const popupCheckInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupCheckInterval);
          window.removeEventListener('message', handleMessage);
          // Only resolve false if we haven't already resolved
          loading.value = false;
          resolve(false);
        }
      }, 500);
    });
  };

  const handleSocialCallback = async (provider: string, code: string, state: string) => {
    loading.value = true;
    try {
      const savedRedirectUri = localStorage.getItem('social_redirect_uri');
      const savedState = localStorage.getItem('social_state');

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
        return response.data; // ✅ Return data instead of storing it here
      }
      return null;
    } catch (err: any) {
      error.value = err.message || 'Authentication failed';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const linkSocialAccount = async (provider: string, code: string) => {
    try {
      await api.post('api/auth/social/link', { provider, code });
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    initiateSocialLogin,
    handleSocialCallback,
    linkSocialAccount,
    loading,
    error
  };
}