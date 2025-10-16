<template>
  <div class="mb-5">
    <label 
      :for="id" 
      class="block text-[100%] mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-orange">*</span>
    </label>

    <SelectButton
      :id="id"
      :modelValue="modelValue"
      :options="options"
      optionLabel="label"
      optionValue="value"
      multiple
      
      @update:modelValue="$emit('update:modelValue', $event)"
      
      class="w-full p-[5px]"
      :class="{'p-invalid': hasError}" 
    />
    
    <small v-if="desc" class="block mt-1 text-[100%] text-primary">{{ desc }}</small>

    <div v-if="hasError" class="mt-1">
      <slot name="error">
        <span class="text-red-500 text-sm">Please select a preferred contact mode.</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">


// Define the Option structure (same as Dropdown)
interface SelectOption {
    label: string;
    value: string | number | boolean | object | null;
}

// --- PROPS ---
defineProps<{
  // v-model binding: The current selected value
  modelValue: string | number | null; 
  // List of options to display
  options: SelectOption[]; 
  label: string;
  id: string; 
  required?: boolean; 
  desc?: string;
  hasError?: boolean;
}>();

// --- EMITS ---
defineEmits<{
  // Standard v-model emit
  (e: 'update:modelValue', value: string | number | null): void;
}>();
</script>