<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label || $slots.label"
      :for="formId"
      class="block text-sm text-contrast mb-1 flex items-center gap-2"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </label>

    <!-- Input wrapper -->
    <div
      class="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300 mt-1 mb-3 bg-secondaryLinen"
    >
      <!-- Left Icon -->
      <div
        v-if="icon"
        class="px-3 text-gray-500 flex items-center justify-center"
      >
        <i :class="`pi pi-${icon}`"></i>
      </div>

      <!-- Input -->
      <input
        :id="formId"
        v-model="model"
        :type="inputType"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="flex-1 px-3 py-2 outline-none text-contrast bg-transparent"
      />

      <!-- Password toggle -->
      <button
        v-if="isPasswordType"
        type="button"
        class="px-3 text-contrast hover:text-primary transition-colors duration-200 font-bold"
        @click="toggleVisibility"
      >
        <i :key="visibilityIcon" :class="visibilityIcon"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(['placeholder', 'class', 'inputClass', 'label', 'type', 'required', 'disabled', 'icon']);
const model = defineModel<string>()

const formId = `input-${Math.random().toString(36).slice(2, 10)}`
const isVisible = ref(false)

const isPasswordType = computed(() => props.type === 'password')
const inputType = computed(() =>
  isPasswordType.value ? (isVisible.value ? 'text' : 'password') : props.type || 'text'
)
const visibilityIcon = computed(() => (isVisible.value ? 'pi pi-eye' : 'pi pi-eye-slash'))

const toggleVisibility = () => {
  isVisible.value = !isVisible.value
  console.log('Password visibility:', isVisible.value)
}
</script>

<style scoped>
</style>
