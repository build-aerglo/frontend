<template>
  <div class="w-[70%]">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search class="w-5 h-5 ml-2 text-gray-400" />
      </div>
      
      <input
        v-model="searchValue"
        type="text"
        placeholder="Search categories..."
        class="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008253] focus:border-[#008253] outline-none transition-all text-gray-800 placeholder-gray-400"
        @input="handleInput"
      />
      
      <button
        v-if="searchValue"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Clear search"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
    
    <div v-if="searchValue" class="mt-2 text-sm text-gray-500">
      Searching for: <span class="font-medium text-gray-700">{{ searchValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
}>()

const searchValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue
})

const handleInput = () => {
  emit('update:modelValue', searchValue.value)
}

const clearSearch = () => {
  searchValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}
</script>