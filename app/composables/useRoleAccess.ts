import useBusinessUser from './business/useBusinessUser';
import useUser from './useUser';

export default function useRoleAccess() {
  const businessStore = useBusinessUser();
  const userStore = useUser();

  // Get current active role
  const currentRole = computed(() => {
    if (businessStore.role) return businessStore.role;
    if (userStore.role) return userStore.role;
    return null; // guest
  });

  // Check if user is authenticated (any role)
  const isAuthenticated = computed(() => {
    return businessStore.isAuthenticated || userStore.isAuthenticated;
  });

  // Simple role checkers
  const isGuest = computed(() => !currentRole.value);
  const isBusinessUser = computed(() => currentRole.value === 'business_user');
  const isEndUser = computed(() => currentRole.value === 'end_user');
  const isSupportUser = computed(() => currentRole.value === 'support_user');

  return {
    currentRole,
    isGuest,
    isBusinessUser,
    isEndUser,
    isSupportUser,
    isAuthenticated
  };
}