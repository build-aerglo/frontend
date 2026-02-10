<template>
  <div class="min-h-screen">
    <ResetPassword />
  </div>
</template>

<script setup lang="ts">
import ResetPassword from "~/components/Auth/ResetPassword/ResetPassword.vue";
definePageMeta({
  layout: false,
});

const redirect = ref("/");
const route = useRoute();
onBeforeMount(() => {
  const red = route.query.redirect as string;
  if (!red) {
    return;
  }

  redirect.value = red;
});
</script>
