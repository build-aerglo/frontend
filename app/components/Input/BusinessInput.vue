<template>
  <div class="mb-5">
    <label :for="id" class="block text-[100%] mb-2">
      {{ label }}
      <span v-if="required" class="text-primary"></span>
    </label>
    <InputText
    :id="id"
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :required="required"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    class="w-full p-[10px] focus:border-accent"
    :class="{'p-invalid': hasError}" 
    />
    <small v-if="desc" class="block mt-1 text-[100%] text-primary">{{ desc }}</small>
    <div v-if="hasError" class="mt-1">
      <slot name="error">
        <span class="text-red-500 text-sm">This field is required.</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | number | null; 
  label: string;
  type?: string;
  id: string;
  placeholder?: string;
  required?: boolean; 
  desc?: string;
  hasError?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

</script>

<style scoped>

</style>