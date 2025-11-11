<template>
  <div 
    class="verified-badge flex items-center justify-center p-[2px] transition-colors duration-300"
    :class="[
      isVerified ? 'bg-link text-white' : 'bg-gray-400 text-gray-700',
      { 'w-5 h-5 text-xs': size === 'sm' },
      { 'w-6 h-6 text-sm': size === 'md' },
      { 'w-8 h-8 text-base': size === 'lg' }
    ]"
  >
    <i 
      :class="isVerified ? 'pi pi-check' : 'pi pi-check'" 
      aria-hidden="true"
    ></i>
  </div>
</template>

<script setup>
const props = defineProps({
  isVerified: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
});
</script>

<style scoped>
.verified-badge {
  
  clip-path: polygon(
    50% 0%, 
    66% 5%, 
    80% 0%, 
    85% 15%, 
    100% 20%, 
    95% 33%, 
    100% 50%, 
    95% 66%, 
    100% 80%, 
    85% 85%, 
    80% 100%, 
    66% 95%, 
    50% 100%, 
    33% 95%, 
    20% 100%, 
    15% 85%, 
    0% 80%, 
    5% 66%, 
    0% 50%, 
    5% 33%, 
    0% 20%, 
    15% 15%, 
    20% 0%, 
    33% 5%
  );
}
</style>