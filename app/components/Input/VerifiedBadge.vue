<template>
  <div class="mb-5 flex items-center justify-between p-3 border rounded-lg bg-gray-50">
    <div>
      <label :for="id" class="block text-[100%] font-medium text-matte-black cursor-pointer">
        {{ label }}
      </label>
      
      <small v-if="desc" class="block mt-1 text-[100%] text-primary">{{ desc }}</small>
    </div>

    <Checkbox
      :id="id"
      :modelValue="modelValue"
      indeterminate
      binary
      
      @update:modelValue="$emit('update:modelValue', $event)"
      
      :class="{'p-invalid': hasError}" 
    />
  </div>
  
  <div v-if="hasError" class="mt-1">
    <slot name="error">
      <span class="text-red-500 text-sm">A choice is required for this setting.</span>
    </slot>
  </div>
</template>

<script setup lang="ts">

// --- PROPS ---
defineProps<{
  // v-model binding: Must be a boolean
  modelValue: boolean; 
  label: string;
  id: string; 
  // Required is less common for a boolean toggle, but kept for consistency
  required?: boolean; 
  desc?: string;
  hasError?: boolean;
}>();

// --- EMITS ---
defineEmits<{
  // Standard v-model emit for boolean value
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>