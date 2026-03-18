<template>
  <div class="relative -mt-12 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="backdrop-blur-xl bg-black/40 rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8">
        <div class="grid grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 text-white">
          <!-- Growing Community -->
          <div class="hidden lg:flex flex-col justify-center">
            <div class="font-bold text-2xl mb-2 drop-shadow-lg">
              Growing Community
            </div>
            <div class="text-sm text-white/80">
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
            <div class="text-xs sm:text-sm text-center text-white/80">{{ i.title }}</div>
          </div>
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