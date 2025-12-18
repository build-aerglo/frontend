<template>
  <div class="bg-gray-50 py-20 sm:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto lg:max-w-none">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Get started in 3 simple steps
          </h2>
          <p class="mt-4 text-lg text-gray-600">
            It's never been easier to take control of your online reputation.
          </p>
        </div>
        <div class="mt-12 space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          <div v-for="step in steps" :key="step.name" class="relative text-center">
            <div class="flex items-center justify-center">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-600 text-white font-bold text-xl">
                  {{ step.number }}
                </div>
              </div>
            </div>
            <div class="mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ step.name }}</h3>
              <p class="mt-2 text-base text-gray-600">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const steps = [
  {
    number: '1',
    name: 'Claim Your Business Profile',
    description: 'Find your business on our platform or create a new profile in minutes to get started.',
  },
  {
    number: '2',
    name: 'Collect & Manage Reviews',
    description: 'Use our tools to invite customers to leave reviews and manage all your feedback from one place.',
  },
  {
    number: '3',
    name: 'Gain Insights & Grow',
    description: 'Analyze your feedback, engage with customers, and use insights to build your reputation and drive sales.',
  },
];
</script>
