<template>
  <Toast />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import useAutoLogout from '~/composables/useAutoLogout';

const { startAutoLogoutCheck, stopAutoLogoutCheck } = useAutoLogout();

onMounted(() => {
  startAutoLogoutCheck();
});

onUnmounted(() => {
  stopAutoLogoutCheck();
});
</script>