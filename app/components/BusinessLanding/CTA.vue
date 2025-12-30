<template>
  <div class="bg-emerald-600">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between text-center lg:text-left">
      <h2 class="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
        <span class="block">Ready to take control?</span>
        <span class="block text-emerald-200">Start growing your reputation today.</span>
      </h2>
      <div class="mt-8 flex justify-center lg:mt-0 lg:flex-shrink-0">
        <div class="inline-flex rounded-md shadow">
          <NuxtLink to="/business/[id]" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-emerald-600 bg-white hover:bg-emerald-50">
            Claim Your Business
          </NuxtLink>
        </div>
        <div class="ml-4 inline-flex rounded-md shadow">
          <NuxtLink to="/subscription" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-emerald-700 hover:bg-emerald-800">
            Start Free Trial
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
