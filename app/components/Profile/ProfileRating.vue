<template>
  <Rating
    v-model="modelValue"
    :stars="stars"
    :cancel="false"
    :ptOptions="{ mergeProps: true }"
    :pt="{
      onIcon: { class: activeClass },
      offIcon: { class: inactiveClass }
    }"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    stars?: number
    activeClass?: string
    inactiveClass?: string
  }>(),
  {
    stars: 5,
    activeClass: 'text-yellow-400', // active (on)
    inactiveClass: 'text-gray-400'  // inactive (off)
  }
)

const modelValue = defineModel<number>({ required: true })
</script>
