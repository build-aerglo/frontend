<template>
  <div 
    class="relative flex flex-col h-full rounded-2xl border transition-all duration-300 hover:shadow-xl"
    :class="tier.highlighted 
      ? 'border-green-600 shadow-lg scale-105 bg-white' 
      : 'border-gray-200 bg-white hover:border-green-300'"
  >
    <!-- Popular Badge -->
    <div 
      v-if="tier.highlighted" 
      class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#deae29] text-white px-4 py-1 rounded-full text-sm font-semibold"
    >
      Most Popular
    </div>

    <div class="p-8 flex flex-col h-full">
      <!-- Header -->
      <div class="mb-1">
        <h3 class="text-2xl font-bold text-gray-900 mb-2">
          {{ tier.name }}
        </h3>
        <p class="text-gray-900 text-sm">
          {{ tier.description }}
        </p>
      </div>

      <!-- Pricing -->
      <div class="mb-1">
        <div class="flex items-baseline">
          <span class="text-4xl font-extrabold text-gray-700">
            <img src="~/assets/svg/naira.svg" class="w-10 h-10 mx-0 inline-block" />{{ tier.price }}
          </span>
          <span class="ml-1 text-slate-900">
            /{{ tier.period }}
          </span>
        </div>
      </div>

      <!-- Features -->
      <div class="mb-3 flex-grow">
        <ul class="space-y-3">
          <li 
            v-for="(feature, index) in tier.features" 
            :key="index"
            class="flex items-start"
          >
            <svg 
              class="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
              :class="tier.highlighted ? 'text-green-600' : 'text-green-500'"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span class="text-gray-700">{{ feature }}</span>
          </li>
        </ul>
      </div>

      <!-- CTA Button -->
      <button 
        @click="handleSubscribe"
        :class="buttonClasses"
      >
        {{ tier.buttonText || 'Get Started' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SubscriptionTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary' | 'enterprise';
}

const props = defineProps<{
  tier: SubscriptionTier;
}>();

const emit = defineEmits<{
  subscribe: [tierName: string];
}>();

const handleSubscribe = () => {
  emit('subscribe', props.tier.name);
};

const buttonClasses = computed(() => {
  const baseClasses = 'w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200';
  
  if (props.tier.highlighted) {
    return `${baseClasses} bg-[#deae29] text-white hover:bg-[#deae29] shadow-lg hover:shadow-xl`;
  }
  
  if (props.tier.buttonVariant === 'enterprise') {
    return `${baseClasses} bg-[#008253] text-white hover:bg-[#008253] shadow-lg hover:shadow-xl`;
  }
  
  return `${baseClasses} bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300`;
});
</script>