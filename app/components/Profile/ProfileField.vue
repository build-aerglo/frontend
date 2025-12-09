<template>
  <div 
    class="flex gap-2" 
    :class="{ 
      'items-center': inputType !== 'textarea', 
      'flex-col items-start w-full': inputType === 'textarea' 
    }"
  >
    <i 
      v-if="inputType !== 'textarea'" 
      :class="[icon, '!text-primary']"
    ></i> 
    
    <template v-if="!isEditing">
      <span 
        :class="{ 'whitespace-pre-wrap leading-relaxed w-full': inputType === 'textarea' }"
        class="text-gray-700"
      >
        {{ modelValue || placeholder }}
      </span>
    </template>
    
    <template v-else>
      
      <textarea
        v-if="inputType === 'textarea'"
        v-model="localValue"
        :rows="rows" 
        :placeholder="placeholder"
        class="w-full mt-1 mb-3 p-2 border border-gray-300 outline-none rounded-[5px] 
               focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300 
               bg-secondaryLinen text-gray-800"
      />
      
      <input
        v-else
        v-model="localValue"
        type="text"
        :placeholder="placeholder"
        class="border border-gray-300 outline-none rounded-[5px] px-2 py-1 w-[200px] focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300 
         bg-secondaryLinen "
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
  icon?: string;
  rows?: string;
  placeholder: string;
  isEditing: boolean;           // <-- FIXED (optional)
  inputType?: 'text' | 'textarea';
}>();

const emit = defineEmits(['update:modelValue']);

const localValue = ref(props.modelValue);
watch(localValue, val => emit('update:modelValue', val));
</script>