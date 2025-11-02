<template>
  <div class="w-full flex justify-center ">
    <div
      class="relative flex items-center w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-white dark:bg-gray-900 shadow-md border border-gray-700 dark:border-gray-700 px-4 sm:px-4 py-6 focus-within:ring-2 focus-within:ring-primary transition-all duration-300"
    >
      <!-- Search Icon -->
      <i class="pi pi-search text-gray-400 mr-3 text-md"></i>

      <!-- Input Field -->
      <input
        v-model="query"
        type="text"
        placeholder="What are you looking for?"
        @input="filterSuggestions"
        @focus="showSuggestions = true"
        @blur="hideWithDelay"
        class="flex-1 bg-transparent outline-none text-gray-600 dark:text-white placeholder-gray-400"
      />
    
      <!-- Suggestion Dropdown -->
      <ul
        v-if="showSuggestions && filteredSuggestions.length"
        class="absolute top-12 left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50"
      >
        <li
          v-for="(item, index) in filteredSuggestions"
          :key="index"
          @mousedown.prevent="selectSuggestion(item)"
          class="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <i class="pi pi-search text-gray-400 mr-2"></i>
          <span class="text-gray-700 dark:text-gray-200">{{ item }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// search query
const query = ref('')

// show/hide suggestion list
const showSuggestions = ref(false)

// predefined search suggestions
const suggestions = ref([
  'Restuarants',
  'Fashion',
  'Hotels',
  'Business & Finance',
  'Media',
  'Medical',
  'Events',
  'Academic',
  'Travel',
  'Animals & Pets',
  'Home Services',
  'Electronics',
])

// filtered suggestions based on input
const filteredSuggestions = ref<string[]>([])

const filterSuggestions = () => {
  const q = query.value.toLowerCase()
  filteredSuggestions.value = q
    ? suggestions.value.filter((s) => s.toLowerCase().includes(q))
    : []
}

const selectSuggestion = (item: string) => {
  query.value = item
  showSuggestions.value = false
}

const hideWithDelay = () => {
  // delay hiding to allow click event to register
  setTimeout(() => (showSuggestions.value = false), 100)
}
</script>

<style scoped>
/* smooth transition for dropdown */
ul {
  animation: fadeIn 0.15s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
