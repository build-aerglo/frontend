<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useLanguage } from '~/composables/useLanguage';
const { locale, setLanguage } = useLanguage();
setLanguage(locale.value || 'en');
// onBeforeMount(() => {
// });
</script>