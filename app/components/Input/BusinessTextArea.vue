<template>
  <div class="mb-5">
    <label :for="id" class="block text-[100%] mb-2">
      {{ label }}
      <span v-if="required" class="text-orange">*</span>
    </label>
    
    <Textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      
      :rows="rows" 
      :cols="cols" 
      
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      class="w-full"
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

// --- PROPS: Added rows and cols for size control ---
defineProps<{
  modelValue: string | number | null; 
  label: string;
  id: string; 
  placeholder?: string;
  required?: boolean; 
  desc?: string;
  hasError?: boolean;
  
  rows?: number; // Custom prop for sizing
  cols?: number; // Custom prop for sizing
}>();

// --- EMITS ---
defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();
</script>