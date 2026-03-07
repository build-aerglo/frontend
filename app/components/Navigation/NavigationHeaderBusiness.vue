<template>
  <div
    class="flex justify-between items-center gap-2.5 w-full px-[20px] py-[10px] shadow-md text-white"
    style="
      background:
        linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), #008253;
    "
  >
    <div class="flex flex-col">
      <img
        src="/assets/images/e-user-logo.png"
        alt="Logo"
        class="h-10 w-auto"
      />
      <div class="text-[80%] text-center">For Business</div>
    </div>
    <div class="flex-1 border"></div>
    <div class="flex gap-[20px] items-center">
      <button class="rounded-full hover:border text-primary">Sign In</button>
      <button class="rounded-full bg-gold text-white">Get Started</button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
button {
  padding-inline: 25px;
  padding-block: 15px;
}
</style>
