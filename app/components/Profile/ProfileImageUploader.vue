<template>
  <div class="relative w-[140px] h-[140px] md:w-[160px] md:h-[160px] flex-shrink-0 rounded-[20px] overflow-hidden"
    :class="{ 'cursor-pointer': !disabled }" @click="!disabled && triggerFileInput()">
    <!-- IMAGE or PLACEHOLDER -->
    <img :src="currentSrc" alt="Profile" class="w-full h-full object-cover rounded-[20px]" @error="onImgError">
    <!-- EDIT OVERLAY -->
    <div v-if="!disabled"
      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
      <i class="pi pi-camera text-white text-2xl"></i>
    </div>

    <!-- HIDDEN FILE INPUT -->
    <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileChange" />
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
    return '/images/profile/user.jpg'
  }
  return props.modelValue
})
const emit = defineEmits(['update:modelValue'])

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => fileInput.value?.click()

const path = ref("profile");
const handleFileChange = async (e: Event) => {
  // @ts-ignore
  const file = e?.target?.files[0];
  if (!file) return;

  const form = new FormData();

  form.append("file", file);
  form.append("path", path.value);

  const res = await $fetch("/api/upload", {
    method: "POST",
    body: form,
  });

  // @ts-ignore
  const uploadedImg = res.url;
  if (uploadedImg) {
    currentSrc.value = uploadedImg;
    emit('update:modelValue', uploadedImg)
  }
}

// handle fallback
const fallback = '/images/store.jpeg'
const currentSrc = ref<any>(displayImage.value)
const triedFallback = ref(false)

const onImgError = () => {
  if (!triedFallback.value) {
    triedFallback.value = true
    currentSrc.value = fallback
  }
}

// If the prop changes later, reset
watch(() => displayImage, (newVal) => {
  triedFallback.value = false
  currentSrc.value = newVal || fallback
})

</script>
