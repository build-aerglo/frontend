<template>
  <span
    v-if="badge"
    :class="[
      'text-white text-xs font-semibold px-2 py-[3px] rounded-full shadow flex items-center gap-1',
      badge.bg
    ]"
  >
    <i :class="[badge.icon, 'text-xs']"></i> {{ badge.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type: 'standard' | 'verified' | 'trusted'
}>()

const badge = computed(() => {
  const map = {
    standard: {
      label: 'Standard',
      icon: 'pi pi-thumbs-up',
      bg: 'bg-[#023dff]'
    },
    verified: {
      label: 'Verified',
      icon: 'pi pi-shield',
      bg: 'bg-[#008253]'
    },
    trusted: {
      label: 'Trusted',
      icon: 'pi pi-check-circle',
      bg: 'bg-[#deae29]'
    }
  }
  return map[props.type]
})
</script>
