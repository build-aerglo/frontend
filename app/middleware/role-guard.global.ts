import useBusinessUser from "~/composables/business/useBusinessUser";
import useUser from "~/composables/useUser";

export default defineNuxtRouteMiddleware((to) => {
  const businessStore = useBusinessUser();
  const userStore = useUser();

  // Determine who is logged in
  const isBusinessUser = businessStore.isAuthenticated && businessStore.role === "business_user";
  const isEndUser = userStore.isAuthenticated && userStore.role === "end_user";
  const isAuthenticated = isBusinessUser || isEndUser;

  const path = to.path;

  // Always public — anyone can access
  const alwaysPublic = [
    /^\/terms-and-conditions/,
    /^\/privacy-policy/,
    /^\/about/,
  ];
  if (alwaysPublic.some((r) => r.test(path))) return;

  // Auth pages — redirect away if already logged in
  const authPages = [
    /^\/business\/auth/,
    /^\/end-user\/auth/,
  ];
  if (authPages.some((r) => r.test(path))) {
    if (isBusinessUser) return navigateTo("/business/dashboard");
    if (isEndUser) return navigateTo("/");
    return; // not logged in, allow through
  }

  // Claim & appeal — only unauthorized users
  const claimPages = [
    /^\/biz\/[^/]+\/claim-business/,
    /^\/biz\/[^/]+\/appeal-claim/,
  ];
  if (claimPages.some((r) => r.test(path))) {
    if (isAuthenticated) return navigateTo("/");
    return;
  }

  //  Business dashboard routes — business users only
  if (/^\/business(?!\/auth)/.test(path)) {
    if (!isAuthenticated) return navigateTo("/business/auth/sign-in");
    if (isEndUser) return navigateTo("/");
    return; // isBusinessUser — allow
  }

  // For-business marketing pages — guests and business users only
  if (/^\/for-business/.test(path)) {
    if (isEndUser) return navigateTo("/");
    return;
  }

  // Main index — business users should not see this 
  if (path === "/") {
    if (isBusinessUser) return navigateTo("/for-business");
    return;
  }

  // Public browsing routes — end users and guests only 
  // Business users should not access these
  const publicBrowsingRoutes = [
    /^\/biz\//,
    /^\/category\//,
    /^\/end-user\/landing/,
  ];
  if (publicBrowsingRoutes.some((r) => r.test(path))) {
    if (isBusinessUser) return navigateTo("/business/dashboard");
    return; // guests and end users — allow
  }

  // End-user only routes
  const endUserRoutes = [
    /^\/end-user(?!\/auth)/,
    /^\/user\//,
    /^\/review\//,
  ];
  if (endUserRoutes.some((r) => r.test(path))) {
    if (!isAuthenticated) return navigateTo("/end-user/auth/forgot-password");
    if (isBusinessUser) return navigateTo("/for-business#categories/");
    return; // isEndUser — allow
  }

  
});