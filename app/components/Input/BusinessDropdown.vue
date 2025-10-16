<template>
  <div class="mb-5">
    <label 
      :for="id" 
      class="block text-[100%] mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-orange">*</span>
    </label>

    <Select
      :id="id"
      :modelValue="modelValue"
      :options="options"
      optionLabel="label"
      optionValue="value"
      :placeholder="placeholder || 'Select an option'"
      :required="required"
      checkmark 
      :highlightOnSelect="false"
      
      @update:modelValue="$emit('update:modelValue', $event)"
      
      class="w-full p-[4px]"
      :class="{'p-invalid': hasError}" 
    />
    
    <small v-if="desc" class="block mt-1 text-[100%] text-primary">{{ desc }}</small>

    <div v-if="hasError" class="mt-1">
      <slot name="error">
        <span class="text-red-500 text-sm">Please select an option.</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">

// Define the Option structure
interface DropdownOption {
    label: string;
    value: string | number | boolean | object | null;
}

// --- PROPS ---
defineProps<{
  modelValue: string | number | null; 
  options: DropdownOption[]; // Required for the list of choices
  label: string;
  id: string; 
  placeholder?: string;
  required?: boolean; 
  desc?: string;
  hasError?: boolean;
}>();

// --- EMITS ---
defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void;
}>();
</script>