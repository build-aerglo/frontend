<template>
  <!-- statistics -->
    <div class="section bg-gradient-to-r from-[#deae29] to-[#008253] py-4">
      <div class="grid grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 text-white">
        <!-- Growing Community - Hidden on mobile, visible on large screens -->
        <div class="hidden lg:flex flex-col justify-center">
          <div class="font-bold text-2xl mb-2 drop-shadow-lg">
            Growing Community
          </div>
          <div class="text-sm text-green-50">
            Real people. Authentic reviews. Better decisions
          </div>
        </div>
        
        <!-- Statistics -->
        <div
          v-for="(i, idx) in statistics"
          :key="idx"
          class="flex flex-col justify-center items-center p-4 lg:p-6"
        >
          <div class="font-bold text-4xl lg:text-5xl drop-shadow-lg mb-2">
            {{ i.count }}
          </div>
          <div class="text-xs sm:text-sm text-center text-green-50">{{ i.title }}</div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(["statistics"])
</script>

<style scoped>

</style>