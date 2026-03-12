<template>
  <Toast />
  <div class="flex flex-col min-h-screen">
    <div class="fixed top-0 w-full shadow-lg z-[100]">
      <NavigationHeaderBusiness />
    </div>
    <div class="flex-1 mt-[76px]">
      <slot />
    </div>
    <div>
      <NavigationFooterBusiness />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
