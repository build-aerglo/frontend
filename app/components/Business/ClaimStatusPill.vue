<template>
  <div
  class="inline-flex items-center justify-center rounded-full font-small transition-all"
  :class="statusClasses"
  style="padding: 0.25rem 0.375rem !important; font-size: 0.65rem !important;"
>
    <span class="flex items-center">
      <span>{{ statusText }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: 'claimed' | 'unclaimed' | 'in_progress'
}

const props = defineProps<Props>()

const statusConfig = computed(() => {
  switch (props.status) {
    case 'claimed':
      return {
        text: 'Claimed Profile',
        classes: 'bg-emerald-50 text-emerald-700 border border-emerald-600',
       
      }
    case 'in_progress':
      return {
        text: 'Claim In Progress',
        classes: 'bg-amber-50 text-amber-700 border border-amber-600',
        
      }
    case 'unclaimed':
      return {
        text: 'Unclaimed Profile',
        classes: 'bg-gray-100 text-gray-700 border border-gray-300',
        
      }
    default:
      return {
        text: 'Claimed Profile',
        classes: 'bg-emerald-50 text-emerald-700 border border-emerald-600',
        
      }
  }
})

const statusText = computed(() => statusConfig.value.text)
const statusClasses = computed(() => statusConfig.value.classes)
</script>