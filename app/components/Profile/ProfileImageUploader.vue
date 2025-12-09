<template>
  <div
    class="relative w-[140px] h-[140px] md:w-[160px] md:h-[160px] flex-shrink-0 rounded-[20px] overflow-hidden"
    :class="{ 'cursor-pointer': !disabled }"
    @click="!disabled && triggerFileInput()"
  >
    <!-- IMAGE or PLACEHOLDER -->
    <img
      :src="displayImage"
      alt="Profile"
      class="w-full h-full object-cover rounded-[20px]"
    />

    <!-- EDIT OVERLAY -->
    <div
      v-if="!disabled"
      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300"
    >
      <i class="pi pi-camera text-white text-2xl"></i>
    </div>

    <!-- HIDDEN FILE INPUT -->
    <input
      type="file"
      ref="fileInput"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string | null;
  disabled?: boolean;
}>()
const displayImage = computed(() => {
  if (!props.modelValue || props.modelValue.trim() === '') {
    return '/images/profile/profile-picture.jpg'
  }
  return props.modelValue
})
const emit = defineEmits(['update:modelValue'])

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => fileInput.value?.click()

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  emit('update:modelValue', url)
}
</script>
