<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50">
    <div class="text-center">
      <i class="pi pi-spin pi-spinner text-4xl text-[#008253] mb-4"></i>
      <h2 class="text-xl font-semibold text-slate-900">Completing login...</h2>
      <p class="text-slate-500">Please wait while we verify your account.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import useSocialAuth from '~/composables/useSocialAuth';

const route = useRoute();
const router = useRouter();
const { handleSocialCallback } = useSocialAuth();

onMounted(async () => {
  // 1. Extract params from URL: ?code=xxx&state=xxx&provider=google
  // Note: Some providers might not send 'provider' back, 
  // you may need to save it in localStorage before redirecting if it's missing.
  const code = route.query.code as string;
  const state = route.query.state as string;
  const provider = (route.query.provider as string) || localStorage.getItem('social_provider');

  if (!code || !provider) {
    console.error("Missing code or provider");
    router.push('../end-user/auth/sign-in?error=missing_data');
    return;
  }

  // 2. Exchange code for tokens
  const success = await handleSocialCallback(provider, code, state);

  if (success) {
    // 3. Cleanup and Redirect
    localStorage.removeItem('social_provider');
    router.push('/profile'); // or your dashboard
  } else {
    router.push('../end-user/auth/sign-in?error=auth_failed');
  }
});
</script>