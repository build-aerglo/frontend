<template>
  <div
    class="flex justify-between items-center gap-2.5 w-full p-[20px] shadow-md"
  >
    <div>
      <img
        src="/assets/images/e-user-logo.png"
        alt="Logo"
        class="h-10 w-auto"
      />
    </div>
    <div class="flex gap-[40px] items-center">
      <div class="flex gap-[20px]">
        <div v-for="(i, idx) in headerLinks" :key="idx">
          {{ i.title }}
        </div>
      </div>
      <!-- <Button class="rounded-full" label="Get Started" severity="secondary" /> -->
      <button class="rounded-full !bg-primary text-white">For Business</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const headerLinks = [
  { url: "/write-review", title: "Write a review" },
  { url: "#", title: "|" },
  { url: "/login", title: "Get Started" },
];
</script>
<style scoped>
button {
  padding-inline: 25px;
  padding-block: 15px;
}
</style>
