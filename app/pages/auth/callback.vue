<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50">
    <GeneralLoader v-if="isLoading" />
    
    <div v-else class="text-center">
      <h2 class="text-xl font-semibold text-slate-900">Completing login...</h2>
      <p class="text-slate-500">Please wait while we verify your account.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useSocialAuth from '~/composables/useSocialAuth';
import useUser from '~/composables/useUser';

const route = useRoute();
const router = useRouter();
const userStore = useUser();
const { handleSocialCallback } = useSocialAuth();

const isLoading = ref(true);

onMounted(async () => {
  const code = route.query.code as string;
  const state = route.query.state as string;
  const provider = (route.query.provider as string) || localStorage.getItem('social_provider');

  if (!code || !provider) {
    console.error("Missing code or provider");
    isLoading.value = false; // Stop loader to show error state if needed
    router.push('/?error=missing_data');
    return;
  }

  // 2. Exchange code for tokens
  const success = await handleSocialCallback(provider, code, state);

  if (success) {
    if (userStore.id) {
      router.push(`/user/${userStore.id}`);
    } else {
      router.push('/');
    }
  } else {
    // If auth fails, stop the loader so user can potentially see a message 
    // or be redirected back to login
    isLoading.value = false;
    router.push('/?error=auth_failed');
  }
});
</script>