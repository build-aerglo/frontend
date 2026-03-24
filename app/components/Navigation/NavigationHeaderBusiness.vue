<template>
  <div class="flex justify-between items-center gap-2.5 w-full px-5 py-2.5 shadow-md bg-white">
    <NuxtLink to="/for-business/index-v2" class="flex flex-col items-center">
      <img
        src="/assets/images/e-user-logo.png"
        alt="Logo"
        class="h-10 w-auto"
      />
      <div class="text-[80%] text-center text-slate-500">For Business</div>
    </NuxtLink>

    <div class="flex gap-2.5 items-center">
      <NuxtLink to="/business/login">
        <ButtonCustom primary="true" label="Sign In" size="lg" />
      </NuxtLink>
      <NuxtLink to="/business/register">
        <ButtonCustom secondary="true" label="Claim a Business" size="lg" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>