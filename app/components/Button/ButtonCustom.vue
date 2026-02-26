<template>
  <button
    :type="type || 'button'"
    :disabled="isLoading || disabled"
    @click="$emit('clicked')"
    class="flex items-center justify-center gap-[5px] text-[14px] w-full disabled:cursor-not-allowed disabled:opacity-70"
    :class="[
      noZoom
        ? ''
        : 'transition transform duration-150 ease-in-out hover:scale-105',
      // Base style (depends on primary)
      primary
        ? '!bg-primary text-white'
        : '!border-primary border !text-primary bg-white',

      // Size
      size === 'lg' ? 'py-[10px] px-[15px]' : 'py-[6px] px-[7px]',

      // Shape
      rounded ? 'rounded-full' : 'rounded-[5px]',

      // External custom styles (overrides)
      inputClass,
    ]"
  >
    <i
      v-if="icon || isLoading"
      :class="`pi pi-${isLoading ? 'spin pi-spinner' : icon}`"
      class="px-3"
    ></i>
    {{ label }}
  </button>
</template>

<script setup>
const props = defineProps([
  "type",
  "primary",
  "label",
  "disabled",
  "icon",
  "isLoading",
  "size",
  "inputClass",
  "rounded",
  "isEditing",
  "noZoom",
]);
const events = defineEmits(["clicked"]);
</script>
