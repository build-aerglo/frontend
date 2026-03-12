<template>
  <Toast />
  <div class="flex flex-col min-h-screen">
    <NavigationHeaderUser />
    <div class="flex-1 sm:mt-[81px] mt-[71px]">
      <slot />
    </div>
    <NavigationFooterUser />
  </div>
</template>

<script setup lang="ts"></script>
