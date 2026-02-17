<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50">
    <GeneralLoader v-if="isLoading" />
    
    <div v-else-if="hasError" class="text-center p-8">
      <i class="pi pi-times-circle text-red-500 text-5xl mb-4"></i>
      <h2 class="text-xl font-semibold text-slate-900 mb-2">Authentication Failed</h2>
      <p class="text-slate-500">{{ errorMessage }}</p>
      <p class="text-slate-400 text-sm mt-2">You can close this window.</p>
    </div>

    <div v-else class="text-center p-8">
      <i class="pi pi-check-circle text-green-500 text-5xl mb-4"></i>
      <h2 class="text-xl font-semibold text-slate-900 mb-2">Login Successful!</h2>
      <p class="text-slate-500">Closing window...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import useSocialAuth from '~/composables/useSocialAuth';

const route = useRoute();
const { handleSocialCallback } = useSocialAuth();

const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  const code = route.query.code as string;
  const state = route.query.state as string;
  const provider = (route.query.provider as string) || localStorage.getItem('social_provider') || '';

  if (!code || !provider) {
    hasError.value = true;
    errorMessage.value = 'Missing authentication data.';
    isLoading.value = false;

    // ✅ Notify parent window of error
    window.opener?.postMessage({
      type: 'SOCIAL_AUTH_ERROR',
      message: 'Missing code or provider'
    }, window.location.origin);

    return;
  }

  try {
    const data = await handleSocialCallback(provider, code, state);

    if (data?.access_token) {
      isLoading.value = false;

      // ✅ Send auth data to parent window (login modal)
      window.opener?.postMessage({
        type: 'SOCIAL_AUTH_SUCCESS',
        access_token: data.access_token,
        id_token: data.id_token,
        roles: data.roles,
        expires_in: data.expires_in,
        id: data.id
      }, window.location.origin);

      // ✅ Close popup after sending message
      setTimeout(() => window.close(), 500);

    } else {
      throw new Error('No access token received');
    }
  } catch (err: any) {
    hasError.value = true;
    errorMessage.value = err.message || 'Authentication failed';
    isLoading.value = false;

    // ✅ Notify parent window of error
    window.opener?.postMessage({
      type: 'SOCIAL_AUTH_ERROR',
      message: errorMessage.value
    }, window.location.origin);
  }
});
</script>