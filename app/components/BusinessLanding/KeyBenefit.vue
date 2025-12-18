<template>
  <div class="bg-gray-50 py-20 sm:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Sell Outcomes, Not Just Tools
        </h2>
        <p class="mt-4 text-lg text-gray-600">
          Focus on what matters most: growing your business and satisfying your customers.
        </p>
      </div>
      <div class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div v-for="benefit in benefits" :key="benefit.name" class="p-6 bg-white rounded-lg shadow-md">
          <div class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-emerald-600">
            <!-- Heroicon: Check -->
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="benefit.icon" />
            </svg>
          </div>
          <div class="mt-5">
            <h3 class="text-lg font-medium text-gray-900">{{ benefit.name }}</h3>
            <p class="mt-2 text-base text-gray-600">
              {{ benefit.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const benefits = [
  {
    name: 'Build Trust',
    description: 'Leverage verified reviews to build a powerful and trustworthy brand image that attracts new customers.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    name: 'Increase Visibility',
    description: 'Improve your local search ranking and online credibility, making it easier for customers to find you.',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
  },
  {
    name: 'Engage with Customers',
    description: 'Directly respond to feedback, resolve issues, and show customers you care, fostering loyalty.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    name: 'Understand Sentiment',
    description: 'Use powerful analytics to understand what customers are saying and make data-driven decisions.',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  },
];
</script>
