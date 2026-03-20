<template>
    <div class="bg-[#e4faeb] py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 ">
          <!-- Growing Community - Hidden on mobile, visible on large screens -->
          <div class="hidden lg:flex flex-col justify-center">
            <div class="font-bold text-2xl mb-2 drop-shadow-lg text-gray-700">
              Growing Community
            </div>
            <div class="text-sm">
              Real people. Authentic reviews. Better decisions
            </div>
          </div>
          
          <!-- Statistics -->
          <div
            v-for="(i, idx) in statistics"
            :key="idx"
            class="flex flex-col justify-center items-center p-4 lg:p-6"
          >
            <div class="font-bold text-3xl lg:text-4xl drop-shadow-lg mb-2 text-gray-700">
              {{ i.count }}
            </div>
            <div class="text-xs sm:text-sm text-center">{{ i.title }}</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(["statistics"])
</script>

<style scoped>

</style>