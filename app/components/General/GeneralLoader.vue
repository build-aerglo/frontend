<template>
  <div
    :style="height ? { height } : { height: '100dvh' }"
    class="w-full flex justify-center items-center"
  >
    <img src="/svg/spinner.svg" />
  </div>
</template>

<script setup>
defineProps(["height"]);
</script>
