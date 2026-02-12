import useBusinessUser from '~/composables/business/useBusinessUser';
import useUser from '~/composables/useUser';
import useSupportUser from '~/composables/support/useSupportUser';

export default defineNuxtRouteMiddleware((to, from) => {
  const businessStore = useBusinessUser();
  const userStore = useUser();
  const supportStore = useSupportUser();

  // Define route patterns and their allowed roles
  const routeRules = [
    {
      pattern: /^\/business(?!\/auth)/,  // /business/* but NOT /business/auth/*
      allowedRoles: ['business_user'],
      redirect: '/business/auth/sign-in'
    },
    {
      pattern: /^\/support(?!\/auth)/,  // /support/* but NOT /support/auth/*
      allowedRoles: ['support_user'],
      redirect: '/support/auth/sign-in'
    },
    {
      pattern: /^\/end-user(?!\/auth)/,  // /end-user/* but NOT /end-user/auth/*
      blockedRoles: ['business_user', 'support_user'],  // Block business and support users
      redirect: '/'  // Or '/support/dashboard' depending on role
    },
    {
      pattern: /^\/(user|review)/,  // /user/* or /review/*
      allowedRoles: ['end_user'],
      redirect: '/'
    }
  ];

  // Get current user's role
  let currentRole = null;
  if (businessStore.isAuthenticated && businessStore.role) {
    currentRole = businessStore.role;
  } else if (userStore.isAuthenticated && userStore.role) {
    currentRole = userStore.role;
  } else if (supportStore.isAuthenticated && supportStore.role) {
    currentRole = supportStore.role;
  }

  // Check each route rule
  for (const rule of routeRules) {
    if (rule.pattern.test(to.path)) {
      
      // Handle blocked roles (for end-user routes)
      if (rule.blockedRoles && currentRole && rule.blockedRoles.includes(currentRole)) {
        console.warn(`Access denied: ${currentRole} tried to access ${to.path}`);
        
        // Redirect based on their actual role
        if (currentRole === 'business_user') {
          return navigateTo('/business/dashboard');
        } else if (currentRole === 'support_user') {
          return navigateTo('/support/dashboard');
        }
      }
      
      // Handle allowed roles (for business/support/user routes)
      if (rule.allowedRoles) {
        // If user is authenticated but has wrong role
        if (currentRole && !rule.allowedRoles.includes(currentRole)) {
          console.warn(`Access denied: ${currentRole} tried to access ${to.path}`);
          
          // Redirect based on their actual role
          if (currentRole === 'business_user') {
            return navigateTo('/business/dashboard');
          } else if (currentRole === 'support_user') {
            return navigateTo('/support/dashboard');
          } else if (currentRole === 'end_user') {
            return navigateTo('/');
          }
        }
        
        // If route requires auth but user is not authenticated
        if (!currentRole) {
          return navigateTo(rule.redirect);
        }
      }
      
      // Break after first match to avoid checking other rules
      break;
    }
  }
});