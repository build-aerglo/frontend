<template>
  <div class="bg-white py-12 sm:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-base font-semibold text-emerald-600 tracking-wider uppercase">
          Trusted by over 1,000 businesses
        </h2>
      </div>
      <!-- Logos -->
      <div class="mt-8 flow-root">
        <div class="flex flex-wrap justify-center gap-x-8 gap-y-4 lg:gap-x-12">
          <div v-for="logo in logos" :key="logo.name" class="flex items-center justify-center">
            <span class="text-xl font-semibold text-gray-400">{{ logo.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const logos = [
  { name: 'Gourmet Foods Co.' },
  { name: 'City Movers' },
  { name: 'Tech Innovate' },
  { name: 'The Boutique Hotel' },
  { name: 'Clean & Bright' },
];
</script>
