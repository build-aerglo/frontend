<template>
  <div class="mb-5">
    <label 
      :for="id" 
      class="block text-[100%] mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-orange">*</span>
    </label>

    <FileUpload
      :id="id"
      mode="advanced" 
      :name="fieldName" 
      :multiple="multiple"
      :accept="accept"
      :maxFileSize="maxFileSize"
      :disabled="isLoading"
      
      :chooseLabel="chooseLabel"
      :uploadLabel="uploadLabel" 
      :cancelLabel="cancelLabel"

      @select="onFileSelect" 
      
      class="w-full"
      :class="{'p-invalid': hasError}"
    >
      <template #empty>
        <p>Drag and drop {{ multiple ? 'files' : 'your file' }} here to upload.</p>
      </template>
    </FileUpload>

    <small v-if="desc" class="block mt-1 text-[100%] text-primary">{{ desc }}</small>

    <div v-if="hasError" class="mt-1">
      <slot name="error">
        <span class="text-red-500 text-sm">Please upload the required file(s).</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  // v-model binding is handled differently for files, but we keep modelValue for clarity
  modelValue: File | File[] | string | null; 
  fieldName: string;         // Name of the field in formState (e.g., 'logo', 'mediaFiles')
  label: string;
  id: string;
  
  // Custom FileUpload props
  multiple?: boolean;        // Allows multiple file selection
  accept?: string;           // File types allowed (e.g., 'image/*')
  maxFileSize?: number;      // Maximum file size in bytes
  isLoading?: boolean;       // For disabling during upload process
  chooseLabel?: string;
  uploadLabel?: string;
  cancelLabel?: string;

  // Standard form props
  required?: boolean; 
  desc?: string;
  hasError?: boolean;
}>();

// --- EMITS ---
const emit = defineEmits<{
  // Standard v-model emit for two-way data binding
  (e: 'update:modelValue', value: File | File[] | null): void;
}>();

// --- Logic to handle PrimeVue's @select event ---
const onFileSelect = (event: { files: File[] }) => {
    // If multiple is enabled, emit the array of files
    if (props.multiple) {
        emit('update:modelValue', event.files);
    } 
    // If not multiple, emit only the first file
    else if (event.files.length > 0) {
        emit('update:modelValue', event.files[0]);
    }
};
</script>