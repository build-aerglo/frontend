<template>
  <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
      <span
        class="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-3"
        :class="color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'"
      >
        <i :class="`pi ${icon} text-sm`" />
        {{ label }}
      </span>
      <h2 class="text-2xl md:text-3xl font-bold text-white leading-tight">{{ title }}</h2>
      <p class="text-gray-500 mt-2 text-sm md:text-base max-w-xl leading-relaxed">{{ subtitle }}</p>
    </div>
    <div
      class="shrink-0 w-px hidden sm:block self-stretch opacity-20"
      :class="color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  title: string
  subtitle: string
  color: 'emerald' | 'amber'
}>()
</script>