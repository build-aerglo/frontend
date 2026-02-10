import { ref, onMounted, onUnmounted } from 'vue';
import useUser from './useUser';
import useBusinessUser from './business/useBusinessUser';
import useSupportUser from './support/useSupportUser';
import useMethods from './useMethods';

export default function useAutoLogout() {
  const userStore = useUser();
  const businessStore = useBusinessUser();
  const supportStore = useSupportUser();
  const { clearAllStores } = useMethods();
  
  let checkInterval: NodeJS.Timeout | null = null;
  const isChecking = ref(false);

  /**
   * Check if any active session has expired
   */
  const checkSessionExpiry = () => {
    if (isChecking.value) return;
    
    isChecking.value = true;
    const now = new Date();

    // Check business user session
    if (businessStore.isAuthenticated && businessStore.expires_in) {
      const expires = new Date(businessStore.expires_in);
      if (now >= expires) {
        console.warn('Business user session expired - logging out');
        handleAutoLogout('business_user');
        isChecking.value = false;
        return;
      }
    }

    // Check end user session
    if (userStore.isAuthenticated && userStore.expires_in) {
      const expires = new Date(userStore.expires_in);
      if (now >= expires) {
        console.warn('End user session expired - logging out');
        handleAutoLogout('end_user');
        isChecking.value = false;
        return;
      }
    }

    // Check support user session
    if (supportStore.isAuthenticated && supportStore.expires_in) {
      const expires = new Date(supportStore.expires_in);
      if (now >= expires) {
        console.warn('Support user session expired - logging out');
        handleAutoLogout('support_user');
        isChecking.value = false;
        return;
      }
    }

    isChecking.value = false;
  };

  /**
   * Handle automatic logout
   */
  const handleAutoLogout = async (role: string) => {
    // Clear all stores
    clearAllStores();

    // Show notification to user
    const toast = useToast();
    toast.add({
      severity: 'warn',
      summary: 'Session Expired',
      detail: 'Your session has expired. Please log in again.',
      life: 5000
    });

    // Redirect based on role
    let redirectPath = '/';
    if (role === 'business_user') {
      redirectPath = '/business/auth/sign-in';
    } else if (role === 'support_user') {
      redirectPath = '/support/auth/sign-in';
    }

    await navigateTo(redirectPath, { replace: true });
  };

  /**
   * Start checking for session expiry
   * Check every 60 seconds (1 minute)
   */
  const startAutoLogoutCheck = () => {
    // Check immediately
    checkSessionExpiry();
    
    // Then check every minute
    checkInterval = setInterval(() => {
      checkSessionExpiry();
    }, 60 * 1000); // 60 seconds
  };

  /**
   * Stop checking for session expiry
   */
  const stopAutoLogoutCheck = () => {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  };

  return {
    startAutoLogoutCheck,
    stopAutoLogoutCheck,
    checkSessionExpiry,
  };
}